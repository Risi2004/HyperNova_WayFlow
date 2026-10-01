import { useNavigate } from 'react-router-dom'

export default function RecordDeliveryHeader({
  tripId = 'TR-024',
  stopNumber = '05',
  totalStops = '08',
}) {
  const navigate = useNavigate()

  return (
    <div className="record-delivery-header-section">
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

      <div className="record-delivery-title-row">
        <h1 className="record-delivery-title">Record Delivery</h1>
        <span className="record-delivery-trip-meta">
          Trip {tripId} &middot; Stop {stopNumber} of {totalStops}
        </span>
      </div>
    </div>
  )
}
