export default function UpcomingTripsCards({
  trips = [
    {
      id: 'TR-025',
      timeText: 'Tomorrow, 05:30 AM',
      vehicle: 'WP-VAN-004 • Delivery Van',
      route: 'Peliyagoda → Negombo',
      stopsCount: 6,
      status: 'Scheduled',
    },
    {
      id: 'TR-026',
      timeText: '28 Sep, 07:00 AM',
      vehicle: 'WP-DRY-019 • Dry-box Truck',
      route: 'Kandy → Central Region',
      stopsCount: 7,
      status: 'Scheduled',
    },
    {
      id: 'TR-027',
      timeText: '29 Sep, 06:00 AM',
      vehicle: 'WP-REF-011 • Refrigerated',
      route: 'Peliyagoda → Galle Coastal',
      stopsCount: 5,
      status: 'Scheduled',
    },
  ],
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
