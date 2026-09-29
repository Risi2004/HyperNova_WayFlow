import { Link } from 'react-router-dom'

export default function LiveAttentionBanner() {
  const alerts = [
    {
      routeId: 'TR-027',
      outletId: 'OUT019',
      highlight: '12 min behind ETA',
      detail: 'Reason reported: Traffic delay',
    },
    {
      routeId: 'TR-031',
      outletId: 'OUT052',
      highlight: 'Delivery problem reported',
      detail: 'Awaiting Dispatcher review',
    },
  ]

  return (
    <div className="live-attention-card">
      <div className="attention-header-strip">
        <div className="attention-title-left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="attention-main-title">Needs Attention</span>
        </div>
        <span className="attention-count-tag">4 deliveries require attention</span>
      </div>

      <div className="attention-alerts-list">
        {alerts.map((alert, idx) => (
          <div key={idx} className="attention-alert-box">
            <div className="alert-box-left">
              <div className="alert-icon-square">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="alert-text-group">
                <div className="alert-route-outlet">
                  {alert.routeId} / {alert.outletId}
                </div>
                <div className="alert-highlight-red">{alert.highlight}</div>
                <div className="alert-sub-detail">{alert.detail}</div>
              </div>
            </div>

            <Link to={`/dispatcher/routes/${alert.routeId}`} className="alert-view-delivery-link">
              View Delivery
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
