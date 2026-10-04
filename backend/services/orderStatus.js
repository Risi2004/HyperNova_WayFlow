// Single source of truth for the order lifecycle shared by all four roles.
//
//   draft → submitted → confirmed (cutoff) → planned | deferred → loading → loaded | shortfall
//   → dispatched → delivered | partial | failed → received | disputed
//
// Every change goes through transitionOrder() so the audit trail in order_status_events
// always explains how an order reached its current state.

const ORDER_STATUSES = [
  'draft',
  'submitted',
  'confirmed',
  'planned',
  'deferred',
  'loading',
  'loaded',
  'shortfall',
  'dispatched',
  'delivered',
  'partial',
  'failed',
  'received',
  'disputed',
  'cancelled',
]

const TRANSITIONS = {
  draft: ['submitted', 'cancelled'],
  submitted: ['confirmed', 'cancelled'],
  confirmed: ['planned', 'deferred', 'cancelled'],
  // A deferred order re-enters planning on a later run, or is deferred again.
  deferred: ['planned', 'deferred', 'cancelled'],
  // Planned orders can be pulled back into the queue or deferred until loading starts.
  planned: ['confirmed', 'deferred', 'loading'],
  loading: ['loaded', 'shortfall'],
  shortfall: ['loaded', 'planned', 'deferred'],
  loaded: ['dispatched'],
  dispatched: ['delivered', 'partial', 'failed'],
  failed: ['deferred'],
  delivered: ['received', 'disputed'],
  partial: ['received', 'disputed'],
  disputed: ['received'],
  received: [],
  cancelled: [],
}

// Orders that still represent demand the dispatcher has to plan for.
const PLANNABLE_STATUSES = ['confirmed', 'deferred']

// Orders the store manager may still withdraw themselves.
const STORE_CANCELLABLE_STATUSES = ['draft', 'submitted']

const DEFERRAL_REASONS = {
  capacity_exceeded: 'Vehicle weight or volume capacity exceeded',
  no_reefer_available: 'No refrigerated vehicle capacity left',
  no_van_available: 'No van available for a van-only outlet',
  time_window: 'Delivery window cannot be met on this run',
  fuel_quota: 'Weekly fuel quota exhausted',
  outlet_access: 'Outlet access restriction (mall window / parking)',
  dispatcher_decision: 'Dispatcher prioritisation decision',
  failed_delivery: 'Delivery attempt failed — rescheduled',
}

class OrderStatusError extends Error {
  constructor(message, status = 409) {
    super(message)
    this.status = status
  }
}

function canTransition(from, to) {
  return (TRANSITIONS[from] || []).includes(to)
}

function assertTransition(orderId, from, to) {
  if (!ORDER_STATUSES.includes(to)) {
    throw new OrderStatusError(`Unknown order status '${to}'.`, 400)
  }
  if (!canTransition(from, to)) {
    throw new OrderStatusError(`Order ${orderId} cannot move from '${from}' to '${to}'.`)
  }
}

async function recordEvent(db, { orderId, from = null, to, actor, note = null }) {
  await db.query(
    `INSERT INTO order_status_events (order_id, from_status, to_status, actor_user_id, actor_role, note)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [orderId, from, to, actor?.userId || null, actor?.role || 'System', note]
  )
}

// Moves one order to a new status after validating the transition.
// `db` is either the shared pool (`sql`) or a transaction client.
async function transitionOrder(db, orderId, to, actor, note = null) {
  const rows = await db.query('SELECT status FROM orders WHERE order_id = $1 FOR UPDATE', [orderId])
  if (rows.length === 0) throw new OrderStatusError(`Order ${orderId} not found.`, 404)

  const from = rows[0].status
  assertTransition(orderId, from, to)

  await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2', [to, orderId])
  await recordEvent(db, { orderId, from, to, actor, note })
  return { orderId, from, to }
}

// Inserts many audit events in one statement, keeping their order.
// events: [{ orderId, from, to, actor, note }]
async function recordEvents(db, events) {
  if (!events.length) return
  await db.query(
    `INSERT INTO order_status_events (order_id, from_status, to_status, actor_user_id, actor_role, note)
     SELECT e.order_id, e.from_status, e.to_status, e.actor_user_id, e.actor_role, e.note
     FROM unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
          WITH ORDINALITY AS e(order_id, from_status, to_status, actor_user_id, actor_role, note, n)
     ORDER BY e.n`,
    [
      events.map((e) => e.orderId),
      events.map((e) => e.from ?? null),
      events.map((e) => e.to),
      events.map((e) => e.actor?.userId || null),
      events.map((e) => e.actor?.role || 'System'),
      events.map((e) => e.note ?? null),
    ]
  )
}

// Same as calling transitionOrder for each order in turn (same validation, same errors, same
// audit trail), but in three statements instead of three per order.
// note: a string, or a function (orderId) => string.
async function transitionOrders(db, orderIds, to, actor, note = null) {
  const ids = [...new Set(orderIds)]
  if (!ids.length) return []
  const rows = await db.query(
    'SELECT order_id, status FROM orders WHERE order_id = ANY($1) ORDER BY order_id FOR UPDATE',
    [ids]
  )
  const fromById = new Map(rows.map((r) => [r.order_id, r.status]))
  for (const orderId of ids) {
    if (!fromById.has(orderId)) throw new OrderStatusError(`Order ${orderId} not found.`, 404)
    assertTransition(orderId, fromById.get(orderId), to)
  }

  await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = ANY($2)', [to, ids])
  const noteFor = typeof note === 'function' ? note : () => note
  const results = ids.map((orderId) => ({ orderId, from: fromById.get(orderId), to }))
  await recordEvents(db, results.map((r) => ({ ...r, actor, note: noteFor(r.orderId) })))
  return results
}

module.exports = {
  ORDER_STATUSES,
  TRANSITIONS,
  PLANNABLE_STATUSES,
  STORE_CANCELLABLE_STATUSES,
  DEFERRAL_REASONS,
  OrderStatusError,
  canTransition,
  assertTransition,
  recordEvent,
  recordEvents,
  transitionOrder,
  transitionOrders,
}
