// Order intake rules from the brief:
//  - Orders for the next delivery day close at 4 PM (Asia/Colombo, UTC+05:30, no DST).
//  - Waypoint operates Monday–Saturday; operating_calendar.is_operating is authoritative.
//  - Orders received after the cutoff wait for the following run.
//  - The dispatcher may close intake for a delivery date (order_intake_closures), after which
//    submitted orders for that date are confirmed and become plannable.

const COLOMBO_OFFSET_MIN = 330
const CUTOFF_HOUR = Number(process.env.ORDER_CUTOFF_HOUR || 16)
const DAY_MS = 86400000

// WAYFLOW_NOW lets a demo or test pin the clock (ISO timestamp). Unset in normal operation.
function now() {
  return process.env.WAYFLOW_NOW ? new Date(process.env.WAYFLOW_NOW) : new Date()
}

function toColomboParts(date) {
  const shifted = new Date(date.getTime() + COLOMBO_OFFSET_MIN * 60000)
  return {
    date: shifted.toISOString().slice(0, 10),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  }
}

function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return new Date(d.getTime() + days * DAY_MS).toISOString().slice(0, 10)
}

// 0 = Monday … 6 = Sunday, matching calendar.csv
function dayOfWeek(dateStr) {
  return (new Date(`${dateStr}T00:00:00Z`).getUTCDay() + 6) % 7
}

// Absolute instant for HH:00 Colombo time on dateStr.
function colomboInstant(dateStr, hour) {
  return new Date(Date.parse(`${dateStr}T${String(hour).padStart(2, '0')}:00:00+05:30`))
}

async function loadOperatingMap(db, fromDate, toDate) {
  const rows = await db.query(
    `SELECT date, is_operating FROM operating_calendar WHERE date BETWEEN $1 AND $2`,
    [fromDate, toDate]
  )
  const map = new Map(rows.map((r) => [r.date, r.is_operating]))
  // Dates outside the supplied calendar fall back to the Mon–Sat operating rule.
  return (dateStr) => (map.has(dateStr) ? map.get(dateStr) : dayOfWeek(dateStr) !== 6)
}

// Cutoff for a delivery date: 16:00 on the last operating day before it.
// isOperating must cover the 14 days before deliveryDate.
function cutoffFrom(isOperating, deliveryDate) {
  let day = addDays(deliveryDate, -1)
  for (let i = 0; i < 14 && !isOperating(day); i++) day = addDays(day, -1)
  return colomboInstant(day, CUTOFF_HOUR)
}

async function cutoffFor(db, deliveryDate) {
  return cutoffFrom(await loadOperatingMap(db, addDays(deliveryDate, -14), deliveryDate), deliveryDate)
}

async function closedDates(db, fromDate, toDate) {
  const rows = await db.query(
    `SELECT delivery_date FROM order_intake_closures WHERE delivery_date BETWEEN $1 AND $2`,
    [fromDate, toDate]
  )
  return new Set(rows.map((r) => r.delivery_date))
}

// Describes whether a store may still order for deliveryDate.
async function intakeStatus(db, deliveryDate) {
  const today = toColomboParts(now()).date
  const [isOperating, closedSet] = await Promise.all([
    loadOperatingMap(db, addDays(deliveryDate, -14), deliveryDate),
    closedDates(db, deliveryDate, deliveryDate),
  ])
  const cutoffAt = cutoffFrom(isOperating, deliveryDate)
  const closed = closedSet.has(deliveryDate)

  let reason = null
  if (deliveryDate <= today) reason = 'Delivery date must be after today.'
  else if (!isOperating(deliveryDate)) reason = 'Waypoint does not deliver on this date.'
  else if (closed) reason = 'The dispatcher has already closed order intake for this date.'
  else if (now() >= cutoffAt) reason = 'The 4:00 PM order cutoff for this date has passed.'

  return { deliveryDate, open: reason === null, reason, cutoffAt, closed }
}

