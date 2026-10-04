const express = require('express')
const { sql, withTransaction } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const {
  STORE_CANCELLABLE_STATUSES,
  DEFERRAL_REASONS,
  OrderStatusError,
  assertTransition,
  recordEvent,
  recordEvents,
  transitionOrder,
  transitionOrders,
} = require('../services/orderStatus')
const {
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
} = require('../services/orderSchedule')

const router = express.Router()
router.use(verifyToken)

const STORE_MANAGER = 'Store Manager'
const PLANNING_ROLES = ['Dispatcher', 'Admin']

// Dispatcher status filter groups, matching the Orders screen filter options.
const STATUS_GROUPS = {
  pending: ['submitted', 'confirmed'],
  planned: ['planned'],
  loading: ['loading', 'loaded'],
  deferred: ['deferred'],
  in_transit: ['dispatched'],
  completed: ['delivered', 'partial', 'received'],
  exception: ['shortfall', 'failed', 'disputed'],
  cancelled: ['cancelled'],
}

// ---------- helpers ----------

function httpError(status, message, extra = {}) {
  const err = new Error(message)
  err.status = status
  err.extra = extra
  return err
}

function sendError(res, err, fallback) {
  const status = err.status || (err instanceof OrderStatusError ? err.status : 500)
  if (status >= 500) console.error(fallback, err)
  res.status(status).json({ error: status >= 500 ? `${fallback}. Please try again.` : err.message, ...(err.extra || {}) })
}

const isRole = (req, role) => (req.user.role || '').toLowerCase() === role.toLowerCase()
const actorOf = (req) => ({ userId: req.user.userId, role: req.user.role })

// Products store 'reefer' for cold-chain items; orders use the brief's chilled/ambient vocabulary.
function orderTempFor(productTemp) {
  const t = String(productTemp || '').toLowerCase()
  return t === 'reefer' || t === 'chilled' || t === 'frozen' ? 'chilled' : 'ambient'
}

function toMinutes(time) {
  if (!time) return null
  const [h, m] = String(time).split(':').map(Number)
  return h * 60 + m
}

function normaliseTime(time) {
  if (!time) return null
  const match = /^(\d{1,2}):(\d{2})/.exec(String(time).trim())
  if (!match) return null
  return `${match[1].padStart(2, '0')}:${match[2]}`
}

const round = (value, dp) => Math.round(Number(value) * 10 ** dp) / 10 ** dp

async function loadStoreContext(userId) {
  const rows = await sql.query(
    `SELECT u.user_id, u.full_name, u.phone, u.outlet_id,
            o.brand, o.district, o.depot, o.dock_type, o.parking_constraint, o.mall_window,
            o.window_open_time, o.window_close_time
     FROM users u
     LEFT JOIN outlets o ON o.outlet_id = u.outlet_id
     WHERE u.user_id = $1`,
    [userId]
  )
  const ctx = rows[0]
  if (!ctx || !ctx.outlet_id || !ctx.brand) {
    throw httpError(400, 'Your account is not linked to an outlet. Ask an administrator to assign one.')
  }
  return ctx
}

// Validates requested items against the master catalog. Weight and volume always come from
// the catalog, never from the client.
async function resolveItems(rawItems, brand) {
  if (!Array.isArray(rawItems)) throw httpError(400, 'Items must be a list.')

  const merged = new Map()
  for (const item of rawItems) {
    const productId = String(item?.product_id || '').trim()
    const quantity = Number(item?.quantity)
    if (!productId) throw httpError(400, 'Every item needs a product_id.')
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
      throw httpError(400, `Quantity for ${productId} must be a whole number between 1 and 10,000.`)
    }
    merged.set(productId, (merged.get(productId) || 0) + quantity)
  }
  if (merged.size === 0) return []

  const ids = [...merged.keys()]
  const products = await sql.query(
    `SELECT product_id, product_name, brand, temperature_requirement, weight_per_unit, volume_per_unit, unit
     FROM products WHERE product_id = ANY($1)`,
    [ids]
  )
  const byId = new Map(products.map((p) => [p.product_id, p]))

  return ids.map((id) => {
    const p = byId.get(id)
    if (!p) throw httpError(400, `Product ${id} is not in the catalog.`)
    if (p.brand !== brand) {
      throw httpError(400, `${p.product_name} is a Waypoint ${p.brand} product and cannot be ordered by a ${brand} outlet.`)
    }
    const quantity = merged.get(id)
    const weight = Number(p.weight_per_unit)
    const volume = Number(p.volume_per_unit)
    return {
      product_code: p.product_id,
      product_name: p.product_name,
      unit: p.unit,
      temp_requirement: orderTempFor(p.temperature_requirement),
      quantity,
      weight_per_unit: weight,
      volume_per_unit: volume,
      total_weight: round(weight * quantity, 2),
      total_volume: round(volume * quantity, 3),
    }
  })
}

// Requested window must fall inside the outlet's delivery window (mall outlets inherit
// the mall's access window through their outlet window).
function resolveWindow(ctx, open, close) {
  const outletOpen = normaliseTime(ctx.window_open_time)
  const outletClose = normaliseTime(ctx.window_close_time)
  const reqOpen = normaliseTime(open) || outletOpen
  const reqClose = normaliseTime(close) || outletClose

  if (toMinutes(reqOpen) >= toMinutes(reqClose)) {
    throw httpError(400, 'Delivery window must end after it starts.')
  }
  if (toMinutes(reqOpen) < toMinutes(outletOpen) || toMinutes(reqClose) > toMinutes(outletClose)) {
    throw httpError(400, `Requested window must be within this outlet's delivery window (${outletOpen}–${outletClose}).`)
  }
  return { open: reqOpen, close: reqClose }
}

function summarise(items) {
  return items.reduce(
    (acc, it) => ({
      units: acc.units + it.quantity,
      weight: round(acc.weight + it.total_weight, 2),
      volume: round(acc.volume + it.total_volume, 3),
    }),
    { units: 0, weight: 0, volume: 0 }
  )
}

async function nextOrderId(db) {
  const [{ seq }] = await db.query(`SELECT nextval('order_number_seq') AS seq`)
  const year = toColomboParts(now()).date.slice(0, 4)
  return `ORD-${year}-${String(seq).padStart(5, '0')}`
}

