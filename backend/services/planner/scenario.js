// Peak-day demo scenario: a festival-week delivery day where demand exceeds the available fleet.
//
// Generates confirmed orders for the 120 real outlets from the real product catalog, puts part of
// the fleet in the workshop, and carries over a few orders deferred on the previous run — so the
// planner has to make (and explain) deferral decisions. Deterministic for a given date.

const { recordEvent } = require('../orderStatus')
const { cutoffFor, addDays } = require('../orderSchedule')

const SCENARIO_TAG = 'PEAK-DAY SCENARIO'

// Vehicles in the workshop on the scenario day (scarce reefers and vans included on purpose).
const WORKSHOP = [
  ['VEH003', 'Reefer truck — refrigeration unit service'],
  ['VEH007', 'Reefer truck — compressor fault'],
  ['VEH036', 'Reefer van — door seal replacement'],
  ['VEH013', 'Gearbox repair'],
  ['VEH015', 'Brake inspection'],
  ['VEH017', 'Tyre replacement'],
  ['VEH022', 'Scheduled service'],
  ['VEH041', 'Reefer truck — refrigeration unit service'],
  ['VEH046', 'Clutch repair'],
  ['VEH058', 'Reefer van — battery fault'],
]

function rng(seedText) {
  let h = 1779033703 ^ seedText.length
  for (let i = 0; i < seedText.length; i++) {
    h = Math.imul(h ^ seedText.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

async function previousOperatingDay(db, date) {
  const rows = await db.query(
    `SELECT date FROM operating_calendar WHERE date < $1 AND is_operating = true ORDER BY date DESC LIMIT 1`,
    [date]
  )
  if (rows[0]) return rows[0].date
  let d = addDays(date, -1)
  if (new Date(`${d}T00:00:00Z`).getUTCDay() === 0) d = addDays(d, -1)
  return d
}

// Builds order lines from catalog products until the target weight (or volume) is reached.
function buildItems(rand, pool, target, by) {
  const k = Math.min(pool.length, 3 + Math.floor(rand() * 3))
  const picked = [...pool].sort(() => rand() - 0.5).slice(0, k)
  return picked.map((p) => {
    const unit = by === 'volume' ? Number(p.volume_per_unit) : Number(p.weight_per_unit)
    const quantity = Math.max(1, Math.min(10000, Math.round(target / k / unit)))
    return {
      product_code: p.product_id,
      product_name: p.product_name,
      unit: p.unit,
      temp: p.temperature_requirement === 'reefer' ? 'chilled' : 'ambient',
      quantity,
      w: Number(p.weight_per_unit),
      v: Number(p.volume_per_unit),
    }
  })
}

async function createOrder(db, { orderId, outlet, date, cutoffAt, status, temp, items, managerId, note }) {
  const totals = items.reduce(
    (t, it) => ({ units: t.units + it.quantity, w: t.w + it.quantity * it.w, v: t.v + it.quantity * it.v }),
    { units: 0, w: 0, v: 0 }
  )
  const placed = new Date(new Date(cutoffAt).getTime() - 6 * 3600000) // placed on the morning before cutoff
  await db.query(
    `INSERT INTO orders (order_id, outlet_id, brand, district, depot, order_date, target_delivery_date, cutoff_time,
       placed_before_cutoff, status, temp_requirement, total_units, total_weight_kg, total_volume_m3,
       requested_window_open, requested_window_close, order_notes, created_by_user_id, priority, outlet_reference,
       created_at, submitted_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,$9,$10,$11,$12,$13,$14,$15,$16,$17,'normal',$18,$19,$19)`,
    [orderId, outlet.outlet_id, outlet.brand, outlet.district, outlet.depot, placed.toISOString().slice(0, 10), date,
      cutoffAt, status, temp, totals.units, Math.round(totals.w * 100) / 100, Math.round(totals.v * 1000) / 1000,
      outlet.window_open_time, outlet.window_close_time, note, managerId, SCENARIO_TAG, placed]
  )
  for (const it of items) {
    await db.query(
      `INSERT INTO order_items (order_id, product_code, product_name, sku, unit, temp_requirement, quantity_cases,
         weight_per_case_kg, volume_per_case_m3, total_item_weight_kg, total_item_volume_m3)
       VALUES ($1,$2,$3,$2,$4,$5,$6,$7,$8,$9,$10)`,
      [orderId, it.product_code, it.product_name, it.unit, it.temp, it.quantity, it.w, it.v,
        Math.round(it.quantity * it.w * 100) / 100, Math.round(it.quantity * it.v * 1000) / 1000]
    )
  }
  const actor = { userId: managerId, role: managerId ? 'Store Manager' : 'System' }
  await recordEvent(db, { orderId, to: 'submitted', actor, note: 'Order placed (peak-day scenario)' })
  await recordEvent(db, { orderId, from: 'submitted', to: 'confirmed', actor: { role: 'System' }, note: 'Order intake closed — order confirmed for planning' })
}

async function nextOrderId(db, year) {
  const [{ seq }] = await db.query(`SELECT nextval('order_number_seq') AS seq`)
  return `ORD-${year}-${String(seq).padStart(5, '0')}`
}

// Replaces any earlier scenario for the date and generates a fresh one.
async function generatePeakDay(db, date, { actorUserId = null } = {}) {
  const [plan] = await db.query('SELECT status FROM delivery_plans WHERE delivery_date = $1', [date])
  if (plan?.status === 'published') {
    const err = new Error('The plan for this date is already published; pick another date for the scenario.')
    err.status = 409
    throw err
  }

  const prevDate = await previousOperatingDay(db, date)

  // Clear the previous scenario for this date (draft trips first, they reference the orders).
  await db.query(`DELETE FROM trip_stops WHERE trip_id IN (SELECT trip_id FROM trips WHERE delivery_date = $1 AND status = 'draft')`, [date])
  await db.query(`DELETE FROM trips WHERE delivery_date = $1 AND status = 'draft'`, [date])
  await db.query(`DELETE FROM delivery_plans WHERE delivery_date = $1`, [date])
  const old = await db.query(
    `SELECT order_id FROM orders WHERE outlet_reference = $1 AND target_delivery_date IN ($2, $3)
       AND status IN ('confirmed', 'deferred')`,
    [SCENARIO_TAG, date, prevDate]
  )
  const oldIds = old.map((r) => r.order_id)
  if (oldIds.length) {
    await db.query('DELETE FROM order_deferrals WHERE order_id = ANY($1)', [oldIds])
    await db.query('DELETE FROM orders WHERE order_id = ANY($1)', [oldIds])
  }

  await db.query('DELETE FROM vehicle_availability WHERE date = $1', [date])
  for (const [vid, reason] of WORKSHOP) {
    await db.query(
      `INSERT INTO vehicle_availability (vehicle_id, date, status, reason)
       SELECT $1::varchar, $2::date, 'in_workshop', $3::text
       WHERE EXISTS (SELECT 1 FROM vehicles WHERE vehicle_id = $1::varchar)`,
      [vid, date, reason]
    )
  }

  const outlets = await db.query('SELECT * FROM outlets ORDER BY outlet_id')
  const products = await db.query('SELECT * FROM products')
  const managers = await db.query(`SELECT outlet_id, user_id FROM users WHERE role = 'Store Manager' AND outlet_id IS NOT NULL`)
  const managerOf = new Map(managers.map((m) => [m.outlet_id, m.user_id]))
  const pool = (brand, temp) => products.filter((p) => p.brand === brand && (temp === 'chilled' ? p.temperature_requirement === 'reefer' : p.temperature_requirement !== 'reefer'))
  // Hanging garments: the bulkiest Style lines, so Style fills volume before weight.
  const style = pool('Style', 'ambient').sort((a, b) => a.weight_per_unit / a.volume_per_unit - b.weight_per_unit / b.volume_per_unit)
  const pools = {
    'Fresh|ambient': pool('Fresh', 'ambient'),
    'Fresh|chilled': pool('Fresh', 'chilled'),
    'Style|ambient': style.slice(0, Math.max(5, Math.floor(style.length / 3))),
    'Tech|ambient': pool('Tech', 'ambient'),
  }

  const rand = rng(`wayflow-peak-${date}`)
  const year = date.slice(0, 4)
  const cutoffAt = await cutoffFor(db, date)
  const festival = 1.25 // festival one week away: Fresh demand is rising
  let created = 0

  for (const outlet of outlets) {
    const plans = []
    if (outlet.brand === 'Fresh') {
      plans.push({ temp: 'ambient', target: (380 + rand() * 520) * festival, by: 'weight' })
      if (rand() < 0.75) plans.push({ temp: 'chilled', target: (260 + rand() * 420) * festival, by: 'weight' })
    } else if (outlet.brand === 'Style' && rand() < 0.5) {
      plans.push({ temp: 'ambient', target: 5 + rand() * 9, by: 'volume' })
    } else if (outlet.brand === 'Tech' && rand() < 0.45) {
      plans.push({ temp: 'ambient', target: 450 + rand() * 1100, by: 'weight' })
    }
    for (const p of plans) {
      const items = buildItems(rand, pools[`${outlet.brand}|${p.temp}`], p.target, p.by)
      await createOrder(db, {
        orderId: await nextOrderId(db, year), outlet, date, cutoffAt, status: 'confirmed', temp: p.temp, items,
        managerId: managerOf.get(outlet.outlet_id) || null, note: 'Festival-week replenishment',
      })
      created++
    }
  }

  // Orders deferred on the previous run: they come back first under the fairness rule.
  const carried = outlets.filter((o) => o.brand === 'Fresh' && o.depot === 'Peliyagoda').slice(0, 3)
    .concat(outlets.filter((o) => o.brand === 'Style' && o.depot === 'Peliyagoda').slice(0, 1))
  const prevCutoff = await cutoffFor(db, prevDate)
  for (const outlet of carried) {
    const temp = outlet.brand === 'Fresh' ? 'chilled' : 'ambient'
    const orderId = await nextOrderId(db, year)
    const items = buildItems(rand, pools[`${outlet.brand}|${temp}`], outlet.brand === 'Fresh' ? 320 : 7, outlet.brand === 'Fresh' ? 'weight' : 'volume')
    await createOrder(db, { orderId, outlet, date: prevDate, cutoffAt: prevCutoff, status: 'deferred', temp, items, managerId: managerOf.get(outlet.outlet_id) || null, note: 'Carried over from the previous run' })
    const reason = temp === 'chilled' ? 'no_reefer_available' : 'capacity_exceeded'
    const explanation = temp === 'chilled'
      ? 'All refrigerated vehicles at Peliyagoda were committed to earlier Fresh runs.'
      : 'Style volume exceeded the remaining truck capacity on the previous run.'
    await db.query(
      `INSERT INTO order_deferrals (order_id, outlet_id, planning_date, deferral_reason, explanation,
         consecutive_deferral_count, next_scheduled_date, decided_by_user_id)
       VALUES ($1,$2,$3,$4,$5,1,$6,$7)`,
      [orderId, outlet.outlet_id, prevDate, reason, explanation, date, actorUserId]
    )
    await recordEvent(db, { orderId, from: 'confirmed', to: 'deferred', actor: { userId: actorUserId, role: 'Dispatcher' }, note: `${explanation} Moved to ${date}.` })
    created++
  }

  return { date, created, carried_over: carried.length, in_workshop: WORKSHOP.length }
}

module.exports = { generatePeakDay, SCENARIO_TAG, WORKSHOP }
