export default function QuickDriverActionsCard({
  onReportProblem,
  onCallDispatch,
  onViewHistory,
  onToggleOffline,
  isOffline = false,
}) {
  return (
    <div className="driver-card quick-actions-card">
      <div className="driver-card-header">
        <h3 className="driver-card-title">Quick Driver Actions</h3>
      </div>

      <div className="quick-actions-grid">
        {/* Action 1: Report Problem */}
        <button
          type="button"
          className="btn-quick-action report-problem"
          onClick={onReportProblem}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Report Problem</span>
        </button>

        {/* Action 2: Call Dispatch */}
        <button
          type="button"
          className="btn-quick-action"
          onClick={onCallDispatch}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call Dispatch</span>
        </button>

        {/* Action 3: View History */}
        <button
          type="button"
          className="btn-quick-action"
          onClick={onViewHistory}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>View History</span>
        </button>

        {/* Action 4: Offline Mode */}
        <button
          type="button"
          className={`btn-quick-action ${isOffline ? 'offline-active' : ''}`}
          onClick={onToggleOffline}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <span>{isOffline ? 'Online Mode' : 'Offline Mode'}</span>
        </button>
      </div>
    </div>
  )
}
