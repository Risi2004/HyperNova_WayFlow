export default function FleetStatusCard() {
  const statusItems = [
    { label: 'Available', count: 24, dotColor: '#22c55e' },
    { label: 'Loading', count: 6, dotColor: '#3b82f6' },
    { label: 'On Route', count: 14, dotColor: '#3b82f6' },
    { label: 'Completed', count: 9, dotColor: '#94a3b8' },
    { label: 'Maintenance / Unavailable', count: 3, dotColor: '#94a3b8' },
  ]

  const vehicleTypes = [
    { type: 'Reefer', available: 2, total: 8, percent: 25, color: '#f59e0b' },
    { type: 'Van', available: 8, total: 12, percent: 66.6, color: '#22c55e' },
    { type: 'Standard', available: 14, total: 21, percent: 66.6, color: '#22c55e' },
  ]

  return (
    <div className="dashboard-card fleet-status-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Fleet Status</h2>
          <span className="card-subheading">58 vehicles in today's operating pool</span>
        </div>
        <a href="#check-fleet" className="card-header-link">
          Check Fleet &rarr;
        </a>
      </div>

      {/* Fleet counts */}
      <div className="fleet-counts-list">
        {statusItems.map((item) => (
          <div key={item.label} className="fleet-count-row">
            <div className="fleet-count-left">
              <span className="fleet-dot" style={{ backgroundColor: item.dotColor }} />
              <span className="fleet-label">{item.label}</span>
            </div>
            <span className="fleet-value">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="fleet-divider" />

      {/* Vehicle capacity meters */}
      <div className="fleet-capacity-list">
        {vehicleTypes.map((v) => (
          <div key={v.type} className="fleet-capacity-row">
            <div className="fleet-capacity-info">
              <span className="vehicle-type-name">{v.type}</span>
              <span className="vehicle-availability-text">
                {v.available} / {v.total} available
              </span>
            </div>
            <div className="fleet-progress-track">
              <div
                className="fleet-progress-fill"
                style={{ width: `${v.percent}%`, backgroundColor: v.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
