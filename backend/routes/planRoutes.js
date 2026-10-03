const express = require('express')
const { sql, withTransaction } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const { DEFERRAL_REASONS } = require('../services/orderStatus')
const { addDays, confirmDueOrders } = require('../services/orderSchedule')
const { toTime } = require('../services/planner/engine')
const {
  PlanError,
  loadState,
  unscheduledOf,
  generatePlan,
  assignOrder,
  unassignOrders,
  setUnscheduledReason,
  publishPlan,
  validateVehicleDay,
  checklist,
} = require('../services/planner/planService')
const { generatePeakDay } = require('../services/planner/scenario')

const router = express.Router()
router.use(verifyToken, requireRole('Dispatcher', 'Admin'))

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const actorOf = (req) => ({ userId: req.user.userId, role: req.user.role })
const round = (n, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp

function sendError(res, err, fallback) {
  const status = err.status || 500
  if (status >= 500) console.error(fallback, err)
  res.status(status).json({ error: status >= 500 ? `${fallback}. Please try again.` : err.message, ...(err.extra || {}) })
}

router.param('date', (req, res, next, date) => {
  if (!DATE_RE.test(date)) return res.status(400).json({ error: 'Date must be YYYY-MM-DD.' })
  next()
})

async function nextOperatingDay(db, date) {
  const [row] = await db.query(
    `SELECT date FROM operating_calendar WHERE date > $1 AND is_operating = true ORDER BY date LIMIT 1`,
    [date]
  )
  if (row) return row.date
  let d = addDays(date, 1)
  if (new Date(`${d}T00:00:00Z`).getUTCDay() === 0) d = addDays(d, 1)
  return d
}

const stopView = (stop, order) => ({
  order_id: stop.order_id,
  outlet_id: stop.outlet_id,
  depot: stop.depot,
  brand: stop.brand,
  district: stop.district,
  temp: stop.temp,
  parking: stop.parking,
  dock_type: stop.dock_type,
  priority: stop.priority,
  deferrals: stop.deferrals,
  weight: round(stop.weight),
  volume: round(stop.volume, 2),
  window: `${toTime(stop.open)}–${toTime(stop.close)}`,
  arrival: toTime(stop.planned_arrival_min),
  departure: toTime(stop.planned_departure_min),
  handling_min: stop.handling_min,
  late: stop.planned_arrival_min > stop.close,
  order_status: order?.status,
})

// GET /api/plans/:date — the full planning board for a delivery date.
router.get('/:date', async (req, res) => {
  const { date } = req.params
  try {
    await confirmDueOrders(sql)
    const state = await loadState(sql, date)
    const reasons = state.plan?.unscheduled || {}

    const tripsByVehicle = new Map()
    for (const t of state.trips) tripsByVehicle.set(t.vehicle_id, [...(tripsByVehicle.get(t.vehicle_id) || []), t])

    let utilSum = 0
    let tripCount = 0
    const vehicles = state.vehicles.map((v) => {
      const list = tripsByVehicle.get(v.vehicle_id) || []
      const result = list.length ? validateVehicleDay(v, list, state.ctx) : { ok: true, failures: [], schedules: [], freshMin: 0, dayMin: 0, fuelL: 0 }
      const trips = result.schedules.map(({ trip, schedule }, i) => {
        const util = Math.max(schedule.weight / v.weight_cap, schedule.volume / v.volume_cap)
        utilSum += util
        tripCount++
        return {
          trip_id: trip.trip_id,
          trip_number: i + 1,
          status: trip.status || 'draft',
          brand: trip.brand,
          district: trip.district,
          departure: toTime(schedule.start),
          last_stop_departure: toTime(schedule.end),
          return_time: toTime(schedule.returnAt),
          budget_minutes: schedule.minutes,
          distance_km: round(schedule.distanceKm),
          fuel_l: round(schedule.fuelL),
          weight: round(schedule.weight),
          volume: round(schedule.volume, 2),
          utilization: round(util * 100, 0),
          stops: schedule.stops.map((s) => stopView(s, state.ordersById.get(s.order_id))),
        }
      })
      return {
        vehicle_id: v.vehicle_id,
        type: v.type,
        temp: v.temp,
        depot: v.depot,
        weight_cap: v.weight_cap,
        volume_cap: v.volume_cap,
        available: v.available,
        unavailable_reason: v.unavailable_reason,
        driver_name: v.driver_name,
        fuel_remaining_l: round(v.fuel_remaining_l),
        weekly_fuel_quota_l: v.weekly_fuel_quota_l,
        fresh_minutes: result.freshMin,
        day_minutes: result.dayMin,
        fuel_planned_l: round(result.fuelL),
        validation: { ok: result.ok, failures: result.failures, checks: checklist(result) },
        trips,
      }
    })

    const unscheduled = unscheduledOf(state, reasons).map((u) => ({
      ...stopView({ ...u.order, planned_arrival_min: 0, planned_departure_min: 0, handling_min: 0 }),
      units: u.order.units,
      target_delivery_date: u.order.target_delivery_date,
      reason: u.reason,
      reason_label: DEFERRAL_REASONS[u.reason] || 'Not yet planned',
      explanation: u.explanation,
    })).map(({ arrival, departure, handling_min, late, ...rest }) => rest)

    const [{ awaiting }] = await sql.query(
      `SELECT COUNT(*)::int AS awaiting FROM orders WHERE target_delivery_date = $1 AND status = 'submitted'`,
      [date]
    )
    const planned = vehicles.reduce((n, v) => n + v.trips.reduce((m, t) => m + t.stops.length, 0), 0)

    res.json({
      date,
      plan: state.plan
        ? { status: state.plan.status, generated_at: state.plan.generated_at, updated_at: state.plan.updated_at, published_at: state.plan.published_at }
        : { status: 'none' },
      awaiting_cutoff: awaiting,
      vehicles,
      unscheduled,
      stats: {
        orders_total: planned + unscheduled.length,
        planned,
        unscheduled: unscheduled.length,
        vehicles_available: vehicles.filter((v) => v.available).length,
        vehicles_used: vehicles.filter((v) => v.trips.length).length,
        routes: tripCount,
        utilization: tripCount ? Math.round((utilSum / tripCount) * 100) : 0,
        constraint_errors: vehicles.filter((v) => !v.validation.ok && v.trips.length).length,
      },
    })
  } catch (err) {
    sendError(res, err, 'Failed to load plan')
  }
})

// POST /api/plans/:date/generate — run the allocation engine (Suggest Plan).
router.post('/:date/generate', async (req, res) => {
  try {
    const result = await withTransaction((tx) =>
      generatePlan(tx, req.params.date, { keepExisting: req.body?.keep_existing === true, userId: req.user.userId })
    )
    res.json({
      success: true,
      ...result,
      message: `Suggested plan: ${result.planned} orders on ${result.trips} trips${result.unscheduled ? `, ${result.unscheduled} could not be scheduled` : ''}.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to generate plan')
  }
})

// POST /api/plans/:date/assign — move an order onto a vehicle's trip (dry_run validates only).
router.post('/:date/assign', async (req, res) => {
  const { order_id: orderId, vehicle_id: vehicleId, trip_number: tripNumber = 'new', dry_run: dryRun = false } = req.body || {}
  if (!orderId || !vehicleId) return res.status(400).json({ error: 'order_id and vehicle_id are required.' })
  try {
    const result = await withTransaction((tx) =>
      assignOrder(tx, req.params.date, { orderId, vehicleId, tripNumber, dryRun, userId: req.user.userId })
    )
    if (!result.ok) return res.status(dryRun ? 200 : 409).json({ success: false, ...result, error: result.failures[0]?.message })
    res.json({ success: true, ...result, message: dryRun ? 'Valid — all requirements satisfied.' : `${orderId} added to ${vehicleId}.` })
  } catch (err) {
    sendError(res, err, 'Failed to assign order')
  }
})

// POST /api/plans/:date/unassign — take orders off the plan (they stay unscheduled with a reason).
router.post('/:date/unassign', async (req, res) => {
  const { order_ids: orderIds, reason, explanation } = req.body || {}
  if (!Array.isArray(orderIds) || !orderIds.length) return res.status(400).json({ error: 'order_ids is required.' })
  try {
    await withTransaction((tx) => unassignOrders(tx, req.params.date, { orderIds, reason, explanation, userId: req.user.userId }))
    res.json({ success: true, message: `${orderIds.length} order(s) removed from the plan.` })
  } catch (err) {
    sendError(res, err, 'Failed to remove orders')
  }
})

// DELETE /api/plans/:date/vehicles/:vehicleId — remove a vehicle's route from the draft.
router.delete('/:date/vehicles/:vehicleId', async (req, res) => {
  const { date, vehicleId } = req.params
  try {
    await withTransaction(async (tx) => {
      const state = await loadState(tx, date)
      const ids = state.trips.filter((t) => t.vehicle_id === vehicleId && t.status === 'draft').flatMap((t) => t.orders.map((o) => o.order_id))
      if (!ids.length) throw new PlanError(`${vehicleId} has no draft route on ${date}.`, 404)
      await unassignOrders(tx, date, { orderIds: ids, reason: 'dispatcher_decision', explanation: `Route on ${vehicleId} removed by the dispatcher.`, userId: req.user.userId })
    })
    res.json({ success: true, message: `Route on ${vehicleId} removed; its orders are back in the queue.` })
  } catch (err) {
    sendError(res, err, 'Failed to remove route')
  }
})

// PUT /api/plans/:date/unscheduled/:orderId — record the reason to use when this order is deferred.
router.put('/:date/unscheduled/:orderId', async (req, res) => {
  try {
    await withTransaction((tx) =>
      setUnscheduledReason(tx, req.params.date, { orderId: req.params.orderId, reason: req.body?.reason, explanation: req.body?.explanation, userId: req.user.userId })
    )
    res.json({ success: true, message: `Deferral reason recorded for ${req.params.orderId}.` })
  } catch (err) {
    sendError(res, err, 'Failed to record reason')
  }
})

// PUT /api/plans/:date/vehicles/:vehicleId/availability — mark a vehicle in the workshop (or back).
router.put('/:date/vehicles/:vehicleId/availability', async (req, res) => {
  const { date, vehicleId } = req.params
  const available = req.body?.available === true
  try {
    await withTransaction(async (tx) => {
      const [trip] = await tx.query(`SELECT trip_id FROM trips WHERE delivery_date = $1 AND vehicle_id = $2 LIMIT 1`, [date, vehicleId])
      if (!available && trip) throw new PlanError(`${vehicleId} already has a route on ${date}. Remove the route first.`)
      if (available) {
        await tx.query('DELETE FROM vehicle_availability WHERE vehicle_id = $1 AND date = $2', [vehicleId, date])
      } else {
        await tx.query(
          `INSERT INTO vehicle_availability (vehicle_id, date, status, reason) VALUES ($1, $2, 'in_workshop', $3)
           ON CONFLICT (vehicle_id, date) DO UPDATE SET reason = EXCLUDED.reason`,
          [vehicleId, date, req.body?.reason || 'In workshop']
        )
      }
    })
    res.json({ success: true, message: `${vehicleId} marked ${available ? 'available' : 'in workshop'} for ${date}.` })
  } catch (err) {
    sendError(res, err, 'Failed to update availability')
  }
})

// POST /api/plans/:date/publish — hand the plan to loaders and drivers; defer unscheduled orders.
router.post('/:date/publish', async (req, res) => {
  try {
    const result = await withTransaction((tx) => publishPlan(tx, req.params.date, actorOf(req), (d) => nextOperatingDay(tx, d)))
    res.json({
      success: true,
      ...result,
      message: `Plan published: ${result.planned} orders on ${result.trips} trips. ${result.deferred} order(s) deferred to ${result.next_date} with recorded reasons.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to publish plan')
  }
})

// POST /api/plans/:date/scenario — load the peak-day demo scenario for this date.
router.post('/:date/scenario', async (req, res) => {
  try {
    const result = await withTransaction((tx) => generatePeakDay(tx, req.params.date, { actorUserId: req.user.userId }))
    res.json({
      success: true,
      ...result,
      message: `Peak-day scenario loaded for ${result.date}: ${result.created} confirmed orders, ${result.in_workshop} vehicles in the workshop.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to load scenario')
  }
})

module.exports = router
