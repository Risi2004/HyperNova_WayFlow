const express = require('express')
const { sql, withTransaction } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const { transitionOrder } = require('../services/orderStatus')
const { toColomboParts, now } = require('../services/orderSchedule')

// Trips after the plan is published: loaders verify and load them, drivers run them.
//
//   trip:  planned → loading → loaded → dispatched → completed
//   order: planned → loading → loaded | shortfall → dispatched → delivered | partial | failed
//
// Driver writes carry a client_event_id so records captured offline can be replayed safely.

const router = express.Router()
router.use(verifyToken)

const OPS = ['Loader', 'Dispatcher', 'Admin']
const DONE = ['delivered', 'partial', 'failed']
const FAILED_CATEGORIES = ['closed', 'refused']

const actorOf = (req) => ({ userId: req.user.userId, role: req.user.role })
const isRole = (req, role) => (req.user.role || '').toLowerCase() === role.toLowerCase()

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

function sendError(res, err, fallback) {
  const status = err.status || 500
  if (status >= 500) console.error(fallback, err)
  res.status(status).json({ error: status >= 500 ? `${fallback}. Please try again.` : err.message })
}

// 'HH:MM' in Colombo for an ISO timestamp (or now).
function colomboClock(ts) {
  const d = ts ? new Date(ts) : now()
  if (Number.isNaN(d.getTime())) return colomboClock()
  const shifted = new Date(d.getTime() + 330 * 60000)
  return shifted.toISOString().slice(11, 16)
}
const toMin = (t) => {
  const [h, m] = String(t).split(':').map(Number)
  return h * 60 + m
}

// Loaders work at one depot; their facility label starts with it ("Kandy Hub - Bay 01 …").
async function depotOf(req) {
  if (req.query.depot) return req.query.depot === 'all' ? null : req.query.depot
  if (!isRole(req, 'Loader')) return null
  const [u] = await sql.query('SELECT facility FROM users WHERE user_id = $1', [req.user.userId])
  return /^kandy/i.test(u?.facility || '') ? 'Kandy' : 'Peliyagoda'
}

// Loads a trip and checks the caller may act on it.
async function loadTrip(db, req, tripId, { forUpdate = false } = {}) {
  const [trip] = await db.query(`SELECT * FROM trips WHERE trip_id = $1 ${forUpdate ? 'FOR UPDATE' : ''}`, [tripId])
  if (!trip || trip.status === 'draft') throw httpError(404, `Trip ${tripId} not found.`)
  if (isRole(req, 'Driver')) {
    const [u] = await db.query('SELECT assigned_vehicle_id FROM users WHERE user_id = $1', [req.user.userId])
    if (trip.driver_user_id !== req.user.userId && trip.vehicle_id !== u?.assigned_vehicle_id) {
      throw httpError(403, 'This trip is assigned to another driver.')
    }
  } else if (!OPS.some((r) => isRole(req, r))) {
    throw httpError(403, 'Not allowed.')
  }
  return trip
}

const TRIP_LIST_SELECT = `
  SELECT t.trip_id, t.delivery_date, t.vehicle_id, t.trip_number, t.depot, t.brand, t.district, t.status,
         t.planned_departure_time, t.planned_return_time, t.total_planned_distance_km, t.total_weight_kg,
         t.total_volume_m3, t.dispatched_at, t.completed_at, t.loading_completed_at,
         v.type AS vehicle_type, v.temp AS vehicle_temp, v.weight_cap_kg, v.volume_cap_m3,
         u.full_name AS driver_name, u.phone AS driver_phone,
         (SELECT COUNT(*)::int FROM trip_stops s WHERE s.trip_id = t.trip_id) AS stops,
         (SELECT COUNT(*)::int FROM loading_verifications lv WHERE lv.trip_id = t.trip_id) AS verified,
         (SELECT COUNT(*)::int FROM loading_verifications lv WHERE lv.trip_id = t.trip_id AND lv.shortfall_flag) AS shortfalls,
         (SELECT COUNT(*)::int FROM trip_stops s WHERE s.trip_id = t.trip_id AND s.status IN ('delivered','partial','failed')) AS completed_stops,
         (SELECT COUNT(*)::int FROM operational_issues i WHERE i.related_trip_id = t.trip_id AND i.resolution_status <> 'resolved') AS open_issues,
         (SELECT COUNT(*)::int FROM delivery_records dr JOIN trip_stops s ON s.order_id = dr.order_id WHERE s.trip_id = t.trip_id AND dr.is_late) AS late_stops,
         (SELECT COUNT(*)::int FROM delivery_records dr JOIN trip_stops s ON s.order_id = dr.order_id WHERE s.trip_id = t.trip_id AND dr.recorded_offline) AS offline_records,
         (SELECT s.to_outlet_id FROM trip_stops s WHERE s.trip_id = t.trip_id AND s.status NOT IN ('delivered','partial','failed') ORDER BY s.stop_sequence LIMIT 1) AS next_outlet_id,
         (SELECT s.stop_sequence FROM trip_stops s WHERE s.trip_id = t.trip_id AND s.status NOT IN ('delivered','partial','failed') ORDER BY s.stop_sequence LIMIT 1) AS next_stop_sequence,
         (SELECT MIN(s.planned_arrival_time) FROM trip_stops s WHERE s.trip_id = t.trip_id) AS first_arrival,
         (SELECT MAX(s.planned_arrival_time) FROM trip_stops s WHERE s.trip_id = t.trip_id) AS last_arrival
  FROM trips t
  JOIN vehicles v ON v.vehicle_id = t.vehicle_id
  LEFT JOIN users u ON u.user_id = COALESCE(t.driver_user_id, (SELECT dv.user_id FROM users dv WHERE dv.assigned_vehicle_id = t.vehicle_id AND dv.role = 'Driver' ORDER BY dv.created_at LIMIT 1))`