async function insertItems(db, orderId, items) {
  if (!items.length) return
  // One multi-row INSERT; WITH ORDINALITY keeps item_id in cart order.
  await db.query(
    `INSERT INTO order_items (
       order_id, product_code, product_name, sku, unit, temp_requirement, quantity_cases,
       weight_per_case_kg, volume_per_case_m3, total_item_weight_kg, total_item_volume_m3)
     SELECT $1, i.code, i.name, i.code, i.unit, i.temp, i.qty, i.w, i.v, i.tw, i.tv
     FROM unnest($2::text[], $3::text[], $4::text[], $5::text[], $6::int[],
                 $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[])
          WITH ORDINALITY AS i(code, name, unit, temp, qty, w, v, tw, tv, n)
     ORDER BY i.n`,
    [orderId, items.map((it) => it.product_code), items.map((it) => it.product_name), items.map((it) => it.unit),
      items.map((it) => it.temp_requirement), items.map((it) => it.quantity), items.map((it) => it.weight_per_unit),
      items.map((it) => it.volume_per_unit), items.map((it) => it.total_weight), items.map((it) => it.total_volume)]
  )
}

async function writeOrderRow(db, { orderId, ctx, userId, deliveryDate, cutoffAt, status, temp, items, window, body, groupId, isNew }) {
  const totals = summarise(items)
  const values = [
    orderId, ctx.outlet_id, ctx.brand, ctx.district, ctx.depot,
    toColomboParts(now()).date, deliveryDate, cutoffAt, status, temp,
    totals.units, totals.weight, totals.volume, window.open, window.close,
    body.notes?.trim() || null, userId, body.priority === 'urgent' ? 'urgent' : 'normal',
    body.outlet_reference?.trim() || null, groupId, status === 'submitted' ? now() : null,
  ]

  if (isNew) {
    await db.query(
      `INSERT INTO orders (
         order_id, outlet_id, brand, district, depot, order_date, target_delivery_date, cutoff_time,
         placed_before_cutoff, status, temp_requirement, total_units, total_weight_kg, total_volume_m3,
         requested_window_open, requested_window_close, order_notes, created_by_user_id,
         priority, outlet_reference, order_group_id, submitted_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
      values
    )
  } else {
    await db.query(
      `UPDATE orders SET
         outlet_id=$2, brand=$3, district=$4, depot=$5, order_date=$6, target_delivery_date=$7,
         cutoff_time=$8, status=$9, temp_requirement=$10, total_units=$11, total_weight_kg=$12,
         total_volume_m3=$13, requested_window_open=$14, requested_window_close=$15, order_notes=$16,
         created_by_user_id=$17, priority=$18, outlet_reference=$19, order_group_id=$20,
         submitted_at=$21, updated_at=NOW()
       WHERE order_id=$1`,
      values
    )
    await db.query('DELETE FROM order_items WHERE order_id = $1', [orderId])
  }
  await insertItems(db, orderId, items)
  return { order_id: orderId, temp_requirement: temp, total_units: totals.units, total_weight_kg: totals.weight, total_volume_m3: totals.volume }
}

async function loadOwnDraft(db, draftId, userId) {
  const rows = await db.query(
    `SELECT order_id, status FROM orders WHERE order_id = $1 AND created_by_user_id = $2 FOR UPDATE`,
    [draftId, userId]
  )
  if (rows.length === 0) throw httpError(404, `Draft ${draftId} was not found.`)
  if (rows[0].status !== 'draft') throw httpError(409, `${draftId} has already been submitted.`)
  return rows[0]
}

// Shared SELECT used by the store manager and dispatcher order lists.
const ORDER_LIST_SELECT = `
  SELECT o.order_id, o.outlet_id, o.brand, o.district, o.depot, o.status, o.priority,
         o.temp_requirement, o.order_date, o.target_delivery_date, o.cutoff_time,
         o.requested_window_open, o.requested_window_close, o.total_units,
         o.total_weight_kg, o.total_volume_m3, o.order_notes, o.outlet_reference,
         o.order_group_id, o.created_at, o.submitted_at, o.updated_at,
         ol.dock_type, ol.parking_constraint, ol.mall_window,
         (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.order_id) AS sku_count,
         t.trip_id, t.vehicle_id, t.status AS trip_status, t.planned_departure_time,
         ts.planned_arrival_time, ts.stop_sequence,
         v.type AS vehicle_type, v.temp AS vehicle_temp, du.full_name AS driver_name,
         d.deferral_reason, d.explanation AS deferral_explanation, d.next_scheduled_date,
         d.consecutive_deferral_count,
         rc.receipt_status, rc.confirmed_at AS received_at, dr.received_by_name
  FROM orders o
  JOIN outlets ol ON ol.outlet_id = o.outlet_id
  LEFT JOIN trip_stops ts ON ts.order_id = o.order_id
  LEFT JOIN trips t ON t.trip_id = ts.trip_id
  LEFT JOIN vehicles v ON v.vehicle_id = t.vehicle_id
  LEFT JOIN users du ON du.user_id = COALESCE(t.driver_user_id, (SELECT dv.user_id FROM users dv WHERE dv.assigned_vehicle_id = t.vehicle_id AND dv.role = 'Driver' ORDER BY dv.created_at LIMIT 1))
  LEFT JOIN LATERAL (
    SELECT deferral_reason, explanation, next_scheduled_date, consecutive_deferral_count
    FROM order_deferrals od WHERE od.order_id = o.order_id
    ORDER BY od.created_at DESC, od.deferral_id DESC LIMIT 1
  ) d ON true
  LEFT JOIN receipt_confirmations rc ON rc.order_id = o.order_id
  LEFT JOIN delivery_records dr ON dr.order_id = o.order_id`

// ---------- Store manager ----------

// GET /api/orders/schedule — outlet profile, next orderable delivery dates and cutoff.
router.get('/schedule', requireRole(STORE_MANAGER), async (req, res) => {
  try {
    const [ctx, options] = await Promise.all([loadStoreContext(req.user.userId), deliveryOptions(sql, 12)])
    res.json({
      outlet: {
        outlet_id: ctx.outlet_id,
        brand: ctx.brand,
        district: ctx.district,
        depot: ctx.depot,
        dock_type: ctx.dock_type,
        parking_constraint: ctx.parking_constraint,
        mall_window: ctx.mall_window,
        window_open: normaliseTime(ctx.window_open_time),
        window_close: normaliseTime(ctx.window_close_time),
      },
      manager: { name: ctx.full_name, phone: ctx.phone },
      cutoff_hour: CUTOFF_HOUR,
      server_time: now(),
      delivery_options: options,
    })
  } catch (err) {
    sendError(res, err, 'Failed to load order schedule')
  }
})

// GET /api/orders/draft — the store manager's most recent unsubmitted draft, if any.
router.get('/draft', requireRole(STORE_MANAGER), async (req, res) => {
  try {
    const drafts = await sql.query(
      `SELECT order_id, target_delivery_date, requested_window_open, requested_window_close,
              priority, outlet_reference, order_notes, updated_at
       FROM orders WHERE created_by_user_id = $1 AND status = 'draft'
       ORDER BY updated_at DESC NULLS LAST LIMIT 1`,
      [req.user.userId]
    )
    if (drafts.length === 0) return res.json({ draft: null })

    const items = await sql.query(
      `SELECT oi.product_code, oi.product_name, oi.unit, oi.temp_requirement, oi.quantity_cases AS quantity,
              oi.weight_per_case_kg AS weight_per_unit, oi.volume_per_case_m3 AS volume_per_unit
       FROM order_items oi WHERE oi.order_id = $1 ORDER BY oi.item_id`,
      [drafts[0].order_id]
    )
    res.json({ draft: { ...drafts[0], items } })
  } catch (err) {
    sendError(res, err, 'Failed to load draft')
  }
})

// POST /api/orders — save a draft (submit=false) or submit an order (submit=true).
// A cart containing chilled and ambient goods is split into two orders, because chilled
// orders need a refrigerated vehicle and are planned separately (as Fresh outlets do today).
router.post('/', requireRole(STORE_MANAGER), async (req, res) => {
  const body = req.body || {}
  const submit = body.submit === true
  const userId = req.user.userId

  try {
    const ctx = await loadStoreContext(userId)
    const deliveryDate = /^\d{4}-\d{2}-\d{2}$/.test(body.delivery_date || '') ? body.delivery_date : null
    // The intake check doesn't depend on the items, so it runs alongside their catalog lookup.
    const [items, intakeCheck] = await Promise.all([
      resolveItems(body.items || [], ctx.brand),
      submit && deliveryDate ? intakeStatus(sql, deliveryDate) : null,
    ])
    const window = resolveWindow(ctx, body.window_open, body.window_close)

    if (!submit) {
      const draftDate = deliveryDate || addDays(toColomboParts(now()).date, 1)
      const cutoffAt = await cutoffFor(sql, draftDate)
      const temp = items.some((i) => i.temp_requirement === 'chilled') ? 'chilled' : 'ambient'

      const saved = await withTransaction(async (tx) => {
        const isNew = !body.draft_id
        const orderId = isNew ? await nextOrderId(tx) : (await loadOwnDraft(tx, body.draft_id, userId)).order_id
        const order = await writeOrderRow(tx, {
          orderId, ctx, userId, deliveryDate: draftDate, cutoffAt, status: 'draft', temp, items, window, body, groupId: null, isNew,
        })
        if (isNew) await recordEvent(tx, { orderId, to: 'draft', actor: actorOf(req), note: 'Draft saved' })
        return order
      })
      return res.json({ success: true, draft: saved, message: `Draft ${saved.order_id} saved.` })
    }

    if (!deliveryDate) throw httpError(400, 'Choose a delivery date.')
    if (items.length === 0) throw httpError(400, 'Add at least one product before submitting.')

    const intake = intakeCheck
    if (!intake.open) {
      const options = await deliveryOptions(sql, 1)
      throw httpError(422, intake.reason, { next_available_date: options[0]?.date || null })
    }

    const groups = ['chilled', 'ambient']
      .map((temp) => ({ temp, items: items.filter((i) => i.temp_requirement === temp) }))
      .filter((g) => g.items.length > 0)

    const created = await withTransaction(async (tx) => {
      const results = []
      let groupId = null
      if (body.draft_id) await loadOwnDraft(tx, body.draft_id, userId)

      for (const [index, group] of groups.entries()) {
        const reuseDraft = index === 0 && body.draft_id
        const orderId = reuseDraft ? body.draft_id : await nextOrderId(tx)
        if (groups.length > 1 && !groupId) groupId = orderId

        const order = await writeOrderRow(tx, {
          orderId, ctx, userId, deliveryDate, cutoffAt: intake.cutoffAt, status: 'submitted',
          temp: group.temp, items: group.items, window, body, groupId, isNew: !reuseDraft,
        })
        const note = groups.length > 1
          ? `Order placed (${group.temp} portion of a split ${ctx.brand} order)`
          : 'Order placed by store manager'
        await recordEvent(tx, { orderId, from: reuseDraft ? 'draft' : null, to: 'submitted', actor: actorOf(req), note })
        results.push(order)
      }
      return results
    })
    invalidateConfirmCache()

    const ids = created.map((o) => o.order_id).join(' and ')
    res.status(201).json({
      success: true,
      orders: created,
      delivery_date: deliveryDate,
      cutoff_at: intake.cutoffAt,
      message: created.length > 1
        ? `Orders ${ids} submitted. Chilled and ambient goods were split so the chilled order travels on a refrigerated vehicle.`
        : `Order ${ids} submitted for delivery on ${deliveryDate}.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to save order')
  }
})

