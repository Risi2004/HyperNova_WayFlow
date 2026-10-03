// Loads planning inputs from the database, runs the allocation engine and stores the draft plan.
//
// A plan for a delivery date is a set of trips (status 'draft' until published) plus a list of
// unscheduled orders with the reason each could not be served. Publishing turns draft trips into
// 'planned' trips, moves their orders to 'planned', and records a deferral for every unscheduled
// order — so every decision leaves a traceable record.

const { allocate, validateVehicleDay, checklist, kindOf, toMin, toTime } = require('./engine')
const { DEFERRAL_REASONS, transitionOrder, OrderStatusError } = require('../orderStatus')
const { addDays } = require('../orderSchedule')

class PlanError extends Error {
  constructor(message, status = 409, extra = {}) {
    super(message)
    this.status = status
    this.extra = extra
  }
}

const num = (v) => Number(v || 0)
const compactDate = (d) => d.replace(/-/g, '')
const tripIdFor = (date, vehicleId, n) => `TR-${compactDate(date)}-${vehicleId}-${n}`

function weekStart(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return addDays(dateStr, -((d.getUTCDay() + 6) % 7))
}

// ---------------------------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------------------------

async function loadContext(db) {
  const travelRows = await db.query('SELECT * FROM district_travel')
  const allowanceRows = await db.query('SELECT * FROM service_allowance')
  const travel = {}
  for (const r of travelRows) {
    travel[`${r.depot}|${r.district}`] = {
      out_min: num(r.depot_to_district_freeflow_min),
      out_km: num(r.depot_to_district_km),
      inter_min: num(r.inter_stop_freeflow_min),
      inter_km: num(r.inter_stop_km),
    }
  }
  const allowance = {}
  for (const r of allowanceRows) allowance[`${r.brand}|${r.dock_type}`] = num(r.service_allowance_min)
  return { travel, allowance }
}

// Vehicles with availability for the date, assigned driver and weekly fuel left
// (quota minus fuel planned on other days of the same ISO week).
async function loadVehicles(db, date) {
  const rows = await db.query(
    `SELECT v.*, va.status AS availability, va.reason AS unavailable_reason,
            u.user_id AS driver_user_id, u.full_name AS driver_name,
            COALESCE((SELECT SUM(t.planned_fuel_l) FROM trips t
                      WHERE t.vehicle_id = v.vehicle_id AND t.delivery_date BETWEEN $2 AND $3
                        AND t.delivery_date <> $1), 0) AS fuel_used_l
     FROM vehicles v
     LEFT JOIN vehicle_availability va ON va.vehicle_id = v.vehicle_id AND va.date = $1
     LEFT JOIN LATERAL (
       SELECT user_id, full_name FROM users
       WHERE assigned_vehicle_id = v.vehicle_id AND role = 'Driver' AND status = 'Active'
       ORDER BY created_at LIMIT 1
     ) u ON true
     ORDER BY v.vehicle_id`,
    [date, weekStart(date), addDays(weekStart(date), 6)]
  )
  return rows.map((v) => ({
    vehicle_id: v.vehicle_id,
    type: v.type,
    temp: v.temp,
    weight_cap: num(v.weight_cap_kg),
    volume_cap: num(v.volume_cap_m3),
    km_per_l: num(v.km_per_l),
    weekly_fuel_quota_l: num(v.weekly_fuel_quota_l),
    fuel_used_l: num(v.fuel_used_l),
    fuel_remaining_l: Math.max(0, num(v.weekly_fuel_quota_l) - num(v.fuel_used_l)),
    depot: v.depot,
    available: v.is_active !== false && !v.availability,
    unavailable_reason: v.unavailable_reason || (v.availability ? v.availability.replace('_', ' ') : null),
    driver_user_id: v.driver_user_id,
    driver_name: v.driver_name,
  }))
}

// Window an order can be received in: the requested window, narrowed by any mall access window.
function windowOf(row) {
  let open = toMin(String(row.requested_window_open || row.window_open_time).slice(0, 5))
  let close = toMin(String(row.requested_window_close || row.window_close_time).slice(0, 5))
  if (row.mall_window && /^\d\d:\d\d-\d\d:\d\d$/.test(row.mall_window)) {
    const [mo, mc] = row.mall_window.split('-').map(toMin)
    open = Math.max(open, mo)
    close = Math.min(close, mc)
  }
  return { open, close }
}

