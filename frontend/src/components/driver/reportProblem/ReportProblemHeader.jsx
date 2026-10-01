import { useNavigate } from 'react-router-dom'

export default function ReportProblemHeader({
  tripId = 'TR-024',
  isOnline = true,
}) {
  const navigate = useNavigate()

  return (
    <div className="report-problem-header-section">
      <button
        type="button"
        className="btn-back-trip-link"
        onClick={() => navigate(`/driver/my-trips/${tripId}`)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Trip</span>
      </button>

      <div className="report-problem-title-row">
        <div className="report-title-block">
          <h1 className="report-page-title">Report Problem</h1>
          <p className="report-page-subtitle">Report an issue encountered during your trip.</p>
        </div>

        <div className="report-right-status-group">
          {isOnline && (
            <span className="report-online-pill">
              <span className="online-dot" />
              <span>Online</span>
            </span>
          )}

          <button type="button" className="btn-report-bell" aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
