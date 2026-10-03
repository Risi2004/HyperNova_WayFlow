export default function OrderHistoryDetailsModal({
  order,
  isOpen,
  onClose,
  onReportIssue,
}) {
  if (!isOpen || !order) return null

  return (
    <div className="oh-modal-backdrop" onClick={onClose}>
      <div className="oh-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="oh-modal-header">
          <div className="oh-modal-title-wrap">
            <span className="oh-modal-code">{order.id}</span>
            <span className={`oh-modal-status-badge ${order.status.toLowerCase()}`}>
              {order.status}
            </span>
            <span className={`oh-modal-type-badge ${order.deliveryType.toLowerCase()}`}>
              {order.deliveryType}
            </span>
          </div>

          <button type="button" className="btn-oh-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="oh-modal-body">
          {/* Metadata Grid */}
          <div className="oh-modal-grid">
            <div className="oh-modal-info-item">
              <span className="info-label">Order Placed Date</span>
              <span className="info-val">{order.orderDate}</span>
            </div>
            <div className="oh-modal-info-item">
              <span className="info-label">Delivered / Arrival Date</span>
              <span className="info-val">{order.deliveryDate}</span>
            </div>
            <div className="oh-modal-info-item">
              <span className="info-label">Items &amp; Volume</span>
              <span className="info-val">{order.itemsVolume}</span>
            </div>
            <div className="oh-modal-info-item">
              <span className="info-label">Receipt Sign-Off</span>
              <span className={`info-val ${order.receiptStatus === 'Confirmed' ? 'text-blue' : 'text-grey'}`}>
                {order.receiptStatus === 'Confirmed' ? '✓ Verified & Confirmed' : 'Not Confirmed'}
              </span>
            </div>
            <div className="oh-modal-info-item">
              <span className="info-label">Assigned Dock</span>
              <span className="info-val">Bay 02 Dock Ramp</span>
            </div>
            <div className="oh-modal-info-item">
              <span className="info-label">Carrier &amp; Driver</span>
              <span className="info-val">{order.tripId ? `${order.tripId} • ${order.driverName || 'Driver not recorded'}` : 'Not dispatched'}</span>
            </div>
          </div>

          {/* e-POD Section if confirmed */}
          {order.receiptStatus === 'Confirmed' && (
            <div className="oh-modal-epod-box">
              <div className="oh-epod-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="oh-epod-title">Certified Electronic Proof of Delivery (e-POD)</span>
              </div>
              <p className="oh-epod-sub">
                Received by {order.receivedBy || 'outlet staff'} for {order.outletId}.
                {order.receivedAtLabel && <> Confirmed {order.receivedAtLabel}.</>}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="oh-modal-footer">
          <div className="oh-footer-left">
            <button
              type="button"
              className="btn-oh-modal-secondary"
              onClick={() => onReportIssue && onReportIssue(order.id)}
            >
              Report Discrepancy
            </button>
          </div>

          <div className="oh-footer-right">
            <button
              type="button"
              className="btn-oh-modal-download"
              onClick={() => window.print()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Receipt</span>
            </button>

            <button
              type="button"
              className="btn-oh-modal-close-main"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