// ---------- Lists ----------

// GET /api/trips?date=&depot= — published trips for loaders and dispatchers.
router.get('/', requireRole(...OPS), async (req, res) => {
  try {
    const depot = await depotOf(req)
    const today = toColomboParts(now()).date
    const dates = await sql.query(
      `SELECT DISTINCT delivery_date AS date FROM trips
       WHERE status <> 'draft' AND ($1::text IS NULL OR depot = $1) AND delivery_date >= ($2::date - 7)
       ORDER BY delivery_date LIMIT 14`,
      [depot, today]
    )
    const dateList = dates.map((d) => d.date)
    const date = req.query.date || dateList.find((d) => d >= today) || dateList[dateList.length - 1] || today
    const trips = await sql.query(
      `${TRIP_LIST_SELECT}
       WHERE t.status <> 'draft' AND t.delivery_date = $1 AND ($2::text IS NULL OR t.depot = $2)
       ORDER BY t.planned_departure_time, t.vehicle_id, t.trip_number`,
      [date, depot]
    )

    const metrics = {
      active: trips.filter((t) => t.status === 'dispatched' || (t.completed_stops > 0 && t.completed_stops < t.stops)).length,
      completed: trips.filter((t) => t.status === 'completed' || (t.stops > 0 && t.completed_stops === t.stops)).length,
      delayed: trips.filter((t) => t.late_stops > 0).length,
      problems: trips.filter((t) => t.open_issues > 0 || t.shortfalls > 0).length,
      lateStops: trips.reduce((sum, t) => sum + (t.late_stops || 0), 0),
      offlineRecords: trips.reduce((sum, t) => sum + (t.offline_records || 0), 0),
      openIssues: trips.reduce((sum, t) => sum + (t.open_issues || 0), 0),
    }

    res.json({ date, depot: depot || 'all', dates: dateList, trips, metrics })
  } catch (err) {
    sendError(res, err, 'Failed to load trips')
  }
})

// GET /api/trips/mine — the signed-in driver's trips (by assignment or by their vehicle).
router.get('/mine', requireRole('Driver'), async (req, res) => {
  try {
    const [u] = await sql.query('SELECT assigned_vehicle_id FROM users WHERE user_id = $1', [req.user.userId])
    const trips = await sql.query(
      `${TRIP_LIST_SELECT}
       WHERE t.status <> 'draft' AND (t.driver_user_id = $1 OR t.vehicle_id = $2)
       ORDER BY t.delivery_date DESC, t.trip_number
       LIMIT 60`,
      [req.user.userId, u?.assigned_vehicle_id || null]
    )
    res.json({ vehicle_id: u?.assigned_vehicle_id || null, today: toColomboParts(now()).date, trips })
  } catch (err) {
    sendError(res, err, 'Failed to load your trips')
  }
})