// Orders that belong in this date's plan: confirmed orders due on or before the date, and
// deferred orders whose next run is on or before the date — unless already on another day's trip.
async function loadCandidateOrders(db, date) {
  const rows = await db.query(
    `SELECT o.order_id, o.outlet_id, o.brand, o.district, o.depot, o.status, o.priority,
            o.temp_requirement, o.total_units, o.total_weight_kg, o.total_volume_m3,
            o.requested_window_open, o.requested_window_close, o.target_delivery_date,
            ol.dock_type, ol.parking_constraint, ol.mall_window, ol.window_open_time, ol.window_close_time,
            d.deferrals, d.next_scheduled_date
     FROM orders o
     JOIN outlets ol ON ol.outlet_id = o.outlet_id
     LEFT JOIN LATERAL (
       SELECT COUNT(*)::int AS deferrals, MAX(next_scheduled_date) AS next_scheduled_date
       FROM order_deferrals od WHERE od.order_id = o.order_id
     ) d ON true
     WHERE ((o.status = 'confirmed' AND o.target_delivery_date <= $1)
         OR (o.status = 'deferred' AND COALESCE(d.next_scheduled_date, o.target_delivery_date) <= $1))
       AND NOT EXISTS (
         SELECT 1 FROM trip_stops ts JOIN trips t ON t.trip_id = ts.trip_id
         WHERE ts.order_id = o.order_id AND t.delivery_date <> $1
       )
     ORDER BY o.order_id`,
    [date]
  )
  return rows.map((r) => ({
    order_id: r.order_id,
    outlet_id: r.outlet_id,
    brand: r.brand,
    district: r.district,
    depot: r.depot,
    status: r.status,
    priority: r.priority || 'normal',
    temp: r.temp_requirement === 'chilled' ? 'chilled' : 'ambient',
    units: num(r.total_units),
    weight: num(r.total_weight_kg),
    volume: num(r.total_volume_m3),
    dock_type: r.dock_type,
    parking: r.parking_constraint,
    mall_window: r.mall_window,
    target_delivery_date: r.target_delivery_date,
    deferrals: num(r.deferrals),
    ...windowOf(r),
  }))
}

async function loadPlanRow(db, date) {
  const [plan] = await db.query('SELECT * FROM delivery_plans WHERE delivery_date = $1', [date])
  return plan || null
}

// Current trips for the date as engine trip objects (draft and published).
async function loadTrips(db, date, ordersById) {
  const trips = await db.query('SELECT * FROM trips WHERE delivery_date = $1 ORDER BY vehicle_id, trip_number', [date])
  const stops = await db.query(
    `SELECT ts.* FROM trip_stops ts JOIN trips t ON t.trip_id = ts.trip_id
     WHERE t.delivery_date = $1 ORDER BY ts.trip_id, ts.stop_sequence`,
    [date]
  )
  return trips.map((t) => ({
    trip_id: t.trip_id,
    status: t.status,
    vehicle_id: t.vehicle_id,
    brand: t.brand,
    district: t.district,
    kind: kindOf(t.brand),
    seq: t.trip_number,
    orders: stops.filter((s) => s.trip_id === t.trip_id).map((s) => ordersById.get(s.order_id)).filter(Boolean),
  }))
}

async function loadState(db, date) {
  // Sequential: `db` may be a single transaction client.
  const ctx = await loadContext(db)
  const vehicles = await loadVehicles(db, date)
  const candidates = await loadCandidateOrders(db, date)
  const plan = await loadPlanRow(db, date)
  // Orders already on this date's trips may have moved past 'confirmed' (published plans).
  const onTrips = await db.query(
    `SELECT o.order_id FROM orders o JOIN trip_stops ts ON ts.order_id = o.order_id
     JOIN trips t ON t.trip_id = ts.trip_id WHERE t.delivery_date = $1`,
    [date]
  )
  const missing = onTrips.map((r) => r.order_id).filter((id) => !candidates.some((c) => c.order_id === id))
  const extra = missing.length ? await loadOrdersByIds(db, missing) : []
  const orders = [...candidates, ...extra]
  const ordersById = new Map(orders.map((o) => [o.order_id, o]))
  const trips = await loadTrips(db, date, ordersById)
  return { ctx, vehicles, orders, ordersById, trips, plan }
}