// GET /api/orders/mine — every order for the store manager's outlet.
// ?include_cancelled=true adds withdrawn / cancelled orders (Order History).
router.get('/mine', requireRole(STORE_MANAGER), async (req, res) => {
  try {
    await ensureOrdersConfirmed(sql)
    const hidden = req.query.include_cancelled === 'true' ? ['draft'] : ['draft', 'cancelled']
    // The list selects by the user's outlet directly, so it runs alongside the outlet check.
    const [ctx, orders] = await Promise.all([
      loadStoreContext(req.user.userId),
      sql.query(
        `${ORDER_LIST_SELECT}
         WHERE o.outlet_id = (SELECT outlet_id FROM users WHERE user_id = $1) AND o.status <> ALL($2)
         ORDER BY o.created_at DESC
         LIMIT 500`,
        [req.user.userId, hidden]
      ),
    ])
    res.json({ outlet_id: ctx.outlet_id, orders })
  } catch (err) {
    sendError(res, err, 'Failed to load outlet orders')
  }
})

// ---------- Dispatcher ----------

// GET /api/orders — order queue with filters, status counts and pagination.
router.get('/', requireRole(...PLANNING_ROLES), async (req, res) => {
  const { date, status, brand, depot, priority, requirement, window, search } = req.query
  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const pageSize = Math.min(100, Math.max(5, parseInt(req.query.pageSize, 10) || 20))

  try {
    await ensureOrdersConfirmed(sql)

    // Base scope (drives stat cards): date, brand, depot. Status/other filters narrow the table.
    const scope = [`o.status NOT IN ('draft')`]
    const params = []
    const add = (clause, value) => {
      params.push(value)
      scope.push(clause.replace('?', `$${params.length}`))
    }
    if (date && date !== 'all') add('o.target_delivery_date = ?', date)
    if (brand && brand !== 'all') add('LOWER(o.brand) = ?', brand.toLowerCase())
    if (depot && depot !== 'all') add('LOWER(o.depot) = ?', depot.toLowerCase())
    const scopeParams = [...params]

    const where = [...scope]
    if (status && status !== 'all' && STATUS_GROUPS[status]) {
      params.push(STATUS_GROUPS[status])
      where.push(`o.status = ANY($${params.length})`)
    } else if (!status || status === 'all') {
      where.push(`o.status <> 'cancelled'`)
    }
    if (priority && priority !== 'all') {
      params.push(priority.toLowerCase())
      where.push(`o.priority = $${params.length}`)
    }
    if (requirement === 'refrigerated') where.push(`o.temp_requirement = 'chilled'`)
    if (requirement === 'van') where.push(`ol.parking_constraint = 'van_only'`)
    if (requirement === 'mall') where.push(`ol.parking_constraint = 'mall_dock'`)
    if (requirement === 'standard') {
      where.push(`o.temp_requirement = 'ambient' AND ol.parking_constraint = 'normal'`)
    }
    if (window === 'early') where.push(`o.requested_window_open < '08:00'`)
    if (window === 'morning') where.push(`o.requested_window_open >= '08:00' AND o.requested_window_open < '12:00'`)
    if (window === 'afternoon') where.push(`o.requested_window_open >= '12:00'`)
    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`)
      const p = `$${params.length}`
      where.push(`(LOWER(o.order_id) LIKE ${p} OR LOWER(o.outlet_id) LIKE ${p} OR LOWER(o.district) LIKE ${p} OR LOWER(o.brand) LIKE ${p})`)
    }

    const whereSql = where.join(' AND ')
    // The five queries are independent, so they run concurrently.
    const [statsRows, [{ total }], orders, dates, attention] = await Promise.all([
      sql.query(
        `SELECT o.status, COUNT(*)::int AS count FROM orders o WHERE ${scope.join(' AND ')} GROUP BY o.status`,
        scopeParams
      ),
      sql.query(
        `SELECT COUNT(*)::int AS total FROM orders o JOIN outlets ol ON ol.outlet_id = o.outlet_id WHERE ${whereSql}`,
        params
      ),
      sql.query(
        `${ORDER_LIST_SELECT}
         WHERE ${whereSql}
         ORDER BY o.created_at DESC, o.order_id DESC
         LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
        params
      ),
      sql.query(
        `SELECT DISTINCT target_delivery_date AS date FROM orders
         WHERE status <> 'draft' ORDER BY target_delivery_date DESC LIMIT 21`
      ),
      // Orders that need a dispatcher decision: repeat deferrals first (the same outlet must not be
      // skipped run after run), then exceptions, then urgent orders not yet planned.
      sql.query(
        `${ORDER_LIST_SELECT}
         WHERE ${scope.join(' AND ')}
           AND (o.status IN ('deferred', 'shortfall', 'failed', 'disputed')
                OR (o.priority = 'urgent' AND o.status IN ('submitted', 'confirmed')))
         ORDER BY CASE WHEN o.status = 'deferred' THEN 0
                       WHEN o.status IN ('shortfall', 'failed', 'disputed') THEN 1 ELSE 2 END,
                  d.consecutive_deferral_count DESC NULLS LAST, o.target_delivery_date
         LIMIT 5`,
        scopeParams
      ),
    ])

    const byStatus = Object.fromEntries(statsRows.map((r) => [r.status, r.count]))
    const sumOf = (list) => list.reduce((n, s) => n + (byStatus[s] || 0), 0)
    const stats = {
      total: statsRows.reduce((n, r) => n + (r.status === 'cancelled' ? 0 : r.count), 0),
      awaiting_cutoff: byStatus.submitted || 0,
      pending: sumOf(STATUS_GROUPS.pending),
      planned: sumOf(STATUS_GROUPS.planned),
      loading: sumOf(STATUS_GROUPS.loading),
      deferred: sumOf(STATUS_GROUPS.deferred),
      in_transit: sumOf(STATUS_GROUPS.in_transit),
      completed: sumOf(STATUS_GROUPS.completed),
      exception: sumOf(STATUS_GROUPS.exception),
    }

    res.json({
      orders,
      attention,
      stats,
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
      facets: { dates: dates.map((d) => d.date) },
    })
  } catch (err) {
    sendError(res, err, 'Failed to load orders')
  }
})

