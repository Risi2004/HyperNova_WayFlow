export default function RoutesAttentionCard({ onViewRoute }) {
  const issues = [
    {
      id: 'RTE-2026-042',
      alertTitle: 'Delayed by 18 minutes',
      subtext: 'Current stop Waypoint Fresh – Colombo 05 • Reason: Traffic delay',
    },
    {
      id: 'RTE-2026-044',
      alertTitle: 'Loading issue',
      subtext: '1 item reported short • Reason: Loading shortfall',
    },
  ]

  return (
    <div className="routes-attention-card">
      <div className="routes-attention-header">
        <div className="attention-title-left">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3 className="routes-attention-heading">Routes Requiring Attention</h3>
        </div>
        <span className="attention-count-pill">2 routes</span>
      </div>

      <div className="routes-attention-list">
        {issues.map((item) => (
          <div key={item.id} className="attention-item-row">
            <div className="attention-item-left">
              <div className="attention-clock-circle">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <div className="attention-meta-content">
                <div className="attention-title-line">
                  <span className="att-route-code">{item.id}</span>
                  <span className="att-bold-issue">{item.alertTitle}</span>
                </div>
                <p className="att-detail-sub">{item.subtext}</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-attention-view-route"
              onClick={() => onViewRoute && onViewRoute(item.id)}
            >
              View Route
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