async function loadOrdersByIds(db, ids) {
  const rows = await db.query(
    `SELECT o.order_id, o.outlet_id, o.brand, o.district, o.depot, o.status, o.priority,
            o.temp_requirement, o.total_units, o.total_weight_kg, o.total_volume_m3,
            o.requested_window_open, o.requested_window_close, o.target_delivery_date,
            ol.dock_type, ol.parking_constraint, ol.mall_window, ol.window_open_time, ol.window_close_time
     FROM orders o JOIN outlets ol ON ol.outlet_id = o.outlet_id WHERE o.order_id = ANY($1)`,
    [ids]
  )
  return rows.map((r) => ({
    order_id: r.order_id, outlet_id: r.outlet_id, brand: r.brand, district: r.district, depot: r.depot,
    status: r.status, priority: r.priority || 'normal', temp: r.temp_requirement === 'chilled' ? 'chilled' : 'ambient',
    units: num(r.total_units), weight: num(r.total_weight_kg), volume: num(r.total_volume_m3),
    dock_type: r.dock_type, parking: r.parking_constraint, mall_window: r.mall_window,
    target_delivery_date: r.target_delivery_date, deferrals: 0, ...windowOf(r),
  }))
}

// ---------------------------------------------------------------------------------------------
// Persisting a draft
// ---------------------------------------------------------------------------------------------

function assertDraftEditable(plan) {
  if (plan?.status === 'published') {
    throw new PlanError('This plan has been published and handed to loaders and drivers. It can no longer be regenerated.')
  }
}

// Replaces the date's draft trips with `trips` and stores the unscheduled reasons.
async function saveDraft(db, date, { vehicles, ctx, trips, unscheduled, userId }) {
  const byVehicle = new Map()
  for (const t of trips) {
    if (!t.orders.length) continue
    if (!byVehicle.has(t.vehicle_id)) byVehicle.set(t.vehicle_id, [])
    byVehicle.get(t.vehicle_id).push(t)
  }
  const vehicleById = new Map(vehicles.map((v) => [v.vehicle_id, v]))

  await db.query(`DELETE FROM trip_stops WHERE trip_id IN (SELECT trip_id FROM trips WHERE delivery_date = $1 AND status = 'draft')`, [date])
  await db.query(`DELETE FROM trips WHERE delivery_date = $1 AND status = 'draft'`, [date])

  for (const [vid, list] of byVehicle) {
    const vehicle = vehicleById.get(vid)
    const res = validateVehicleDay(vehicle, list, ctx)
    for (const [i, { trip, schedule }] of res.schedules.entries()) {
      const tripId = tripIdFor(date, vid, i + 1)
      const travel = ctx.travel[`${vehicle.depot}|${trip.district}`] || { out_km: 0, inter_km: 0, out_min: 0, inter_min: 0 }
      await db.query(
        `INSERT INTO trips (trip_id, delivery_date, vehicle_id, trip_number, depot, brand, district, driver_user_id,
           planned_departure_time, planned_return_time, total_planned_distance_km, total_planned_duration_min,
           total_weight_kg, total_volume_m3, status, planned_fuel_l, budget_minutes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,'draft',$15,$16)`,
        [tripId, date, vid, i + 1, vehicle.depot, trip.brand, trip.district, vehicle.driver_user_id || null,
          toTime(schedule.start), toTime(Math.min(schedule.returnAt, 23 * 60 + 59)), schedule.distanceKm,
          Math.round(schedule.returnAt - schedule.start), schedule.weight, schedule.volume,
          Math.round(schedule.fuelL * 100) / 100, schedule.minutes]
      )
      const n = schedule.stops.length
      for (const [k, stop] of schedule.stops.entries()) {
        await db.query(
          `INSERT INTO trip_stops (trip_id, order_id, stop_sequence, loading_sequence, from_point, to_outlet_id,
             distance_km, planned_travel_min, planned_arrival_time, planned_departure_time, planned_handling_min, status)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'scheduled')`,
          [tripId, stop.order_id, k + 1, n - k, k === 0 ? 'DEPOT' : schedule.stops[k - 1].outlet_id, stop.outlet_id,
            k === 0 ? travel.out_km : travel.inter_km, k === 0 ? travel.out_min : travel.inter_min,
            toTime(stop.planned_arrival_min), toTime(stop.planned_departure_min), stop.handling_min]
        )
      }
    }
  }

  const reasons = {}
  for (const u of unscheduled) reasons[u.order.order_id] = { reason: u.reason, explanation: u.explanation }
  await db.query(
    `INSERT INTO delivery_plans (delivery_date, status, unscheduled, generated_by_user_id, generated_at, updated_at)
     VALUES ($1, 'draft', $2, $3, NOW(), NOW())
     ON CONFLICT (delivery_date) DO UPDATE SET unscheduled = EXCLUDED.unscheduled,
       generated_by_user_id = EXCLUDED.generated_by_user_id, updated_at = NOW(),
       generated_at = COALESCE(delivery_plans.generated_at, NOW())`,
    [date, JSON.stringify(reasons), userId]
  )
}

