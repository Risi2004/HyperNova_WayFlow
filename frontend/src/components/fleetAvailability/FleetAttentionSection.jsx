export default function FleetAttentionSection() {
  const issues = [
    {
      type: 'Low Fuel',
      badgeClass: 'badge-red',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
          <path d="M3 2v20h12V2H3z" />
          <path d="M15 8h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" />
        </svg>
      ),
      vehicleId: 'WP-CA-2931',
      description: 'Fuel remaining 14%',
    },
    {
      type: 'Capacity Constraint',
      badgeClass: 'badge-amber',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      vehicleId: 'WP-KA-1204',
      description: 'Volume nearly full',
    },
    {
      type: 'Maintenance',
      badgeClass: 'badge-red',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      vehicleId: 'WP-CA-1842',
      description: 'Vehicle unavailable',
    },
    {
      type: 'Second Trip Assigned',
      badgeClass: 'badge-blue',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      vehicleId: 'WP-CA-3912',
      description: 'Trip 2 already allocated',
    },
  ]

  return (
    <div className="fleet-attention-card">
      <div className="fleet-attention-header">
        <h3 className="fleet-attention-title">Fleet Attention</h3>
        <p className="fleet-attention-subtitle">Operational constraints requiring dispatcher review.</p>
      </div>

      <div className="attention-items-list">
        {issues.map((item, idx) => (
          <div key={idx} className="attention-row-item">
            <div className="attention-row-left">
              <span className={`attention-type-badge ${item.badgeClass}`}>
                {item.icon}
                <span>{item.type}</span>
              </span>
              <a href={`#${item.vehicleId}`} className="attention-veh-link">
                {item.vehicleId}
              </a>
              <span className="attention-desc-text">{item.description}</span>
            </div>

            <span className="attention-chevron-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
