export default function ConfirmSuccessModal({ orderId, storeName, managerName, result, onClose, onGoToDashboard, onViewOrderHistory }) {
  const inFull = result.status === 'received'

  return (
    <div className="cr-modal-overlay" onClick={onClose}>
      <div className="cr-modal-container" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="cr-modal-icon-bubble">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={inFull ? '#10b981' : '#f59e0b'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="cr-modal-title">{inFull ? 'Receipt Confirmed' : 'Receipt Confirmed with Issues'}</h2>
        <p className="cr-modal-subtitle">{result.message}</p>

        <div className="cr-modal-cert-card">
          <div className="cr-cert-row">
            <span className="cr-cert-label">Order</span>
            <span className="cr-cert-val">{orderId}</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Outlet</span>
            <span className="cr-cert-val">{storeName}</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Signed off by</span>
            <span className="cr-cert-val">{managerName || 'Store Manager'}</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Received</span>
            <span className="cr-cert-val"><strong>{result.received} units</strong></span>
          </div>
          {!inFull && (
            <div className="cr-cert-row">
              <span className="cr-cert-label">Raised with dispatch</span>
              <span className="cr-cert-val">{result.missing} missing • {result.damaged} damaged</span>
            </div>
          )}
        </div>

        <div className="cr-modal-actions">
          <button type="button" className="btn-cr-modal-primary" onClick={onGoToDashboard}>
            <span>Return to Dashboard</span>
          </button>
          <button type="button" className="btn-cr-modal-secondary" onClick={onViewOrderHistory}>
            <span>View in Order History</span>
          </button>
        </div>
      </div>
    </div>
  )
}