// Orders in the plan that are not on any trip, with their stored reason.
function unscheduledOf(state, reasons = {}) {
  const planned = new Set(state.trips.flatMap((t) => t.orders.map((o) => o.order_id)))
  return state.orders
    .filter((o) => !planned.has(o.order_id) && ['confirmed', 'deferred'].includes(o.status))
    .map((order) => ({
      order,
      ...(reasons[order.order_id] || { reason: 'not_planned', explanation: 'Not yet assigned to a trip. Run Suggest Plan or add it to a route.' }),
    }))
}

// ---------------------------------------------------------------------------------------------
// Operations used by the routes
// ---------------------------------------------------------------------------------------------

// Runs the engine. With keepExisting, current draft trips stay as they are and only unassigned
// orders are allocated around them (the dispatcher's manual decisions are respected).
async function generatePlan(db, date, { keepExisting = false, userId }) {
  const state = await loadState(db, date)
  assertDraftEditable(state.plan)
  const locked = keepExisting ? state.trips.filter((t) => t.status === 'draft') : []
  const result = allocate({ orders: state.orders, vehicles: state.vehicles, ctx: state.ctx, locked })
  await saveDraft(db, date, { ...state, trips: result.trips, unscheduled: result.unscheduled, userId })
  return { planned: result.trips.reduce((n, t) => n + t.orders.length, 0), unscheduled: result.unscheduled.length, trips: result.trips.length }
}

// Validates (and unless dryRun, applies) moving one order onto a vehicle's trip.
// tripNumber: an existing trip number on that vehicle, or 'new' for a new trip.
async function assignOrder(db, date, { orderId, vehicleId, tripNumber, dryRun, userId }) {
  const state = await loadState(db, date)
  assertDraftEditable(state.plan)
  const order = state.ordersById.get(orderId)
  if (!order) throw new PlanError(`${orderId} is not waiting for the ${date} plan.`, 404)
  const vehicle = state.vehicles.find((v) => v.vehicle_id === vehicleId)
  if (!vehicle) throw new PlanError(`Vehicle ${vehicleId} not found.`, 404)

  const drafts = state.trips.filter((t) => t.status === 'draft').map((t) => ({ ...t, orders: t.orders.filter((o) => o.order_id !== orderId) }))
  const mine = drafts.filter((t) => t.vehicle_id === vehicleId)
  const target = tripNumber === 'new' ? null : mine.find((t) => t.seq === Number(tripNumber))
  if (tripNumber !== 'new' && !target) throw new PlanError(`${vehicleId} has no trip ${tripNumber} in this plan.`, 404)

  if (target && (target.brand !== order.brand || target.district !== order.district)) {
    const result = { ok: false, failures: [{ code: 'grouping', message: `Trip ${tripNumber} on ${vehicleId} goes to ${target.brand} outlets in ${target.district}; ${orderId} is a ${order.brand} order for ${order.district}.` }] }
    return { ...result, checks: checklist(result) }
  }

  const trial = target
    ? mine.map((t) => (t === target ? { ...t, orders: [...t.orders, order] } : t))
    : [...mine, { vehicle_id: vehicleId, brand: order.brand, district: order.district, kind: kindOf(order.brand), orders: [order], seq: 99 }]
  const res = validateVehicleDay(vehicle, trial.filter((t) => t.orders.length), state.ctx)
  const response = { ok: res.ok, failures: res.failures, checks: checklist(res) }
  if (!res.ok || dryRun) return response

  const others = drafts.filter((t) => t.vehicle_id !== vehicleId)
  const reasons = { ...(state.plan?.unscheduled || {}) }
  delete reasons[orderId]
  const trips = [...others, ...trial]
  const unscheduled = Object.entries(reasons).map(([id, r]) => ({ order: { order_id: id }, ...r }))
  await saveDraft(db, date, { ...state, trips, unscheduled, userId })
  return response
}

// Takes orders off the plan; they stay unscheduled with the dispatcher's reason.
async function unassignOrders(db, date, { orderIds, reason = 'dispatcher_decision', explanation, userId }) {
  const state = await loadState(db, date)
  assertDraftEditable(state.plan)
  const remove = new Set(orderIds)
  const trips = state.trips.filter((t) => t.status === 'draft').map((t) => ({ ...t, orders: t.orders.filter((o) => !remove.has(o.order_id)) }))
  const reasons = { ...(state.plan?.unscheduled || {}) }
  for (const id of orderIds) {
    reasons[id] = { reason, explanation: explanation?.trim() || DEFERRAL_REASONS[reason] || 'Removed from the plan by the dispatcher.' }
  }
  const unscheduled = Object.entries(reasons).map(([id, r]) => ({ order: { order_id: id }, ...r }))
  await saveDraft(db, date, { ...state, trips, unscheduled, userId })
}

