import { useNavigate } from 'react-router-dom'

export default function StopHeaderBanner({
  tripId = 'TR-024',
  stopNumber = '05',
  totalStops = '08',
  storeName = 'Metro Grocers (OUT043)',
  deliveryWindow = '11:00 AM - 11:30 AM',
  status = 'Pending Delivery',
}) {
  const navigate = useNavigate()

  return (
    <div className="stop-header-banner-section">
      {/* Back Link */}
      <button
        type="button"
        className="btn-back-trip-link"
        onClick={() => navigate(`/driver/my-trips/${tripId}`)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Trip {tripId}</span>
      </button>

      {/* Main Title Row */}
      <div className="stop-title-headline-row">
        <h1 className="stop-page-title">
          Delivery Stop Details <span className="title-slash">/</span> <span className="title-stop-num">Stop {stopNumber} of {totalStops}</span>
        </h1>
        <span className="current-stop-pill">Current Stop</span>
      </div>

      {/* Hero Active Stop Card */}
      <div className="active-stop-card-banner">
        <div className="banner-top-row">
          <span className="banner-stop-tag">CURRENT STOP - {stopNumber} OF {totalStops}</span>
          <span className="pending-delivery-badge">
            <span className="badge-dot-amber" />
            <span>{status}</span>
          </span>
        </div>

        <div className="banner-store-name-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2 className="banner-store-name">{storeName}</h2>
        </div>

        <div className="banner-window-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Delivery Window: {deliveryWindow}</span>
        </div>
      </div>
    </div>
  )
}
