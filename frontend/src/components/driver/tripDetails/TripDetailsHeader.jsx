import { useNavigate } from 'react-router-dom'

export default function TripDetailsHeader({
  tripId = 'TR-024',
  status = 'In Progress',
}) {
  const navigate = useNavigate()

  return (
    <div className="trip-details-header-section">
      <div className="trip-details-breadcrumb-title">
        <button
          type="button"
          className="btn-breadcrumb-back"
          onClick={() => navigate('/driver/my-trips')}
          title="Back to My Trips"
        >
          Trip Details
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="trip-id-title-text">{tripId}</span>

        <span className="trip-details-status-badge">
          <span className="status-dot-blue" />
          <span>{status}</span>
        </span>
      </div>
    </div>
  )
}