// Sets the deferral reason the dispatcher wants recorded for an unscheduled order.
async function setUnscheduledReason(db, date, { orderId, reason, explanation, userId }) {
  if (!DEFERRAL_REASONS[reason]) throw new PlanError('Choose a valid deferral reason.', 400)
  const state = await loadState(db, date)
  assertDraftEditable(state.plan)
  if (!unscheduledOf(state).some((u) => u.order.order_id === orderId)) {
    throw new PlanError(`${orderId} is not an unscheduled order in the ${date} plan.`, 404)
  }
  const reasons = { ...(state.plan?.unscheduled || {}) }
  reasons[orderId] = { reason, explanation: explanation?.trim() || DEFERRAL_REASONS[reason] }
  await db.query(
    `INSERT INTO delivery_plans (delivery_date, status, unscheduled, generated_by_user_id, updated_at)
     VALUES ($1, 'draft', $2, $3, NOW())
     ON CONFLICT (delivery_date) DO UPDATE SET unscheduled = EXCLUDED.unscheduled, updated_at = NOW()`,
    [date, JSON.stringify(reasons), userId]
  )
}

// Publishes the plan: trips become visible to loaders and drivers, orders move to 'planned',
// and every unscheduled order is deferred to the next operating day with its recorded reason.
async function publishPlan(db, date, actor, nextOperatingDay) {
  const state = await loadState(db, date)
  assertDraftEditable(state.plan)
  const drafts = state.trips.filter((t) => t.status === 'draft')
  if (!drafts.length) throw new PlanError('There is nothing to publish yet. Run Suggest Plan first.', 400)

  // Re-validate every vehicle before anything is handed to the depot.
  const byVehicle = new Map()
  for (const t of drafts) byVehicle.set(t.vehicle_id, [...(byVehicle.get(t.vehicle_id) || []), t])
  const errors = []
  for (const [vid, list] of byVehicle) {
    const v = state.vehicles.find((x) => x.vehicle_id === vid)
    const res = validateVehicleDay(v, list, state.ctx)
    if (!res.ok) errors.push(...res.failures.map((f) => `${vid}: ${f.message}`))
  }
  if (errors.length) throw new PlanError('Resolve the constraint errors before publishing.', 409, { errors })

  const unscheduled = unscheduledOf(state, state.plan?.unscheduled || {})
  const nextDate = await nextOperatingDay(date)

  let planned = 0
  for (const t of drafts) {
    await db.query(`UPDATE trips SET status = 'planned' WHERE trip_id = $1`, [t.trip_id])
    for (const o of t.orders) {
      if (['confirmed', 'deferred'].includes(o.status)) {
        await transitionOrder(db, o.order_id, 'planned', actor, `Planned on ${t.trip_id} (${t.vehicle_id})`)
        planned++
      }
    }
  }

  for (const u of unscheduled) {
    const reason = DEFERRAL_REASONS[u.reason] ? u.reason : 'capacity_exceeded'
    const [{ prior }] = await db.query('SELECT COUNT(*)::int AS prior FROM order_deferrals WHERE order_id = $1', [u.order.order_id])
    await db.query(
      `INSERT INTO order_deferrals (order_id, outlet_id, planning_date, deferral_reason, explanation,
         consecutive_deferral_count, next_scheduled_date, decided_by_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [u.order.order_id, u.order.outlet_id, date, reason, u.explanation, prior + 1, nextDate, actor.userId]
    )
    await transitionOrder(db, u.order.order_id, 'deferred', actor, `${DEFERRAL_REASONS[reason]} — moved to ${nextDate}. ${u.explanation}`)
  }

  await db.query(
    `UPDATE delivery_plans SET status = 'published', published_by_user_id = $2, published_at = NOW(), updated_at = NOW()
     WHERE delivery_date = $1`,
    [date, actor.userId]
  )
  return { planned, deferred: unscheduled.length, trips: drafts.length, next_date: nextDate }
}

module.exports = {
  PlanError,
  OrderStatusError,
  loadState,
  unscheduledOf,
  generatePlan,
  assignOrder,
  unassignOrders,
  setUnscheduledReason,
  publishPlan,
  validateVehicleDay,
  checklist,
  tripIdFor,
}
