import { useEffect, useState } from 'react'
import { orderService } from '../../../services/orderService'
import { productCategory } from '../../../utils/orderFormat'

const RECEIPT_LABELS = {
  accepted_in_full: 'Accepted in full',
  accepted_with_issues: 'Accepted with issues',
  rejected: 'Rejected',
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onWithdraw,
  isReceiptMode = false,
}) {
  // Fetched detail is stored with the order id it belongs to, so switching orders never
  // shows the previous order's manifest.
  const [fetched, setFetched] = useState({ id: null, detail: null, error: null })
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const orderId = order?.id

  useEffect(() => {
    if (!isOpen || !orderId) return
    let active = true
    orderService
      .getOrder(orderId)
      .then((res) => active && setFetched({ id: orderId, detail: res, error: null }))
      .catch((err) => active && setFetched({ id: orderId, detail: null, error: err.message }))
    return () => {
      active = false
    }
  }, [isOpen, orderId])

  if (!isOpen || !order) return null

  const detail = fetched.id === order.id ? fetched.detail : null
  const loadError = fetched.id === order.id ? fetched.error : null

  const lastEvent = detail?.events?.[detail.events.length - 1]

  return (
    <div className="mo-modal-backdrop" onClick={onClose}>
      <div className="mo-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mo-modal-header">
          <div className="mo-modal-title-wrap">
            <span className="mo-modal-code">{order.id}</span>
            <span className={`mo-modal-status-badge ${order.status.toLowerCase()}`}>
              {order.status.replace('_', ' ')}
            </span>
            {order.priority && (
              <span className={`mo-modal-priority-pill ${order.priority.toLowerCase()}`}>
                {order.priority}
              </span>
            )}
          </div>
          <button type="button" className="btn-mo-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="mo-modal-body">
          {/* Summary grid */}
          <div className="mo-modal-info-grid">
            <div className="mo-modal-info-item">
              <span className="info-label">Assigned Hub / Route</span>
              <span className="info-val">{order.hubOrRoute}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Placed Timestamp</span>
              <span className="info-val">{order.placedDate} at {order.placedTime}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Requested Delivery</span>
              <span className="info-val">{order.requestedDate}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Delivery Window</span>
              <span className="info-val">{order.deliveryWindow}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Items &amp; Weight</span>
              <span className="info-val">{order.itemCount} items — {order.weightKg} kg</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">SKUs Composition</span>
              <span className="info-val">{order.skusSummary}</span>
            </div>
          </div>

          {/* If receipt mode */}
          {isReceiptMode && (
            <div className="mo-receipt-section">
              <div className="mo-receipt-box">
                <div className="mo-receipt-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h4>Electronic Proof of Delivery (e-POD)</h4>
                </div>
                <div className="mo-receipt-details">
                  <p><strong>Store:</strong> {order.outletLabel}</p>
                  <p><strong>Signed by:</strong> {order.receivedBy || 'Not yet signed'}</p>
                  <p><strong>Receipt Status:</strong> {RECEIPT_LABELS[order.receiptStatus] || 'Awaiting store confirmation'}</p>
                  {detail?.plan && <p><strong>Delivered by:</strong> {detail.plan.driver_name} • {detail.plan.vehicle_id} ({detail.plan.trip_id})</p>}
                </div>
              </div>
            </div>
          )}

          {/* Order Manifest items preview */}
          <div className="mo-modal-manifest-section">
            <h4 className="mo-manifest-heading">Order Manifest</h4>
            <div className="mo-manifest-list">
              {!detail && !loadError && <div className="mo-manifest-item"><span>Loading items…</span></div>}
              {loadError && <div className="mo-manifest-item"><span>{loadError}</span></div>}
              {detail?.items.map((item) => {
                const category = productCategory(item)
                return (
                  <div key={item.item_id} className="mo-manifest-item">
                    <span>{item.product_name} ({item.quantity} × {item.unit || 'unit'})</span>
                    <span className={`manifest-cat ${category.type === 'ambient' ? '' : category.type}`}>{category.label}</span>
                  </div>
                )
              })}
            </div>
            {detail?.related_orders?.length > 0 && (
              <p className="mo-modal-related-note">
                Placed together with {detail.related_orders.map((r) => `${r.order_id} (${r.temp_requirement})`).join(', ')}.
              </p>
            )}
            {lastEvent?.note && (
              <p className="mo-modal-related-note">Latest update: {lastEvent.note}</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mo-modal-footer">
          <button type="button" className="btn-mo-modal-secondary" onClick={onClose}>
            Close
          </button>
          {order.status === 'PENDING' && onWithdraw && (
            <button
              type="button"
              className="btn-mo-modal-secondary btn-mo-withdraw"
              disabled={isWithdrawing}
              onClick={async () => {
                setIsWithdrawing(true)
                await onWithdraw(order)
                setIsWithdrawing(false)
              }}
            >
              {isWithdrawing ? 'Withdrawing…' : 'Withdraw Order'}
            </button>
          )}
          <button
            type="button"
            className="btn-mo-modal-primary"
            onClick={() => {
              window.print()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Manifest</span>
          </button>
        </div>
      </div>
    </div>
  )
}
