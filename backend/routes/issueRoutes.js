const express = require('express')
const { sql, withTransaction } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const { transitionOrder, recordEvent } = require('../services/orderStatus')

// Operational issues raised by drivers (on the road) and store managers (at receipt),
// worked through by dispatch. Resolving a receipt dispute can close the order as received.

const router = express.Router()
router.use(verifyToken)

const DISPATCH = ['Dispatcher', 'Admin']
const STATUSES = ['open', 'in_progress', 'resolved']

const actorOf = (req) => ({ userId: req.user.userId, role: req.user.role })

function httpError(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

function sendError(res, err, fallback) {
  if (err.status) return res.status(err.status).json({ error: err.message })
  console.error(`${fallback}:`, err)
  res.status(500).json({ error: fallback })
}

// GET /api/issues?status=open|in_progress|resolved|all&date=YYYY-MM-DD
router.get('/', requireRole(...DISPATCH), async (req, res) => {
  const status = req.query.status || 'unresolved'
  const date = req.query.date || null
  try {
    const issues = await sql.query(
      `SELECT i.issue_id, i.reported_by_role, i.issue_category, i.severity, i.impact, i.description,
              i.resolution_status, i.resolution_notes, i.reported_at, (i.photo_data IS NOT NULL) AS has_photo,
              i.related_order_id AS order_id, i.related_trip_id AS trip_id, i.outlet_id,
              u.full_name AS reported_by, o.status AS order_status, ol.district, ol.brand,
              t.vehicle_id, t.delivery_date
       FROM operational_issues i
       LEFT JOIN users u ON u.user_id = i.reported_by_user_id
       LEFT JOIN orders o ON o.order_id = i.related_order_id
       LEFT JOIN outlets ol ON ol.outlet_id = i.outlet_id
       LEFT JOIN trips t ON t.trip_id = i.related_trip_id
       WHERE ($1 = 'all' OR ($1 = 'unresolved' AND i.resolution_status <> 'resolved') OR i.resolution_status = $1)
         AND ($2::date IS NULL OR t.delivery_date = $2::date OR o.target_delivery_date = $2::date)
       ORDER BY (i.resolution_status = 'resolved'), CASE i.severity WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,
                i.reported_at DESC
       LIMIT 200`,
      [status, date]
    )
    res.json({ issues })
  } catch (err) {
    sendError(res, err, 'Failed to load issues')
  }
})

// GET /api/issues/:id/photo — the attached photo (kept out of the list to keep it light).
router.get('/:id/photo', requireRole(...DISPATCH), async (req, res) => {
  try {
    const [row] = await sql.query('SELECT photo_data FROM operational_issues WHERE issue_id = $1', [req.params.id])
    if (!row?.photo_data) return res.status(404).json({ error: 'No photo on this issue.' })
    res.json({ photo: row.photo_data })
  } catch (err) {
    sendError(res, err, 'Failed to load photo')
  }
})

// PATCH /api/issues/:id — { status: 'in_progress' | 'resolved', resolution_notes, close_dispute? }
router.patch('/:id', requireRole(...DISPATCH), async (req, res) => {
  const { status, resolution_notes: notes, close_dispute: closeDispute } = req.body || {}
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Choose a valid issue status.' })
  if (status === 'resolved' && !notes?.trim()) return res.status(400).json({ error: 'Say how the issue was resolved.' })

  try {
    const result = await withTransaction(async (tx) => {
      const [issue] = await tx.query('SELECT issue_id, related_order_id, resolution_status FROM operational_issues WHERE issue_id = $1 FOR UPDATE', [req.params.id])
      if (!issue) throw httpError(404, `Issue #${req.params.id} not found.`)
      const [row] = await tx.query(
        `UPDATE operational_issues SET resolution_status = $2, resolution_notes = COALESCE($3, resolution_notes)
         WHERE issue_id = $1 RETURNING issue_id, resolution_status, resolution_notes`,
        [issue.issue_id, status, notes?.trim() || null]
      )

      let orderStatus = null
      if (issue.related_order_id) {
        const [order] = await tx.query('SELECT status FROM orders WHERE order_id = $1', [issue.related_order_id])
        orderStatus = order?.status || null
        if (status === 'resolved' && closeDispute && orderStatus === 'disputed') {
          await transitionOrder(tx, issue.related_order_id, 'received', actorOf(req), `Dispute closed with issue #${issue.issue_id}: ${notes.trim()}`)
          orderStatus = 'received'
        } else if (status !== issue.resolution_status) {
          await recordEvent(tx, {
            orderId: issue.related_order_id, from: orderStatus, to: orderStatus, actor: actorOf(req),
            note: `Issue #${issue.issue_id} ${status === 'resolved' ? `resolved: ${notes.trim()}` : 'picked up by dispatch'}`,
          })
        }
      }
      return { ...row, order_status: orderStatus }
    })
    res.json({ success: true, issue: result })
  } catch (err) {
    sendError(res, err, 'Failed to update issue')
  }
})

module.exports = router
