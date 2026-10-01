export default function ReportIssueSuccessModal({
  orderId = 'ORD-1042',
  ticketId = 'ISSUE-2026-0941',
  categoryLabel = 'Missing Item',
  skuName = 'Fresh Farm Milk 1L',
  onClose,
  onGoToDashboard,
  onGoToOrders,
}) {
  return (
    <div className="ri-modal-overlay" onClick={onClose}>
      <div className="ri-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Success / Warning Check Icon */}
        <div className="ri-modal-icon-bubble">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>

        <h2 className="ri-modal-title">Discrepancy Report Logged</h2>
        <p className="ri-modal-subtitle">
          Your exception report for order <strong className="val-blue">{orderId}</strong> has been transmitted to Central Dispatch &amp; Warehouse Inventory Control.
        </p>

        {/* Ticket Details */}
        <div className="ri-modal-ticket-card">
          <div className="ri-ticket-row">
            <span className="ri-ticket-label">Incident Reference</span>
            <span className="ri-ticket-val ticket-code">{ticketId}</span>
          </div>
          <div className="ri-ticket-row">
            <span className="ri-ticket-label">Discrepancy Category</span>
            <span className="ri-ticket-val">{categoryLabel}</span>
          </div>
          <div className="ri-ticket-row">
            <span className="ri-ticket-label">Affected Item</span>
            <span className="ri-ticket-val">{skuName}</span>
          </div>
          <div className="ri-ticket-row">
            <span className="ri-ticket-label">Estimated SLA</span>
            <span className="ri-ticket-val" style={{ color: '#059669', fontWeight: 700 }}>
              Resolution within 24h (Store Credit / Re-dispatch)
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="ri-modal-actions">
          <button
            type="button"
            className="btn-ri-modal-primary"
            onClick={onGoToDashboard}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Return to Dashboard</span>
          </button>

          <button
            type="button"
            className="btn-ri-modal-secondary"
            onClick={onGoToOrders}
          >
            <span>View All Orders</span>
          </button>
        </div>
      </div>
    </div>
  )
}
