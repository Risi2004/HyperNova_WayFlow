export default function DeliveryProgressCard() {
  return (
    <div className="dashboard-card progress-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Today's Delivery Progress</h2>
          <span className="card-subheading">Last updated 2 minutes ago</span>
        </div>
        <a href="#delivery-details" className="card-header-link">
          Delivery details &rarr;
        </a>
      </div>

      <div className="progress-stat-row">
        <div className="progress-big-number">
          <span className="current-count">42</span>
          <span className="total-count">/ 68 deliveries</span>
        </div>
        <span className="progress-percent-badge">62% COMPLETE</span>
      </div>

      {/* Segmented bar */}
      <div className="segmented-progress-track">
        <div className="segment segment-completed" style={{ width: '61.7%' }} title="Completed: 42 (62%)" />
        <div className="segment segment-progress" style={{ width: '20.6%' }} title="In Progress: 14 (21%)" />
        <div className="segment segment-pending" style={{ width: '14.7%' }} title="Pending: 10 (15%)" />
        <div className="segment segment-delayed" style={{ width: '3%' }} title="Delayed: 2 (3%)" />
      </div>

      {/* Legend boxes */}
      <div className="progress-legend-grid">
        <div className="legend-box">
          <div className="legend-top">
            <span className="legend-dot dot-completed" />
            <span className="legend-label">Completed</span>
          </div>
          <span className="legend-value">42</span>
        </div>

        <div className="legend-box">
          <div className="legend-top">
            <span className="legend-dot dot-progress" />
            <span className="legend-label">In Progress</span>
          </div>
          <span className="legend-value">14</span>
        </div>

        <div className="legend-box">
          <div className="legend-top">
            <span className="legend-dot dot-pending" />
            <span className="legend-label">Pending</span>
          </div>
          <span className="legend-value">10</span>
        </div>

        <div className="legend-box">
          <div className="legend-top">
            <span className="legend-dot dot-delayed" />
            <span className="legend-label">Delayed</span>
          </div>
          <span className="legend-value">2</span>
        </div>
      </div>
    </div>
  )
}
