import { formatDate, formatWindow, outletLabel } from '../../../utils/orderFormat'

export default function OrderSummaryCard({ order, statusLabel, createdBy, createdAt, steps = [] }) {
  const orderId = order.order_id

  return (
    <div className="order-details-card summary-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Order Summary</h2>
        <span className="details-card-subtitle">Core order details and current fulfillment stage</span>
      </div>

      {/* Info Grid */}
      <div className="summary-info-grid">
        <div className="info-cell">
          <span className="info-label">Order ID</span>
          <span className="info-value value-id">{orderId}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Order Status</span>
          <span className="info-value value-status">{statusLabel}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Brand</span>
          <span className="info-value">Waypoint {order.brand}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Outlet</span>
          <span className="info-value">{outletLabel(order)}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Order Created</span>
          <span className="info-value">{createdAt}</span>
        </div>

        <div className="info-cell">
          <span className="info-label">Requested Delivery</span>
          <span className="info-value">{formatDate(order.target_delivery_date)}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Delivery Window</span>
          <span className="info-value value-window">{formatWindow(order.requested_window_open, order.requested_window_close)}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Priority</span>
          <span className="info-value value-priority">{order.priority === 'urgent' ? 'Urgent' : 'Normal'}</span>
        </div>
        <div className="info-cell">
          <span className="info-label">Created By</span>
          <span className="info-value">{createdBy ? `${createdBy.full_name} (${createdBy.role})` : '—'}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper-section">
        <span className="stepper-header-label">FULFILLMENT PROGRESS</span>
        <div className="progress-stepper-track">
          {steps.map((step, idx) => (
            <div key={step.label} className={`stepper-node node-${step.state}`}>
              <div className="stepper-circle-wrap">
                {idx > 0 && (
                  <div
                    className={`stepper-line-left ${
                      step.state === 'completed' || step.state === 'current' ? 'line-active' : ''
                    }`}
                  />
                )}
                <div className="stepper-circle">
                  {step.state === 'completed' ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`stepper-line-right ${
                      step.state === 'completed' ? 'line-active' : ''
                    }`}
                  />
                )}
              </div>
              <span className="stepper-label">{step.label}</span>
              {step.subtext && <span className="stepper-subtext">{step.subtext}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
