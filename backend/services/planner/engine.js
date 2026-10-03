// WayFlow allocation engine — pure functions, no database access.
//
// Assigns confirmed orders to vehicles and trips for one delivery date while respecting every
// operating constraint in the brief, and explains why any order cannot be served.
//
// Hard constraints checked for every vehicle-day (validateVehicleDay):
//   1. Weight and volume per trip within the vehicle's limits
//   2. Chilled goods only on refrigerated vehicles
//   3. van_only outlets only served by vans
//   4. Vehicle serves only outlets of its own depot
//   5. One brand and one district per trip; whole orders only
//   6. At most two trips per vehicle per day
//   7. Trip-time budgets: Fresh trips share 270 min (03:30–08:00), Style + Tech share 480 min
//      trip_minutes = outbound + inter-stop × (stops − 1) + Σ handling allowance
//   8. Every stop reached inside its delivery window (early arrivals wait for the window to open)
//   9. Fuel for the day's distance fits the vehicle's remaining weekly quota
//
// Allocation policy (allocate):
//   Orders are placed one at a time in priority order — previously deferred outlets first, then
//   urgent orders, Fresh chilled, Fresh ambient, Tech, Style; van-only and tight windows earlier.
//   Each order joins the best-fitting compatible open trip, otherwise opens a new trip on the
//   vehicle that wastes the least scarce capacity (reefers and vans are kept for the orders that
//   need them). Orders that fit nowhere are left unscheduled with the binding constraint as reason.

const FRESH_START_MIN = 3 * 60 + 30 // 03:30
const DAY_START_MIN = 7 * 60 // earliest Style / Tech departure
const FRESH_BUDGET_MIN = 270
const DAY_BUDGET_MIN = 480
const MAX_TRIPS = 2

const kindOf = (brand) => (brand === 'Fresh' ? 'fresh' : 'day')

const toMin = (time) => {
  const [h, m] = String(time).split(':').map(Number)
  return h * 60 + m
}
const toTime = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min % 60)).padStart(2, '0')}`
const round = (n, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp

// ---------------------------------------------------------------------------------------------
// Scheduling and validation
// ---------------------------------------------------------------------------------------------

// Stops run in order of window close (then open) so the tightest outlet is served first.
function sequenceStops(orders) {
  return [...orders].sort((a, b) => a.close - b.close || a.open - b.open || a.order_id.localeCompare(b.order_id))
}

function scheduleTrip(trip, vehicle, ctx, departAfter) {
  const travel = ctx.travel[`${vehicle.depot}|${trip.district}`]
  const stops = sequenceStops(trip.orders)
  const failures = []
  if (!travel) {
    failures.push({ code: 'depot', message: `${vehicle.depot} has no route to ${trip.district}.` })
    return { stops, failures, start: departAfter, end: departAfter, returnAt: departAfter, minutes: 0, distanceKm: 0, fuelL: 0, weight: 0, volume: 0 }
  }

  const fresh = trip.kind === 'fresh'
  const firstOpen = stops.length ? stops[0].open : 0
  const start = fresh
    ? Math.max(FRESH_START_MIN, departAfter)
    : Math.max(DAY_START_MIN, departAfter, firstOpen - travel.out_min)

  let t = start + travel.out_min
  let handling = 0
  const timed = stops.map((o, i) => {
    if (i > 0) t += travel.inter_min
    const arrive = t
    if (arrive > o.close) {
      failures.push({
        code: 'time_window',
        order_id: o.order_id,
        message: `${o.order_id} would arrive ${toTime(arrive)}, after ${o.outlet_id}'s window closes at ${toTime(o.close)}.`,
      })
    }
    if (t < o.open) t = o.open // early arrival waits for the window
    const service = ctx.allowance[`${trip.brand}|${o.dock_type}`] ?? 20
    handling += service
    t += service
    return { ...o, planned_arrival_min: arrive, service_start_min: Math.max(arrive, o.open), planned_departure_min: t, handling_min: service }
  })

  const n = stops.length
  const distanceKm = 2 * travel.out_km + travel.inter_km * Math.max(0, n - 1)
  return {
    stops: timed,
    failures,
    start,
    end: t,
    returnAt: t + travel.out_min,
    // Budget minutes as defined in the brief (return leg already allowed for in the budgets).
    minutes: travel.out_min + travel.inter_min * Math.max(0, n - 1) + handling,
    distanceKm,
    fuelL: distanceKm / vehicle.km_per_l,
    weight: stops.reduce((s, o) => s + o.weight, 0),
    volume: stops.reduce((s, o) => s + o.volume, 0),
  }
}

