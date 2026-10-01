export default function ConfirmSuccessModal({
  orderId = 'ORD-1042',
  storeName = 'Colombo 05 Store',
  receivedUnits = 107,
  onClose,
  onGoToDashboard,
  onViewOrderHistory,
}) {
  const receiptTimestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const epodToken = 'EPOD-WF-' + Math.floor(100000 + Math.random() * 900000)

  return (
    <div className="cr-modal-overlay" onClick={onClose}>
      <div className="cr-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="cr-modal-icon-bubble">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 className="cr-modal-title">Receipt Confirmed!</h2>
        <p className="cr-modal-subtitle">
          Delivery for order <strong className="val-blue">{orderId}</strong> has been officially verified, certified, and accepted into {storeName} inventory.
        </p>

        {/* Certificate Card Details */}
        <div className="cr-modal-cert-card">
          <div className="cr-cert-row">
            <span className="cr-cert-label">Electronic POD Token</span>
            <span className="cr-cert-val badge-token">{epodToken}</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Timestamp</span>
            <span className="cr-cert-val">{receiptTimestamp}</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Certified By</span>
            <span className="cr-cert-val">Sarah Perera (Store Manager)</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Total Verified Cargo</span>
            <span className="cr-cert-val"><strong>{receivedUnits} Units</strong> (100% In Good Order)</span>
          </div>
          <div className="cr-cert-row">
            <span className="cr-cert-label">Receiving Dock</span>
            <span className="cr-cert-val">Bay 02 Unloading Ramp</span>
          </div>
        </div>

        {/* Actions */}
        <div className="cr-modal-actions">
          <button
            type="button"
            className="btn-cr-modal-primary"
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
            className="btn-cr-modal-secondary"
            onClick={onViewOrderHistory}
          >
            <span>View in Order History</span>
          </button>
        </div>
      </div>
    </div>
  )
}