// Next `count` delivery dates a store can still order for.
async function deliveryOptions(db, count = 3) {
  const today = toColomboParts(now()).date
  const horizon = addDays(today, 21)
  // One calendar read covers every candidate day and the 14 days before it (for its cutoff).
  const [isOperating, closed] = await Promise.all([
    loadOperatingMap(db, addDays(today, -14), horizon),
    closedDates(db, today, horizon),
  ])
  const options = []

  for (let day = addDays(today, 1); day <= horizon && options.length < count; day = addDays(day, 1)) {
    if (!isOperating(day) || closed.has(day)) continue
    const cutoffAt = cutoffFrom(isOperating, day)
    if (now() < cutoffAt) options.push({ date: day, cutoffAt })
  }
  return options
}

// Confirms every submitted order whose intake has closed (cutoff passed or dispatcher closed
// the date). Idempotent and cheap, so it runs lazily before order reads and planning.
async function confirmDueOrders(db) {
  const rows = await db.query(
    `WITH due AS (
       UPDATE orders SET status = 'confirmed', updated_at = NOW()
       WHERE status = 'submitted'
         AND (cutoff_time <= $1
              OR target_delivery_date IN (SELECT delivery_date FROM order_intake_closures))
       RETURNING order_id
     )
     INSERT INTO order_status_events (order_id, from_status, to_status, actor_role, note)
     SELECT order_id, 'submitted', 'confirmed', 'System', 'Order intake closed — order confirmed for planning'
     FROM due
     RETURNING order_id`,
    [now()]
  )
  return rows.length
}

// Read paths call this instead of confirmDueOrders. Re-running the UPDATE on every request
// costs a database round trip each time, so the result is reused until either the earliest
// remaining cutoff passes or CONFIRM_RECHECK_MS elapses (which also picks up intake closures
// made by another server instance). Concurrent callers share one in-flight run.
const CONFIRM_RECHECK_MS = 15000
let confirmCache = { checkedAt: 0, nextDueAt: null, inFlight: null }

function invalidateConfirmCache() {
  confirmCache = { checkedAt: 0, nextDueAt: null, inFlight: null }
}

async function ensureOrdersConfirmed(db) {
  const c = confirmCache
  if (c.inFlight) return c.inFlight
  const current = now().getTime()
  const fresh = Date.now() - c.checkedAt < CONFIRM_RECHECK_MS
  if (fresh && (c.nextDueAt === null || current < c.nextDueAt)) return 0

  const run = (async () => {
    const at = now()
    const [row] = await db.query(
      `WITH due AS (
         UPDATE orders SET status = 'confirmed', updated_at = NOW()
         WHERE status = 'submitted'
           AND (cutoff_time <= $1
                OR target_delivery_date IN (SELECT delivery_date FROM order_intake_closures))
         RETURNING order_id
       ), logged AS (
         INSERT INTO order_status_events (order_id, from_status, to_status, actor_role, note)
         SELECT order_id, 'submitted', 'confirmed', 'System', 'Order intake closed — order confirmed for planning'
         FROM due
         RETURNING order_id
       )
       SELECT (SELECT COUNT(*) FROM logged)::int AS confirmed,
              (SELECT MIN(cutoff_time) FROM orders WHERE status = 'submitted' AND cutoff_time > $1) AS next_due`,
      [at]
    )
    if (confirmCache === c) {
      c.checkedAt = Date.now()
      c.nextDueAt = row.next_due ? new Date(row.next_due).getTime() : null
    }
    return row.confirmed
  })()
  c.inFlight = run
  try {
    return await run
  } finally {
    c.inFlight = null
  }
}

module.exports = {
  CUTOFF_HOUR,
  now,
  toColomboParts,
  addDays,
  cutoffFor,
  intakeStatus,
  deliveryOptions,
  confirmDueOrders,
  ensureOrdersConfirmed,
  invalidateConfirmCache,
}
