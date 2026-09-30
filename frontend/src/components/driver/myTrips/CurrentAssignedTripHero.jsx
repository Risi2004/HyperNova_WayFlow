export default function CurrentAssignedTripHero({
  trip = {
    tripId: 'TR-024',
    vehicle: 'WP-REF-007 (Refrigerated Truck)',
    route: 'Peliyagoda HQ → Colombo South Outlet',
    departureTime: 'Today, 06:00 AM',
    completedStops: 4,
    totalStops: 8,
    status: 'In Progress',
    nextStopNumber: '05',
    nextStopName: 'WayFlow Fresh — Colombo 04',
    nextStopArrival: '10:42 AM',
  },
  onContinueChecklist,
  onViewStopDetails,
}) {
  const percentage = Math.round((trip.completedStops / trip.totalStops) * 100)

  return (
    <div className="current-assigned-trip-card">
      {/* Top Banner Tag & In Progress Badge */}
      <div className="current-trip-header-row">
        <div className="current-assigned-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>CURRENT ASSIGNED TRIP</span>
        </div>

        <span className="current-trip-status-badge">
          <span className="badge-dot-pulse-blue" />
          <span>{trip.status}</span>
        </span>
      </div>

      {/* 2-Column Meta Grid */}
      <div className="current-trip-meta-grid">
        <div className="meta-left-col">
          <div className="trip-meta-block">
            <span className="meta-block-label">TRIP ID</span>
            <span className="meta-block-value trip-id-bold">{trip.tripId}</span>
          </div>

          <div className="trip-meta-block">
            <span className="meta-block-label">ROUTE PATHWAY</span>
            <span className="meta-block-value">{trip.route}</span>
          </div>
        </div>

        <div className="meta-right-col">
          <div className="trip-meta-block">
            <span className="meta-block-label">VEHICLE</span>
            <span className="meta-block-value">{trip.vehicle}</span>
          </div>

          <div className="trip-meta-block">
            <span className="meta-block-label">DEPARTURE TIME</span>
            <span className="meta-block-value">{trip.departureTime}</span>
          </div>
        </div>
      </div>

      {/* Stops Completed Progress Bar */}
      <div className="trip-progress-section">
        <div className="trip-progress-legend">
          <span className="stops-completed-text">
            {trip.completedStops} of {trip.totalStops} Stops Completed
          </span>
          <span className="percentage-text">{percentage}% Complete</span>
        </div>

        <div className="trip-progress-bar-track">
          <div
            className="trip-progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Next Outlet Stop Callout */}
      <div className="next-outlet-callout-box">
        <div className="callout-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="callout-tag">NEXT OUTLET STOP: #{trip.nextStopNumber}</span>
        </div>
        <p className="callout-detail">
          {trip.nextStopName} • Expected Window Arrival: {trip.nextStopArrival}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="current-trip-actions-row">
        <button
          type="button"
          className="btn-continue-checklist"
          onClick={onContinueChecklist}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>Continue Trip Checklist</span>
        </button>

        <button
          type="button"
          className="btn-view-stop-details"
          onClick={onViewStopDetails}
        >
          View Stop Details
        </button>
      </div>
    </div>
  )
}