// Validates all trips of one vehicle for the day. Trips run Fresh first, then Style / Tech;
// each trip departs after the previous one has returned to the depot.
function validateVehicleDay(vehicle, trips, ctx) {
  const ordered = [...trips].sort((a, b) => (a.kind === b.kind ? (a.seq ?? 0) - (b.seq ?? 0) : a.kind === 'fresh' ? -1 : 1))
  const failures = []
  const schedules = []
  let departAfter = 0

  if (ordered.length > MAX_TRIPS) failures.push({ code: 'trips', message: `${vehicle.vehicle_id} would need ${ordered.length} trips; the limit is ${MAX_TRIPS} per day.` })
  if (!vehicle.available) failures.push({ code: 'unavailable', message: `${vehicle.vehicle_id} is not available on this date (${vehicle.unavailable_reason || 'in workshop'}).` })

  for (const trip of ordered) {
    const s = scheduleTrip(trip, vehicle, ctx, departAfter)
    departAfter = s.returnAt
    failures.push(...s.failures)

    const brands = new Set(trip.orders.map((o) => o.brand))
    const districts = new Set(trip.orders.map((o) => o.district))
    if (brands.size > 1 || districts.size > 1) {
      failures.push({ code: 'grouping', message: 'A trip may only carry one brand to one district.' })
    }
    for (const o of trip.orders) {
      if (o.depot !== vehicle.depot) failures.push({ code: 'depot', order_id: o.order_id, message: `${o.outlet_id} belongs to ${o.depot}; ${vehicle.vehicle_id} is based at ${vehicle.depot}.` })
      if (o.temp === 'chilled' && vehicle.temp !== 'reefer') failures.push({ code: 'temperature', order_id: o.order_id, message: `${o.order_id} is chilled; ${vehicle.vehicle_id} is not refrigerated.` })
      if (o.parking === 'van_only' && vehicle.type !== 'van') failures.push({ code: 'access', order_id: o.order_id, message: `${o.outlet_id} is van-only; ${vehicle.vehicle_id} is a ${vehicle.type}.` })
    }
    if (s.weight > vehicle.weight_cap + 1e-6) failures.push({ code: 'weight', message: `Weight ${round(s.weight)} kg exceeds ${vehicle.vehicle_id}'s ${vehicle.weight_cap} kg limit by ${round(s.weight - vehicle.weight_cap)} kg.`, excess: s.weight - vehicle.weight_cap })
    if (s.volume > vehicle.volume_cap + 1e-6) failures.push({ code: 'volume', message: `Volume ${round(s.volume, 2)} m³ exceeds ${vehicle.vehicle_id}'s ${vehicle.volume_cap} m³ limit by ${round(s.volume - vehicle.volume_cap, 2)} m³.`, excess: s.volume - vehicle.volume_cap })
    schedules.push({ trip, schedule: s })
  }

  const freshMin = schedules.filter((x) => x.trip.kind === 'fresh').reduce((n, x) => n + x.schedule.minutes, 0)
  const dayMin = schedules.filter((x) => x.trip.kind === 'day').reduce((n, x) => n + x.schedule.minutes, 0)
  if (freshMin > FRESH_BUDGET_MIN) failures.push({ code: 'budget', message: `Fresh trips need ${freshMin} min; the 03:30–08:00 budget is ${FRESH_BUDGET_MIN} min.` })
  if (dayMin > DAY_BUDGET_MIN) failures.push({ code: 'budget', message: `Style/Tech trips need ${dayMin} min; the trading-day budget is ${DAY_BUDGET_MIN} min.` })

  const fuelL = schedules.reduce((n, x) => n + x.schedule.fuelL, 0)
  if (fuelL > vehicle.fuel_remaining_l + 1e-6) failures.push({ code: 'fuel', message: `Needs ${round(fuelL)} L; only ${round(vehicle.fuel_remaining_l)} L of the weekly fuel quota remains.` })

  return { ok: failures.length === 0, failures, schedules, freshMin, dayMin, fuelL }
}

// Checklist shown in the planner's Route Validation card.
function checklist(result) {
  const has = (...codes) => result.failures.some((f) => codes.includes(f.code))
  return {
    weight: !has('weight'),
    volume: !has('volume'),
    temperature: !has('temperature'),
    access: !has('access'),
    depot: !has('depot', 'grouping', 'unavailable'),
    windows: !has('time_window', 'budget', 'trips'),
    fuel: !has('fuel'),
  }
}

// ---------------------------------------------------------------------------------------------
// Allocation
// ---------------------------------------------------------------------------------------------