// GET /api/orders/intake — intake state for the next few delivery dates.
router.get('/intake', requireRole(...PLANNING_ROLES), async (req, res) => {
  try {
    const today = toColomboParts(now()).date
    const [, upcoming] = await Promise.all([
      ensureOrdersConfirmed(sql),
      sql.query(
        `SELECT c.date FROM operating_calendar c
         WHERE c.date > $1 AND c.is_operating = true ORDER BY c.date LIMIT 3`,
        [today]
      ),
    ])
    // Calendar may not cover the horizon; fall back to the next Mon–Sat days.
    const dates = upcoming.map((r) => r.date)
    for (let d = addDays(today, 1); dates.length < 3; d = addDays(d, 1)) {
      if (!dates.includes(d) && new Date(`${d}T00:00:00Z`).getUTCDay() !== 0) dates.push(d)
    }

    const picked = dates.slice(0, 3)
    const [statuses, countRows] = await Promise.all([
      Promise.all(picked.map((date) => intakeStatus(sql, date))),
      sql.query(
        `SELECT target_delivery_date AS date,
                COUNT(*) FILTER (WHERE status = 'submitted')::int AS submitted,
                COUNT(*) FILTER (WHERE status = 'confirmed')::int AS confirmed
         FROM orders WHERE target_delivery_date = ANY($1::date[]) GROUP BY target_delivery_date`,
        [picked]
      ),
    ])
    const countsByDate = new Map(countRows.map(({ date, ...counts }) => [date, counts]))
    const result = picked.map((date, i) => ({
      date,
      open: statuses[i].open,
      closed_by_dispatcher: statuses[i].closed,
      cutoff_at: statuses[i].cutoffAt,
      ...(countsByDate.get(date) || { submitted: 0, confirmed: 0 }),
    }))
    res.json({ dates: result })
  } catch (err) {
    sendError(res, err, 'Failed to load intake status')
  }
})