// GET /api/trips/:tripId — trip with stops, items, loading checks, delivery records and issues.
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await loadTrip(sql, req, req.params.tripId)
    const [summary] = await sql.query(`${TRIP_LIST_SELECT} WHERE t.trip_id = $1`, [trip.trip_id])
    const stops = await sql.query(
      `SELECT s.stop_id, s.order_id, s.stop_sequence, s.loading_sequence, s.to_outlet_id AS outlet_id,
              s.distance_km, s.planned_arrival_time, s.planned_departure_time, s.planned_handling_min,
              s.actual_arrival_time, s.actual_departure_time, s.status AS stop_status,
              o.status AS order_status, o.brand, o.temp_requirement, o.total_units, o.total_weight_kg, o.total_volume_m3,
              o.requested_window_open, o.requested_window_close, o.order_notes, o.priority,
              ol.district, ol.dock_type, ol.parking_constraint, ol.mall_window,
              m.full_name AS manager_name, m.phone AS manager_phone,
              lv.shortfall_flag, lv.shortfall_units, lv.shortfall_reason, lv.issue_type, lv.item_name AS shortfall_item,
              lv.verified_at,
              dr.outcome, dr.received_by_name, dr.is_late, dr.lateness_minutes, dr.recorded_offline,
              dr.driver_notes, (dr.proof_photo_data IS NOT NULL) AS has_photo, dr.synced_at
       FROM trip_stops s
       JOIN orders o ON o.order_id = s.order_id
       JOIN outlets ol ON ol.outlet_id = s.to_outlet_id
       LEFT JOIN LATERAL (
         SELECT full_name, phone FROM users WHERE outlet_id = ol.outlet_id AND role = 'Store Manager' ORDER BY created_at LIMIT 1
       ) m ON true
       LEFT JOIN loading_verifications lv ON lv.trip_id = s.trip_id AND lv.order_id = s.order_id
       LEFT JOIN delivery_records dr ON dr.order_id = s.order_id
       WHERE s.trip_id = $1
       ORDER BY s.stop_sequence`,
      [trip.trip_id]
    )
    const items = await sql.query(
      `SELECT order_id, item_id, COALESCE(product_code, sku) AS product_code, product_name, COALESCE(unit, 'Case') AS unit,
              temp_requirement, quantity_cases AS quantity
       FROM order_items WHERE order_id = ANY($1) ORDER BY order_id, item_id`,
      [stops.map((s) => s.order_id)]
    )
    const issues = await sql.query(
      `SELECT i.issue_id, i.reported_by_role, i.related_order_id, i.issue_category, i.severity, i.impact,
              i.description, i.resolution_status, i.reported_at, u.full_name AS reported_by
       FROM operational_issues i LEFT JOIN users u ON u.user_id = i.reported_by_user_id
       WHERE i.related_trip_id = $1 ORDER BY i.reported_at DESC`,
      [trip.trip_id]
    )
    res.json({
      trip: summary,
      stops: stops.map((s) => ({ ...s, items: items.filter((i) => i.order_id === s.order_id) })),
      issues,
    })
  } catch (err) {
    sendError(res, err, 'Failed to load trip')
  }
})

// ---------- Loader ----------

// Moves a planned trip (and its orders) into loading the first time anything is checked.
async function beginLoading(tx, trip, actor) {
  if (trip.status !== 'planned') return
  await tx.query(`UPDATE trips SET status = 'loading' WHERE trip_id = $1`, [trip.trip_id])
  const orders = await tx.query(
    `SELECT o.order_id FROM trip_stops s JOIN orders o ON o.order_id = s.order_id
     WHERE s.trip_id = $1 AND o.status = 'planned'`,
    [trip.trip_id]
  )
  for (const o of orders) await transitionOrder(tx, o.order_id, 'loading', actor, `Loading started on ${trip.vehicle_id}`)
}

