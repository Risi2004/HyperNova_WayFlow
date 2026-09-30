export default function TripContextCard({
  tripId = 'TR-024',
  route = 'Peliyagoda → Colombo South',
  vehicle = 'WP-REF-007',
  progressText = '4 / 8 stops completed',
}) {
  return (
    <div className="stop-sidebar-card trip-context-card">
      <h4 className="sidebar-card-title">TRIP CONTEXT</h4>

      <div className="trip-context-rows-list">
        <div className="trip-context-row">
          <span className="context-label">Trip ID</span>
          <span className="context-value trip-id-bold">{tripId}</span>
        </div>

        <div className="trip-context-row">
          <span className="context-label">Route</span>
          <span className="context-value">{route}</span>
        </div>

        <div className="trip-context-row">
          <span className="context-label">Vehicle</span>
          <span className="context-value">{vehicle}</span>
        </div>

        <div className="trip-context-row">
          <span className="context-label">Progress</span>
          <span className="context-value progress-accent">{progressText}</span>
        </div>
      </div>
    </div>
  )
}