// POST /api/orders/intake/close — dispatcher closes intake for a date and confirms its orders.
router.post('/intake/close', requireRole(...PLANNING_ROLES), async (req, res) => {
  const deliveryDate = req.body?.delivery_date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate || '')) {
    return res.status(400).json({ error: 'delivery_date (YYYY-MM-DD) is required.' })
  }
  try {
    const confirmed = await withTransaction(async (tx) => {
      const [{ count }] = await tx.query(
        `SELECT COUNT(*)::int AS count FROM orders WHERE target_delivery_date = $1 AND status = 'submitted'`,
        [deliveryDate]
      )
      await tx.query(
        `INSERT INTO order_intake_closures (delivery_date, closed_by_user_id)
         VALUES ($1, $2) ON CONFLICT (delivery_date) DO NOTHING`,
        [deliveryDate, req.user.userId]
      )
      // Also confirms any other orders whose cutoff has passed.
      await confirmDueOrders(tx)
      await tx.query(
        `UPDATE order_intake_closures SET confirmed_order_count = confirmed_order_count + $2 WHERE delivery_date = $1`,
        [deliveryDate, count]
      )
      return count
    })
    invalidateConfirmCache()
    res.json({
      success: true,
      confirmed,
      message: `Order intake closed for ${deliveryDate}. ${confirmed} order(s) confirmed and ready for planning.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to close order intake')
  }
})

// PATCH /api/orders/priority — mark orders urgent / normal.
router.patch('/priority', requireRole(...PLANNING_ROLES), async (req, res) => {
  const { order_ids: orderIds, priority } = req.body || {}
  if (!Array.isArray(orderIds) || orderIds.length === 0) return res.status(400).json({ error: 'Select at least one order.' })
  if (!['urgent', 'normal'].includes(priority)) return res.status(400).json({ error: "Priority must be 'urgent' or 'normal'." })

  try {
    const updated = await withTransaction(async (tx) => {
      const rows = await tx.query(
        `UPDATE orders SET priority = $1, updated_at = NOW()
         WHERE order_id = ANY($2) AND status NOT IN ('draft','cancelled','received') AND priority <> $1
         RETURNING order_id, status`,
        [priority, orderIds]
      )
      await recordEvents(tx, rows.map((r) => ({ orderId: r.order_id, from: r.status, to: r.status, actor: actorOf(req), note: `Priority set to ${priority}` })))
      return rows.length
    })
    res.json({ success: true, updated, message: `${updated} order(s) marked ${priority}.` })
  } catch (err) {
    sendError(res, err, 'Failed to update priority')
  }
})

// POST /api/orders/defer — move orders to a later run with a recorded reason.
// Orders already placed on a trip are removed from the plan in the Delivery Planner instead.
router.post('/defer', requireRole(...PLANNING_ROLES), async (req, res) => {
  const { order_ids: orderIds, reason, explanation } = req.body || {}
  if (!Array.isArray(orderIds) || orderIds.length === 0) return res.status(400).json({ error: 'Select at least one order.' })
  if (!DEFERRAL_REASONS[reason]) {
    return res.status(400).json({ error: 'Choose a deferral reason.', reasons: DEFERRAL_REASONS })
  }

  try {
    const results = await withTransaction(async (tx) => {
      const out = []
      const ids = [...new Set(orderIds)]
      const locked = await tx.query(
        `SELECT o.order_id, o.outlet_id, o.status, o.target_delivery_date,
                (SELECT COUNT(*)::int FROM trip_stops ts WHERE ts.order_id = o.order_id) AS on_trip,
                (SELECT COUNT(*)::int FROM order_deferrals od WHERE od.order_id = o.order_id) AS prior,
                (SELECT MAX(next_scheduled_date) FROM order_deferrals od WHERE od.order_id = o.order_id) AS last_next
         FROM orders o WHERE o.order_id = ANY($1) ORDER BY o.order_id FOR UPDATE`,
        [ids]
      )
      const byId = new Map(locked.map((o) => [o.order_id, o]))
      const deferrals = []
      const notes = new Map()
      for (const orderId of ids) {
        const order = byId.get(orderId)
        if (!order) throw httpError(404, `Order ${orderId} not found.`)
        if (order.status === 'submitted') {
          throw httpError(409, `${orderId} is still awaiting the order cutoff. Close intake for its date first.`)
        }
        if (order.on_trip > 0) {
          throw httpError(409, `${orderId} is already on a trip. Remove it from the plan in the Delivery Planner.`)
        }
        assertTransition(orderId, order.status, 'deferred')

        const planningDate = order.last_next && order.last_next > order.target_delivery_date ? order.last_next : order.target_delivery_date
        let nextDate = addDays(planningDate, 1)
        if (new Date(`${nextDate}T00:00:00Z`).getUTCDay() === 0) nextDate = addDays(nextDate, 1)
        const count = order.prior + 1
        const text = explanation?.trim() || DEFERRAL_REASONS[reason]

        deferrals.push({ orderId, outletId: order.outlet_id, planningDate, count, nextDate })
        notes.set(orderId, `${DEFERRAL_REASONS[reason]} — moved to ${nextDate}. ${text !== DEFERRAL_REASONS[reason] ? text : ''}`.trim())
        out.push({ order_id: orderId, next_scheduled_date: nextDate, consecutive_deferral_count: count })
      }
      const text = explanation?.trim() || DEFERRAL_REASONS[reason]
      await tx.query(
        `INSERT INTO order_deferrals (order_id, outlet_id, planning_date, deferral_reason, explanation,
           consecutive_deferral_count, next_scheduled_date, decided_by_user_id)
         SELECT d.order_id, d.outlet_id, d.planning_date, $5, $6, d.count, d.next_date, $7
         FROM unnest($1::text[], $2::text[], $3::date[], $4::int[], $8::date[])
              WITH ORDINALITY AS d(order_id, outlet_id, planning_date, count, next_date, n)
         ORDER BY d.n`,
        [deferrals.map((d) => d.orderId), deferrals.map((d) => d.outletId), deferrals.map((d) => d.planningDate),
          deferrals.map((d) => d.count), reason, text, req.user.userId, deferrals.map((d) => d.nextDate)]
      )
      await transitionOrders(tx, ids, 'deferred', actorOf(req), (id) => notes.get(id))
      return out
    })
    const repeat = results.filter((r) => r.consecutive_deferral_count > 1).length
    res.json({
      success: true,
      deferred: results,
      message: `${results.length} order(s) deferred.${repeat ? ` ${repeat} of them had already been deferred before — prioritise them on the next run.` : ''}`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to defer orders')
  }
})

// ---------- Shared ----------

// POST /api/orders/:id/cancel — store managers withdraw their own unconfirmed orders;
// dispatchers may cancel confirmed or deferred orders with a reason.
router.post('/:id/cancel', requireRole(STORE_MANAGER, ...PLANNING_ROLES), async (req, res) => {
  const orderId = req.params.id
  const reason = req.body?.reason?.trim()
  try {
    const ctx = isRole(req, STORE_MANAGER) ? await loadStoreContext(req.user.userId) : null
    await withTransaction(async (tx) => {
      const [order] = await tx.query('SELECT order_id, outlet_id, status FROM orders WHERE order_id = $1 FOR UPDATE', [orderId])
      if (!order) throw httpError(404, `Order ${orderId} not found.`)

      if (ctx) {
        if (order.outlet_id !== ctx.outlet_id) throw httpError(403, 'You can only cancel orders for your own outlet.')
        if (!STORE_CANCELLABLE_STATUSES.includes(order.status)) {
          throw httpError(409, 'This order has passed the cutoff and is with the dispatcher. Contact dispatch to change it.')
        }
      } else if (!reason) {
        throw httpError(400, 'A cancellation reason is required.')
      }
      await transitionOrder(tx, orderId, 'cancelled', actorOf(req), reason || 'Withdrawn by store manager')
    })
    res.json({ success: true, message: `Order ${orderId} cancelled.` })
  } catch (err) {
    sendError(res, err, 'Failed to cancel order')
  }
})

// GET /api/orders/:id — full order record with items, outlet, plan and activity trail.
router.get('/:id', requireRole(STORE_MANAGER, ...PLANNING_ROLES), async (req, res) => {
  const orderId = req.params.id
  try {
    const isStore = isRole(req, STORE_MANAGER)
    await ensureOrdersConfirmed(sql)

    // Every query keys on the order id, so the order row, the outlet check and the details are
    // fetched concurrently; nothing is sent until the order is found and the caller may see it.
    const [[order], ctx, [outlet], items, events, deferrals, [plan], [creator], related, [delivery], [receipt], [loading], issues, tripProgress, [trip]] = await Promise.all([
      sql.query(`${ORDER_LIST_SELECT} WHERE o.order_id = $1`, [orderId]),
      isStore ? loadStoreContext(req.user.userId) : null,
      sql.query(
        `SELECT o.*, u.full_name AS manager_name, u.phone AS manager_phone
         FROM outlets o
         LEFT JOIN LATERAL (
           SELECT full_name, phone FROM users WHERE outlet_id = o.outlet_id AND role = 'Store Manager'
           ORDER BY created_at LIMIT 1
         ) u ON true
         WHERE o.outlet_id = (SELECT outlet_id FROM orders WHERE order_id = $1)`,
        [orderId]
      ),
      sql.query(
        `SELECT item_id, COALESCE(product_code, sku) AS product_code, product_name, COALESCE(unit, 'Case') AS unit,
                temp_requirement, quantity_cases AS quantity,
                weight_per_case_kg AS weight_per_unit, volume_per_case_m3 AS volume_per_unit,
                total_item_weight_kg AS total_weight_kg, total_item_volume_m3 AS total_volume_m3
         FROM order_items WHERE order_id = $1 ORDER BY item_id`,
        [orderId]
      ),
      sql.query(
        `SELECT e.event_id, e.from_status, e.to_status, e.actor_role, e.note, e.created_at, u.full_name AS actor_name
         FROM order_status_events e LEFT JOIN users u ON u.user_id = e.actor_user_id
         WHERE e.order_id = $1 ORDER BY e.created_at, e.event_id`,
        [orderId]
      ),
      sql.query(
        `SELECT d.deferral_reason, d.explanation, d.planning_date, d.next_scheduled_date,
                d.consecutive_deferral_count, d.created_at, u.full_name AS decided_by
         FROM order_deferrals d LEFT JOIN users u ON u.user_id = d.decided_by_user_id
         WHERE d.order_id = $1 ORDER BY d.created_at`,
        [orderId]
      ),
      sql.query(
        `SELECT t.trip_id, t.vehicle_id, t.trip_number, t.status AS trip_status, t.planned_departure_time,
                v.type AS vehicle_type, v.temp AS vehicle_temp, v.weight_cap_kg, v.volume_cap_m3,
                du.full_name AS driver_name, du.phone AS driver_phone, t.dispatched_at, ts.stop_sequence, ts.loading_sequence,
                ts.planned_arrival_time, ts.status AS stop_status
         FROM trip_stops ts
         JOIN trips t ON t.trip_id = ts.trip_id
         JOIN vehicles v ON v.vehicle_id = t.vehicle_id
         LEFT JOIN users du ON du.user_id = COALESCE(t.driver_user_id, (SELECT dv.user_id FROM users dv WHERE dv.assigned_vehicle_id = t.vehicle_id AND dv.role = 'Driver' ORDER BY dv.created_at LIMIT 1))
         WHERE ts.order_id = $1`,
        [orderId]
      ),
      sql.query(
        `SELECT u.full_name, u.role FROM orders o JOIN users u ON u.user_id = o.created_by_user_id WHERE o.order_id = $1`,
        [orderId]
      ),
      sql.query(
        `SELECT order_id, temp_requirement, status FROM orders
         WHERE order_group_id = (SELECT order_group_id FROM orders WHERE order_id = $1) AND order_id <> $1`,
        [orderId]
      ),
      sql.query(
        `SELECT outcome, actual_arrival_time, actual_departure_time, handling_duration_min, is_late, lateness_minutes,
                received_by_name, driver_notes, recorded_offline, synced_at, proof_photo_data AS proof_photo
         FROM delivery_records WHERE order_id = $1`,
        [orderId]
      ),
      sql.query(
        `SELECT r.receipt_status, r.received_cases, r.damaged_cases, r.missing_cases, r.temp_check_celsius,
                r.manager_notes, r.line_details, r.confirmed_at, u.full_name AS confirmed_by
         FROM receipt_confirmations r LEFT JOIN users u ON u.user_id = r.manager_user_id WHERE r.order_id = $1`,
        [orderId]
      ),
      sql.query(
        `SELECT shortfall_flag, shortfall_units, shortfall_reason, issue_type, item_name, notes, verified_at
         FROM loading_verifications WHERE order_id = $1 ORDER BY verified_at DESC LIMIT 1`,
        [orderId]
      ),
      sql.query(
        `SELECT i.issue_id, i.reported_by_role, i.issue_category, i.severity, i.description, i.resolution_status,
                i.resolution_notes, i.reported_at, u.full_name AS reported_by
         FROM operational_issues i LEFT JOIN users u ON u.user_id = i.reported_by_user_id
         WHERE i.related_order_id = $1 ORDER BY i.reported_at DESC`,
        [orderId]
      ),
      // Progress of the trip carrying this order — sequence and status only, no other outlets' details.
      // Both are empty when the order is not on a trip.
      sql.query(
        `SELECT stop_sequence, status, planned_arrival_time, actual_arrival_time, (order_id = $1) AS is_this_order
         FROM trip_stops WHERE trip_id = (SELECT trip_id FROM trip_stops WHERE order_id = $1) ORDER BY stop_sequence`,
        [orderId]
      ),
      sql.query(
        `SELECT status, dispatched_at, completed_at, delivery_date FROM trips
         WHERE trip_id = (SELECT trip_id FROM trip_stops WHERE order_id = $1)`,
        [orderId]
      ),
    ])
    if (!order) return res.status(404).json({ error: `Order ${orderId} not found.` })
    if (isStore && order.outlet_id !== ctx.outlet_id) return res.status(403).json({ error: 'This order belongs to another outlet.' })

    res.json({
      order, outlet, items, events, deferrals, plan: plan || null, created_by: creator || null, related_orders: related,
      loading: loading || null, delivery: delivery || null, receipt: receipt || null, trip: trip || null, trip_progress: tripProgress, issues,
    })
  } catch (err) {
    sendError(res, err, 'Failed to load order')
  }
})

// POST /api/orders/:id/confirm-receipt — store manager counts what arrived and signs off.
// Body: { lines: [{ item_id, delivered_qty, condition: 'good' | 'damaged' | 'missing' }], temp_check_celsius?, notes? }
// Shortages or damage put the order in 'disputed' and raise an issue for dispatch; otherwise 'received'.
router.post('/:id/confirm-receipt', requireRole(STORE_MANAGER), async (req, res) => {
  const orderId = req.params.id
  const { lines, temp_check_celsius: tempRaw, notes } = req.body || {}
  if (!Array.isArray(lines) || lines.length === 0) return res.status(400).json({ error: 'Count every line before signing off.' })

  try {
    const ctx = await loadStoreContext(req.user.userId)
    const temp = tempRaw === undefined || tempRaw === null || tempRaw === '' ? null : Number(tempRaw)
    if (temp !== null && (!Number.isFinite(temp) || temp < -30 || temp > 40)) throw httpError(400, 'Enter a realistic temperature in °C, or leave it blank.')

    const result = await withTransaction(async (tx) => {
      const [order] = await tx.query('SELECT order_id, outlet_id, status FROM orders WHERE order_id = $1 FOR UPDATE', [orderId])
      if (!order) throw httpError(404, `Order ${orderId} not found.`)
      if (order.outlet_id !== ctx.outlet_id) throw httpError(403, 'You can only confirm receipts for your own outlet.')
      const [existing] = await tx.query('SELECT 1 FROM receipt_confirmations WHERE order_id = $1', [orderId])
      if (existing || ['received', 'disputed'].includes(order.status)) throw httpError(409, `Receipt for ${orderId} is already confirmed.`)
      if (!['delivered', 'partial'].includes(order.status)) {
        throw httpError(409, `${orderId} has not been delivered yet (status: ${order.status}). Confirm receipt after the driver records the delivery.`)
      }

      const items = await tx.query('SELECT item_id, product_name, quantity_cases FROM order_items WHERE order_id = $1', [orderId])
      const byId = new Map(items.map((i) => [String(i.item_id), i]))
      let received = 0
      let damaged = 0
      let missing = 0
      const details = []
      for (const line of lines) {
        const item = byId.get(String(line.item_id))
        if (!item) throw httpError(400, `Item ${line.item_id} is not on ${orderId}.`)
        const ordered = item.quantity_cases
        const condition = ['good', 'damaged', 'missing'].includes(String(line.condition).toLowerCase()) ? String(line.condition).toLowerCase() : 'good'
        const delivered = condition === 'missing' ? 0 : Math.max(0, Math.min(ordered, Math.floor(Number(line.delivered_qty) || 0)))
        const lineDamaged = condition === 'damaged' ? delivered : 0
        received += delivered
        damaged += lineDamaged
        missing += ordered - delivered
        details.push({ item_id: item.item_id, product: item.product_name, ordered, delivered, damaged: lineDamaged, missing: ordered - delivered })
      }
      if (details.length !== items.length) throw httpError(400, 'Include every line of the order in the count.')

      const disputed = damaged > 0 || missing > 0
      const summary = `${received} received, ${damaged} damaged, ${missing} missing${temp !== null ? `, ${temp}°C at receipt` : ''}`
      await tx.query(
        `INSERT INTO receipt_confirmations (order_id, outlet_id, manager_user_id, receipt_status, received_cases,
           damaged_cases, missing_cases, temp_check_celsius, manager_notes, line_details, confirmed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())`,
        [orderId, order.outlet_id, req.user.userId, disputed ? 'accepted_with_issues' : 'accepted_in_full',
          received, damaged, missing, temp, notes?.trim() || null, JSON.stringify(details)]
      )
      await transitionOrder(tx, orderId, disputed ? 'disputed' : 'received', actorOf(req),
        `Receipt confirmed: ${summary}.${notes?.trim() ? ` ${notes.trim()}` : ''}`)

      if (disputed) {
        const [stop] = await tx.query('SELECT trip_id FROM trip_stops WHERE order_id = $1', [orderId])
        const lineText = details.filter((d) => d.damaged || d.missing)
          .map((d) => `${d.product}: ${d.missing ? `${d.missing} missing` : ''}${d.missing && d.damaged ? ', ' : ''}${d.damaged ? `${d.damaged} damaged` : ''}`)
          .join('; ')
        await tx.query(
          `INSERT INTO operational_issues (reported_by_role, reported_by_user_id, related_order_id, related_trip_id, outlet_id,
             issue_category, severity, impact, description)
           VALUES ('Store Manager', $1, $2, $3, $4, $5, $6, 'receipt', $7)`,
          [req.user.userId, orderId, stop?.trip_id || null, order.outlet_id,
            damaged > 0 ? 'receipt: damaged goods' : 'receipt: short delivery', damaged + missing > 10 ? 'high' : 'medium',
            `Receipt discrepancy — ${lineText}.${notes?.trim() ? ` ${notes.trim()}` : ''}`]
        )
      }
      return { status: disputed ? 'disputed' : 'received', received, damaged, missing }
    })

    res.json({
      success: true,
      ...result,
      message: result.status === 'received'
        ? `Receipt for ${orderId} confirmed in full.`
        : `Receipt for ${orderId} confirmed with ${result.missing} missing and ${result.damaged} damaged. Dispatch has been notified.`,
    })
  } catch (err) {
    sendError(res, err, 'Failed to confirm receipt')
  }
})

// Matches the categories on the store manager's Report Issue screen.
const ISSUE_CATEGORIES = ['missing-item', 'damaged-cargo', 'incorrect-item', 'quantity-count', 'delivery-delay', 'other-exception']

// POST /api/orders/:id/issues — store manager reports a problem with an order.
router.post('/:id/issues', requireRole(STORE_MANAGER, ...PLANNING_ROLES), async (req, res) => {
  const orderId = req.params.id
  const { category, description, item_id: itemId, affected_qty: affectedQty, photo } = req.body || {}
  if (!ISSUE_CATEGORIES.includes(category)) return res.status(400).json({ error: 'Choose an issue category.' })
  if (!description?.trim()) return res.status(400).json({ error: 'Describe the issue so dispatch can act on it.' })

  try {
    const ctx = isRole(req, STORE_MANAGER) ? await loadStoreContext(req.user.userId) : null
    const issue = await withTransaction(async (tx) => {
      const [order] = await tx.query('SELECT order_id, outlet_id, status FROM orders WHERE order_id = $1', [orderId])
      if (!order) throw httpError(404, `Order ${orderId} not found.`)
      if (ctx && order.outlet_id !== ctx.outlet_id) throw httpError(403, 'You can only report issues for your own outlet.')

      let itemText = ''
      if (itemId) {
        const [item] = await tx.query('SELECT product_name, quantity_cases FROM order_items WHERE order_id = $1 AND item_id = $2', [orderId, itemId])
        if (!item) throw httpError(400, `That item is not on ${orderId}.`)
        const qty = Math.max(0, Math.min(item.quantity_cases, Math.floor(Number(affectedQty) || 0)))
        itemText = `${item.product_name}${qty ? ` — ${qty} of ${item.quantity_cases} affected` : ''}. `
      }
      const [stop] = await tx.query('SELECT trip_id FROM trip_stops WHERE order_id = $1', [orderId])
      const [row] = await tx.query(
        `INSERT INTO operational_issues (reported_by_role, reported_by_user_id, related_order_id, related_trip_id, outlet_id,
           issue_category, severity, impact, description, photo_data)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'store',$8,$9) RETURNING issue_id, reported_at`,
        [req.user.role, req.user.userId, orderId, stop?.trip_id || null, order.outlet_id, `store: ${category}`,
          category === 'damaged-cargo' ? 'high' : 'medium', `${itemText}${description.trim()}`, photo || null]
      )
      await recordEvent(tx, {
        orderId, from: order.status, to: order.status, actor: actorOf(req),
        note: `Issue #${row.issue_id} reported (${category}): ${description.trim().slice(0, 120)}`,
      })
      return row
    })
    res.status(201).json({ success: true, issue_id: issue.issue_id, reported_at: issue.reported_at, message: `Issue #${issue.issue_id} sent to dispatch.` })
  } catch (err) {
    sendError(res, err, 'Failed to report issue')
  }
})

module.exports = router