// POST /api/trips/:tripId/loading/verify — mark one order loaded, or loaded short with details.
router.post('/:tripId/loading/verify', requireRole('Loader', 'Dispatcher', 'Admin'), async (req, res) => {
  const { order_id: orderId, result, issue_type: issueType, item_name: itemName, planned_units: plannedUnits,
    actual_units: actualUnits, description, photo } = req.body || {}
  if (!orderId || !['loaded', 'shortfall'].includes(result)) {
    return res.status(400).json({ error: "order_id and result ('loaded' or 'shortfall') are required." })
  }
  try {
    const out = await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      if (!['planned', 'loading'].includes(trip.status)) throw httpError(409, `Loading for ${trip.trip_id} is already complete.`)
      const [stop] = await tx.query('SELECT s.*, o.outlet_id FROM trip_stops s JOIN orders o ON o.order_id = s.order_id WHERE s.trip_id = $1 AND s.order_id = $2', [trip.trip_id, orderId])
      if (!stop) throw httpError(404, `${orderId} is not on ${trip.trip_id}.`)

      await beginLoading(tx, trip, actorOf(req))
      const short = result === 'shortfall'
      const missing = short && plannedUnits != null && actualUnits != null ? Math.max(0, Number(plannedUnits) - Number(actualUnits)) : null
      if (short && !description?.trim()) throw httpError(400, 'Describe the shortfall so the dispatcher and store know what is missing.')

      await tx.query('DELETE FROM loading_verifications WHERE trip_id = $1 AND order_id = $2', [trip.trip_id, orderId])
      await tx.query(
        `INSERT INTO loading_verifications (trip_id, order_id, loader_user_id, bay_number, is_verified, shortfall_flag,
           shortfall_units, shortfall_reason, issue_type, item_name, planned_units, notes)
         VALUES ($1,$2,$3,$4,true,$5,$6,$7,$8,$9,$10,$11)`,
        [trip.trip_id, orderId, req.user.userId, null, short, missing, short ? description.trim().slice(0, 100) : null,
          short ? issueType || 'Quantity Mismatch' : null, short ? itemName || null : null,
          short && plannedUnits != null ? Number(plannedUnits) : null, description?.trim() || null]
      )
      if (short) {
        await tx.query(
          `INSERT INTO operational_issues (reported_by_role, reported_by_user_id, related_order_id, related_trip_id, outlet_id,
             issue_category, severity, description, photo_data)
           VALUES ('Loader', $1, $2, $3, $4, $5, 'high', $6, $7)`,
          [req.user.userId, orderId, trip.trip_id, stop.outlet_id, `loading: ${issueType || 'Quantity Mismatch'}`,
            `${itemName ? `${itemName}: ` : ''}${missing != null ? `${missing} of ${plannedUnits} units missing. ` : ''}${description.trim()}`,
            photo || null]
        )
      }
      return { short }
    })
    res.json({ success: true, message: out.short ? `${orderId} flagged short — dispatch has been notified before departure.` : `${orderId} loaded.` })
  } catch (err) {
    sendError(res, err, 'Failed to record loading check')
  }
})

