export default function UpcomingTripsCards({
  trips = [],
  onViewRouteDetails,
}) {
  return (
    <div className="upcoming-trips-section">
      <h3 className="section-heading">Upcoming Scheduled Trips</h3>

      <div className="upcoming-trips-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="upcoming-trip-card">
            {/* Header: Trip ID & Status Badge */}
            <div className="upcoming-card-header">
              <span className="upcoming-trip-id">{trip.id}</span>
              <span className="upcoming-scheduled-badge">
                <span className="badge-dot-grey" />
                <span>{trip.status}</span>
              </span>
            </div>

            {/* Timing */}
            <div className="upcoming-timing-headline">
              {trip.timeText}
            </div>

            {/* Vehicle & Route Details */}
            <div className="upcoming-trip-meta">
              <span className="meta-text vehicle">{trip.vehicle}</span>
              <span className="meta-text route">{trip.route}</span>
              <span className="meta-text stops">{trip.stopsCount} Delivery Stops assigned</span>
            </div>

            {/* Action */}
            <button
              type="button"
              className="btn-view-route-details"
              onClick={() => onViewRouteDetails && onViewRouteDetails(trip)}
            >
              View Route details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
