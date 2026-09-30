import { useNavigate } from 'react-router-dom'

export default function SingleDeliveryHeader({ deliveryId = 'DEL-8401' }) {
  const navigate = useNavigate()

  return (
    <div className="single-delivery-header-wrapper">
      {/* Back Link */}
      <button
        type="button"
        className="btn-back-history"
        onClick={() => navigate('/dispatcher/delivery-history')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back to Delivery History</span>
      </button>

      {/* Main Title Row */}
      <div className="single-header-main-row">
        <div className="header-meta-left">
          <div className="delivery-title-badge-row">
            <h1 className="single-delivery-title">Delivery {deliveryId}</h1>
            <span className="status-pill-badge pill-completed">
              <span className="dot"></span>
              COMPLETED
            </span>
          </div>
          <p className="single-delivery-subtitle">
            Order ORD-2026-1048 Â· Delivered to OUT042 Waypoint Fresh
          </p>
          <span className="single-delivery-date">
            Saturday, 26 September 2026, 09:14 AM
          </span>
        </div>

        <div className="single-header-actions-right">
          <button
            type="button"
            className="btn-single-action-outline"
            onClick={() => window.print()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Delivery Note</span>
          </button>

          <button
            type="button"
            className="btn-single-action-outline"
            onClick={() => alert('Downloading signed Proof of Delivery (POD) document...')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download POD</span>
          </button>
        </div>
      </div>
    </div>
  )
}