// POST /api/trips/:tripId/loading/complete — every order checked; hand the vehicle to the driver.
router.post('/:tripId/loading/complete', requireRole('Loader', 'Dispatcher', 'Admin'), async (req, res) => {
  try {
    const out = await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      if (!['planned', 'loading'].includes(trip.status)) throw httpError(409, `Loading for ${trip.trip_id} is already complete.`)
      const rows = await tx.query(
        `SELECT s.order_id, o.status, lv.shortfall_flag, lv.verification_id
         FROM trip_stops s JOIN orders o ON o.order_id = s.order_id
         LEFT JOIN loading_verifications lv ON lv.trip_id = s.trip_id AND lv.order_id = s.order_id
         WHERE s.trip_id = $1`,
        [trip.trip_id]
      )
      const pending = rows.filter((r) => !r.verification_id)
      if (pending.length) throw httpError(409, `Check every order before completing: ${pending.map((r) => r.order_id).join(', ')} not yet loaded.`)
      await beginLoading(tx, trip, actorOf(req))
      let shorts = 0
      for (const r of rows) {
        const [o] = await tx.query('SELECT status FROM orders WHERE order_id = $1', [r.order_id])
        if (o.status !== 'loading') continue
        if (r.shortfall_flag) shorts++
        await transitionOrder(tx, r.order_id, r.shortfall_flag ? 'shortfall' : 'loaded', actorOf(req),
          r.shortfall_flag ? 'Loaded short — see the loading issue' : `Loaded on ${trip.vehicle_id}`)
      }
      await tx.query(`UPDATE trips SET status = 'loaded', loading_completed_at = NOW() WHERE trip_id = $1`, [trip.trip_id])
      return { orders: rows.length, shorts }
    })
    res.json({
      success: true,
      ...out,
      message: `Loading complete: ${out.orders} orders ready${out.shorts ? `, ${out.shorts} flagged short` : ''}. The driver can start the trip.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to complete loading')
  }
})

// ---------- Driver ----------

async function startTrip(tx, trip, actor, at) {
  if (['dispatched', 'in_progress', 'completed'].includes(trip.status)) return false
  if (trip.status !== 'loaded') throw httpError(409, 'Loading is not complete yet. Ask the loader to finish and release the vehicle.')
  const orders = await tx.query(
    `SELECT o.order_id, o.status FROM trip_stops s JOIN orders o ON o.order_id = s.order_id WHERE s.trip_id = $1`,
    [trip.trip_id]
  )
  for (const o of orders) {
    if (o.status === 'shortfall') {
      await transitionOrder(tx, o.order_id, 'loaded', actor, 'Departing with the reported shortfall')
      await transitionOrder(tx, o.order_id, 'dispatched', actor, `Departed on ${trip.vehicle_id} (short-loaded)`)
    } else if (o.status === 'loaded') {
      await transitionOrder(tx, o.order_id, 'dispatched', actor, `Departed on ${trip.vehicle_id}`)
    }
  }
  await tx.query(`UPDATE trips SET status = 'dispatched', dispatched_at = $2 WHERE trip_id = $1`, [trip.trip_id, at ? new Date(at) : now()])
  return true
}

// POST /api/trips/:tripId/start — driver departs the depot.
router.post('/:tripId/start', requireRole('Driver', 'Dispatcher', 'Admin'), async (req, res) => {
  try {
    const started = await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      return startTrip(tx, trip, actorOf(req), req.body?.at)
    })
    res.json({ success: true, message: started ? 'Trip started. Safe driving!' : 'Trip already started.' })
  } catch (err) {
    sendError(res, err, 'Failed to start trip')
  }
})

// POST /api/trips/:tripId/stops/:orderId/arrive — driver reached the outlet.
router.post('/:tripId/stops/:orderId/arrive', requireRole('Driver', 'Dispatcher', 'Admin'), async (req, res) => {
  try {
    await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      await startTrip(tx, trip, actorOf(req), req.body?.at)
      await tx.query(
        `UPDATE trip_stops SET actual_arrival_time = COALESCE(actual_arrival_time, $3),
           status = CASE WHEN status = 'scheduled' THEN 'arrived' ELSE status END
         WHERE trip_id = $1 AND order_id = $2`,
        [trip.trip_id, req.params.orderId, colomboClock(req.body?.at)]
      )
    })
    res.json({ success: true, message: 'Arrival recorded.' })
  } catch (err) {
    sendError(res, err, 'Failed to record arrival')
  }
})

// Records the outcome of one stop. Idempotent per order (and per client_event_id).
async function recordOutcome(tx, req, trip, orderId, body) {
  const outcome = { success: 'delivered', delivered: 'delivered', partial: 'partial', failed: 'failed' }[body.outcome]
  if (!outcome) throw httpError(400, "outcome must be 'delivered', 'partial' or 'failed'.")

  const [existing] = await tx.query('SELECT outcome FROM delivery_records WHERE order_id = $1', [orderId])
  if (existing) return { duplicate: true, outcome: existing.outcome }

  const [stop] = await tx.query(
    `SELECT s.*, o.requested_window_close, o.status AS order_status FROM trip_stops s JOIN orders o ON o.order_id = s.order_id
     WHERE s.trip_id = $1 AND s.order_id = $2`,
    [trip.trip_id, orderId]
  )
  if (!stop) throw httpError(404, `${orderId} is not on ${trip.trip_id}.`)
  await startTrip(tx, trip, actorOf(req), body.arrived_at || body.completed_at)

  if (outcome !== 'failed' && !body.received_by_name?.trim()) throw httpError(400, 'Enter the name of the person who received the goods.')
  if (outcome !== 'failed' && !body.photo) throw httpError(400, 'Attach a proof-of-delivery photo.')

  const arrival = stop.actual_arrival_time ? String(stop.actual_arrival_time).slice(0, 5) : colomboClock(body.arrived_at || body.completed_at)
  const departure = colomboClock(body.completed_at)
  const handling = Math.max(0, toMin(departure) - toMin(arrival))
  const lateBy = toMin(arrival) - toMin(String(stop.requested_window_close).slice(0, 5))

  await tx.query(
    `INSERT INTO delivery_records (trip_id, order_id, stop_id, driver_user_id, actual_arrival_time, actual_departure_time,
       handling_duration_min, is_late, lateness_minutes, outcome, received_by_name, proof_photo_data, driver_notes,
       recorded_offline, client_event_id, synced_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW())`,
    [trip.trip_id, orderId, stop.stop_id, req.user.userId, arrival, departure, handling, lateBy > 0, Math.max(0, lateBy),
      outcome, body.received_by_name?.trim() || null, body.photo || null, body.notes?.trim() || null,
      body.recorded_offline === true, body.client_event_id || null]
  )
  await tx.query(
    `UPDATE trip_stops SET actual_arrival_time = $3, actual_departure_time = $4, status = $5 WHERE stop_id = $1 AND trip_id = $2`,
    [stop.stop_id, trip.trip_id, arrival, departure, outcome]
  )
  const [order] = await tx.query('SELECT status FROM orders WHERE order_id = $1', [orderId])
  if (order.status === 'dispatched') {
    const note = {
      delivered: `Delivered at ${departure}, received by ${body.received_by_name?.trim()}`,
      partial: `Part-delivered at ${departure}, received by ${body.received_by_name?.trim()}`,
      failed: `Delivery failed at ${arrival}: ${body.notes?.trim() || 'not accepted'}`,
    }[outcome] + (body.recorded_offline ? ' (recorded offline, synced later)' : '')
    await transitionOrder(tx, orderId, outcome, actorOf(req), note)
  }

  const [{ open }] = await tx.query(
    `SELECT COUNT(*)::int AS open FROM trip_stops WHERE trip_id = $1 AND status NOT IN ('delivered','partial','failed')`,
    [trip.trip_id]
  )
  if (open === 0) await tx.query(`UPDATE trips SET status = 'completed', completed_at = NOW() WHERE trip_id = $1`, [trip.trip_id])
  return { duplicate: false, outcome, late: lateBy > 0, trip_completed: open === 0 }
}

// POST /api/trips/:tripId/stops/:orderId/deliver — outcome + proof of delivery.
router.post('/:tripId/stops/:orderId/deliver', requireRole('Driver', 'Dispatcher', 'Admin'), async (req, res) => {
  try {
    const out = await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      return recordOutcome(tx, req, trip, req.params.orderId, req.body || {})
    })
    res.json({
      success: true,
      ...out,
      message: out.duplicate ? 'Already recorded.' : out.trip_completed ? 'Delivery recorded. That was the last stop — trip complete.' : 'Delivery recorded.',
    })
  } catch (err) {
    sendError(res, err, 'Failed to record delivery')
  }
})

// POST /api/trips/:tripId/problems — driver reports a problem; closed / refused outlets
// also record the stop as a failed delivery so dispatch can re-plan it.
router.post('/:tripId/problems', requireRole('Driver', 'Dispatcher', 'Admin'), async (req, res) => {
  const { order_id: orderId, category, impact, description, photo, client_event_id: eventId, occurred_at: at } = req.body || {}
  if (!category || !description?.trim()) return res.status(400).json({ error: 'Choose a problem category and describe what happened.' })
  try {
    const out = await withTransaction(async (tx) => {
      const trip = await loadTrip(tx, req, req.params.tripId, { forUpdate: true })
      if (eventId) {
        const [dup] = await tx.query('SELECT issue_id FROM operational_issues WHERE client_event_id = $1', [eventId])
        if (dup) return { duplicate: true }
      }
      const [stop] = orderId ? await tx.query('SELECT to_outlet_id FROM trip_stops WHERE trip_id = $1 AND order_id = $2', [trip.trip_id, orderId]) : []
      await tx.query(
        `INSERT INTO operational_issues (reported_by_role, reported_by_user_id, related_order_id, related_trip_id, outlet_id,
           issue_category, severity, description, impact, photo_data, client_event_id, reported_at)
         VALUES ('Driver', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [req.user.userId, stop ? orderId : null, trip.trip_id, stop?.to_outlet_id || null, `delivery: ${category}`,
          impact === 'cannot_continue' ? 'critical' : 'high', description.trim(), impact || null, photo || null, eventId || null,
          at ? new Date(at) : now()]
      )
      let failed = null
      if (stop && FAILED_CATEGORIES.includes(category)) {
        failed = await recordOutcome(tx, req, trip, orderId, { outcome: 'failed', notes: description, arrived_at: at, completed_at: at, recorded_offline: req.body?.recorded_offline })
      }
      return { duplicate: false, failed: Boolean(failed && !failed.duplicate) }
    })
    res.json({
      success: true,
      ...out,
      message: out.failed ? 'Problem reported and the stop recorded as not delivered. Dispatch will re-plan it.' : 'Problem reported to dispatch.',
    })
  } catch (err) {
    sendError(res, err, 'Failed to report problem')
  }
})

module.exports = router
