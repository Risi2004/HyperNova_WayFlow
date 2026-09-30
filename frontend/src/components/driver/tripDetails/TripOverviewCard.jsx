export default function TripOverviewCard({
  trip = {
    vehicle: 'WP-REF-007 (Refrigerated Truck)',
    routePathway: 'Peliyagoda HQ → Colombo South',
    departureTime: 'Today, 06:00 AM',
    stopsSummary: '8 Stops (4 Completed, 4 Remaining)',
    completedStops: 4,
    totalStops: 8,
  },
}) {
  const percentage = Math.round((trip.completedStops / trip.totalStops) * 100)

  return (
    <div className="trip-overview-card">
      {/* 2x2 Meta Grid */}
      <div className="trip-overview-meta-grid">
        {/* Vehicle */}
        <div className="overview-meta-item">
          <span className="overview-meta-label">VEHICLE</span>
          <div className="overview-meta-value-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="overview-meta-value">{trip.vehicle}</span>
          </div>
        </div>

        {/* Route Pathway */}
        <div className="overview-meta-item">
          <span className="overview-meta-label">ROUTE PATHWAY</span>
          <div className="overview-meta-value-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="overview-meta-value">{trip.routePathway}</span>
          </div>
        </div>

        {/* Departure Time */}
        <div className="overview-meta-item">
          <span className="overview-meta-label">DEPARTURE TIME</span>
          <div className="overview-meta-value-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="overview-meta-value">{trip.departureTime}</span>
          </div>
        </div>

        {/* Stops Summary */}
        <div className="overview-meta-item">
          <span className="overview-meta-label">STOPS SUMMARY</span>
          <div className="overview-meta-value-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span className="overview-meta-value">{trip.stopsSummary}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Row */}
      <div className="trip-overview-progress-section">
        <div className="overview-progress-legend">
          <span className="legend-label">Trip Progress</span>
          <span className="legend-percent">
            {percentage}% Complete ({trip.completedStops}/{trip.totalStops} Stops)
          </span>
        </div>

        <div className="overview-progress-track">
          <div
            className="overview-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
