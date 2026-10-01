export default function OutcomeConfirmationCard({
  outcome = 'success',
  storeName = 'Metro Grocers',
  orderId = 'ORD-1042',
  schedule = 'Scheduled 11:00-11:30 AM',
  statusBadge = 'DELIVERED',
  onConfirmAndContinue,
  onReportProblem,
}) {
  if (outcome === 'problem') {
    return (
      <div className="outcome-confirmation-card problem-mode">
        <div className="outcome-status-header-row">
          <div className="status-indicator-block">
            <span className="status-icon-ring problem">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div className="status-text-meta">
              <h4 className="status-primary-title">Delivery Issue Identified</h4>
              <p className="status-secondary-sub">
                {storeName} &middot; Order {orderId} &middot; Requires dispatcher escalation
              </p>
            </div>
          </div>
          <span className="status-badge-tag problem">PROBLEM REPORTED</span>
        </div>

        <div className="outcome-action-button-row">
          <button
            type="button"
            className="btn-confirm-primary problem"
            onClick={onReportProblem}
          >
            Report Problem to Dispatch
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="outcome-confirmation-card">
      <div className="outcome-status-header-row">
        {/* Left Status Indicator */}
        <div className="status-indicator-block">
          <span className="status-icon-ring">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="status-text-meta">
            <h4 className="status-primary-title">Ready to Complete</h4>
            <p className="status-secondary-sub">
              {storeName} &middot; Order {orderId} &middot; {schedule}
            </p>
          </div>
        </div>

        {/* Right Status Pill Badge */}
        <span className="status-badge-tag delivered">{statusBadge}</span>
      </div>

      {/* Button Row */}
      <div className="outcome-action-button-row">
        <button
          type="button"
          className="btn-confirm-primary"
          onClick={onConfirmAndContinue}
        >
          Confirm &amp; Continue
        </button>
      </div>
    </div>
  )
}
