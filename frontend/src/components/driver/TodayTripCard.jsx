export default function TodayTripCard({
  tripId = 'TR-024',
  vehicle = 'WP-REF-007 (Refrigerated)',
  route = 'Peliyagoda → Colombo South',
  departureTime = '06:00 AM',
  status = 'In Progress',
  onContinueTrip,
}) {
  return (
    <div className="driver-card today-trip-card">
      {/* Header Row */}
      <div className="driver-card-header">
        <h3 className="driver-card-title">Today's Trip</h3>
        <span className="driver-pill-badge blue">
          <span className="badge-dot-blue" />
          <span>{status}</span>
        </span>
      </div>

      {/* 2x2 Meta Grid */}
      <div className="today-trip-meta-grid">
        <div className="trip-meta-item">
          <span className="trip-meta-label">TRIP ID</span>
          <span className="trip-meta-value">{tripId}</span>
        </div>

        <div className="trip-meta-item">
          <span className="trip-meta-label">VEHICLE</span>
          <span className="trip-meta-value">{vehicle}</span>
        </div>

        <div className="trip-meta-item">
          <span className="trip-meta-label">ROUTE</span>
          <span className="trip-meta-value">{route}</span>
        </div>

        <div className="trip-meta-item">
          <span className="trip-meta-label">DEPARTURE TIME</span>
          <span className="trip-meta-value">{departureTime}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="btn-continue-trip"
        onClick={onContinueTrip}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span>Continue Trip</span>
      </button>
    </div>
  )
}
