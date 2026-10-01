import { useNavigate } from 'react-router-dom'

export default function ProofHeaderSection({
  tripId = 'TR-024',
  stopNumber = '05',
  totalStops = '08',
  isOnline = true,
}) {
  const navigate = useNavigate()

  return (
    <div className="proof-header-section">
      <button
        type="button"
        className="btn-back-stop-link"
        onClick={() => navigate(`/driver/my-trips/${tripId}/delivery-stop`)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Stop Details</span>
      </button>

      <div className="proof-title-meta-row">
        <div className="proof-title-block">
          <h1 className="proof-page-title">Proof of Delivery</h1>
          <p className="proof-page-subtitle">Record proof that this delivery was completed.</p>
        </div>

        <div className="proof-right-status-group">
          <div className="proof-trip-stop-meta">
            <span className="proof-trip-bold">Trip {tripId}</span>
            <span className="proof-stop-sub">Stop {stopNumber} of {totalStops}</span>
          </div>

          {isOnline && (
            <span className="proof-online-pill">
              <span className="online-dot" />
              <span>Online</span>
            </span>
          )}

          <button type="button" className="btn-proof-bell" aria-label="Notifications">
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