const BRAND_TIER = (o) => (o.brand === 'Fresh' ? (o.temp === 'chilled' ? 0 : 1) : o.brand === 'Tech' ? 2 : 3)

function priorityCompare(a, b) {
  return (
    b.deferrals - a.deferrals || // outlets already skipped go first
    (b.priority === 'urgent') - (a.priority === 'urgent') ||
    BRAND_TIER(a) - BRAND_TIER(b) ||
    (b.parking === 'van_only') - (a.parking === 'van_only') || // vans are scarce: van-only outlets claim them first
    a.close - b.close ||
    b.volume - a.volume || // larger first packs better
    a.order_id.localeCompare(b.order_id)
  )
}

// Explanation shown to the dispatcher and store manager when an order cannot be served.
const REASON_FOR = {
  temperature: 'no_reefer_available',
  access: 'no_van_available',
  time_window: 'time_window',
  budget: 'time_window',
  fuel: 'fuel_quota',
  weight: 'capacity_exceeded',
  volume: 'capacity_exceeded',
  trips: 'capacity_exceeded',
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

function diagnose(order, vehicles, attempts, tripsOf) {
  const atDepot = vehicles.filter((v) => v.depot === order.depot && v.available)
  const typeOk = atDepot.filter((v) => (order.temp !== 'chilled' || v.temp === 'reefer') && (order.parking !== 'van_only' || v.type === 'van'))
  const scarce = order.parking === 'van_only' ? 'van' : order.temp === 'chilled' ? 'reefer' : null

  if (typeOk.length === 0) {
    if (order.parking === 'van_only') {
      return { reason: 'no_van_available', explanation: `${order.outlet_id} is van-only and no ${order.temp === 'chilled' ? 'refrigerated ' : ''}van is available at ${order.depot}.` }
    }
    return { reason: 'no_reefer_available', explanation: `No refrigerated vehicle is available at ${order.depot} for this chilled order.` }
  }

  const biggestW = Math.max(...typeOk.map((v) => v.weight_cap))
  const biggestV = Math.max(...typeOk.map((v) => v.volume_cap))
  if (order.weight > biggestW || order.volume > biggestV) {
    return { reason: 'capacity_exceeded', explanation: `${Math.round(order.weight)} kg / ${round(order.volume, 2)} m³ is larger than any suitable vehicle (max ${biggestW} kg / ${biggestV} m³).` }
  }

  // Most common blocking constraint across the suitable vehicles that were tried.
  const counts = {}
  const examples = {}
  for (const f of attempts) {
    const reason = REASON_FOR[f.code] || 'capacity_exceeded'
    counts[reason] = (counts[reason] || 0) + 1
    examples[reason] = examples[reason] || f.message
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  if (!top) return { reason: 'capacity_exceeded', explanation: 'Every suitable vehicle is fully allocated for this date.' }
  const [reason] = top
  const example = examples[reason]

  // When every vehicle that could carry this order is already committed, the scarce vehicle type
  // is the binding constraint — the late arrival or full load is only the symptom.
  if (scarce && typeOk.every((v) => tripsOf(v.vehicle_id) > 0)) {
    const what = scarce === 'van' ? `${order.temp === 'chilled' ? 'refrigerated ' : ''}van` : 'refrigerated vehicle'
    return {
      reason: scarce === 'van' ? 'no_van_available' : 'no_reefer_available',
      explanation: `${typeOk.length === 1 ? `The only available ${what}` : `All ${plural(typeOk.length, what)}`} at ${order.depot} ${typeOk.length === 1 ? 'is' : 'are'} already committed; the other ${atDepot.length - typeOk.length} vehicles cannot carry this order. Example: ${example}`,
    }
  }

  const lead = {
    time_window: `No suitable vehicle can reach ${order.outlet_id} within ${toTime(order.open)}–${toTime(order.close)}.`,
    fuel_quota: 'Suitable vehicles have used their weekly fuel quota.',
    capacity_exceeded: `${plural(typeOk.length, 'suitable vehicle')} at ${order.depot} ${typeOk.length === 1 ? 'is' : 'are'} full or already ${typeOk.length === 1 ? 'runs' : 'run'} 2 trips.`,
  }[reason]
  return { reason, explanation: `${lead} Example: ${example}` }
}

// vehicles: [{ vehicle_id, type, temp, weight_cap, volume_cap, km_per_l, fuel_remaining_l, depot, available }]
// orders:   [{ order_id, outlet_id, brand, district, depot, temp, weight, volume, open, close, dock_type, parking, priority, deferrals }]
// locked:   [{ vehicle_id, brand, district, kind, orders: [order] }] — trips to keep as they are
function allocate({ orders, vehicles, ctx, locked = [] }) {
  const byId = new Map(vehicles.map((v) => [v.vehicle_id, v]))
  const dayTrips = new Map(vehicles.map((v) => [v.vehicle_id, []]))
  let seq = 0
  for (const t of locked) dayTrips.get(t.vehicle_id)?.push({ ...t, orders: [...t.orders], seq: seq++ })

  const lockedIds = new Set(locked.flatMap((t) => t.orders.map((o) => o.order_id)))
  const queue = orders.filter((o) => !lockedIds.has(o.order_id)).sort(priorityCompare)
  const unscheduled = []

  // Remaining demand per depot/brand/district, used to size new trips.
  const demandKey = (o) => `${o.depot}|${o.brand}|${o.district}`
  const demand = new Map()
  for (const o of queue) {
    const d = demand.get(demandKey(o)) || { weight: 0, volume: 0 }
    d.weight += o.weight
    d.volume += o.volume
    demand.set(demandKey(o), d)
  }

  for (const order of queue) {
    const options = []
    const attempts = []

    // 1. Join an existing trip going to the same brand + district.
    for (const [vid, trips] of dayTrips) {
      const vehicle = byId.get(vid)
      trips.forEach((trip, idx) => {
        if (trip.brand !== order.brand || trip.district !== order.district || vehicle.depot !== order.depot) return
        const trial = trips.map((t, i) => (i === idx ? { ...t, orders: [...t.orders, order] } : t))
        const res = validateVehicleDay(vehicle, trial, ctx)
        if (res.ok) {
          const s = res.schedules.find((x) => x.trip === trial[idx]).schedule
          const fill = Math.max(s.weight / vehicle.weight_cap, s.volume / vehicle.volume_cap)
          options.push({ cost: -fill * 100, apply: () => trip.orders.push(order) })
        } else {
          attempts.push(...res.failures)
        }
      })
    }

    // 2. Otherwise open a new trip on the vehicle that wastes the least scarce capacity.
    if (options.length === 0) {
      const d = demand.get(demandKey(order))
      for (const vehicle of vehicles) {
        if (vehicle.depot !== order.depot || !vehicle.available) continue
        if (order.temp === 'chilled' && vehicle.temp !== 'reefer') continue
        if (order.parking === 'van_only' && vehicle.type !== 'van') continue
        const trips = dayTrips.get(vehicle.vehicle_id)
        const newTrip = { vehicle_id: vehicle.vehicle_id, brand: order.brand, district: order.district, kind: kindOf(order.brand), orders: [order], seq: seq }
        const res = validateVehicleDay(vehicle, [...trips, newTrip], ctx)
        if (!res.ok) {
          attempts.push(...res.failures)
          continue
        }
        let cost = 0
        if (vehicle.temp === 'reefer' && order.temp !== 'chilled') cost += 40
        if (vehicle.type === 'van' && order.parking !== 'van_only') cost += 80
        if (trips.length > 0) cost += newTrip.kind === 'fresh' ? 15 : -10 // reuse vehicles after their Fresh run
        const util = Math.max(d.weight / vehicle.weight_cap, d.volume / vehicle.volume_cap)
        cost += util >= 1 ? (util - 1) * 5 : (1 - util) * 20 // right-size the vehicle to the district's demand
        options.push({ cost, apply: () => { trips.push(newTrip); seq++ } })
      }
    }

    const d = demand.get(demandKey(order))
    d.weight -= order.weight
    d.volume -= order.volume

    if (options.length) {
      options.sort((a, b) => a.cost - b.cost)[0].apply()
    } else {
      unscheduled.push({ order, ...diagnose(order, vehicles, attempts, (vid) => dayTrips.get(vid).length) })
    }
  }

  // Number trips per vehicle in the order they run (Fresh first).
  const trips = []
  for (const [vid, list] of dayTrips) {
    const vehicle = byId.get(vid)
    if (!list.length) continue
    const res = validateVehicleDay(vehicle, list, ctx)
    res.schedules.forEach(({ trip, schedule }, i) => trips.push({ ...trip, vehicle_id: vid, trip_number: i + 1, schedule, checks: checklist(res) }))
  }
  return { trips, unscheduled }
}

module.exports = {
  FRESH_BUDGET_MIN,
  DAY_BUDGET_MIN,
  MAX_TRIPS,
  kindOf,
  toMin,
  toTime,
  priorityCompare,
  validateVehicleDay,
  checklist,
  allocate,
}
