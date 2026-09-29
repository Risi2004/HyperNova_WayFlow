export default function LiveDeliveriesCard() {
  const deliveries = [
    {
      id: 'WP-204',
      driver: 'Maya Chen',
      route: 'North Loop · R-16',
      stops: '8 / 11 stops',
      percent: 74,
      status: 'ON SCHEDULE',
      statusType: 'success',
      eta: '10:42',
      isDelayed: false,
    },
    {
      id: 'WP-118',
      driver: 'Jon Bell',
      route: 'Harbor · R-07',
      stops: '5 / 9 stops',
      percent: 56,
      status: '+16 MIN DELAYED',
      statusType: 'danger',
      eta: '11:08',
      isDelayed: true,
    },
    {
      id: 'RF-031',
      driver: 'Amira Patel',
      route: 'East Cold · R-22',
      stops: '6 / 9 stops',
      percent: 68,
      status: 'AT STOP 6',
      statusType: 'info',
      eta: '10:55',
      isDelayed: false,
    },
    {
      id: 'WP-087',
      driver: 'Luis Ortega',
      route: 'Central · R-12',
      stops: '4 / 10 stops',
      percent: 45,
      status: 'ON SCHEDULE',
      statusType: 'success',
      eta: '11:24',
      isDelayed: false,
    },
  ]

  return (
    <div className="dashboard-card live-deliveries-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Live Deliveries</h2>
          <span className="card-subheading">14 active deliveries • 2 delayed</span>
        </div>
        <a href="#view-live-deliveries" className="card-header-link">
          View Live Deliveries &rarr;
        </a>
      </div>

      <div className="live-deliveries-list">
        {deliveries.map((del) => (
          <div key={del.id} className="live-delivery-item">
            {/* Left Truck Icon */}
            <div className={`delivery-icon-box ${del.isDelayed ? 'bg-delayed' : 'bg-normal'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>

            {/* Info */}
            <div className="delivery-details-col">
              <div className="delivery-title-line">
                <span className="delivery-vehicle-driver">
                  <strong>{del.id}</strong> · {del.driver}
                </span>
              </div>
              <span className="delivery-route-sub">{del.route}</span>
            </div>

            {/* Stops & Progress */}
            <div className="delivery-progress-col">
              <span className="delivery-stops-text">{del.stops}</span>
              <div className="delivery-track">
                <div
                  className={`delivery-fill ${del.isDelayed ? 'fill-delayed' : 'fill-normal'}`}
                  style={{ width: `${del.percent}%` }}
                />
              </div>
            </div>

            {/* Status Pill */}
            <div className="delivery-status-col">
              <span className="delivery-percent-text">{del.percent}%</span>
              <span className={`delivery-status-pill pill-${del.statusType}`}>
                {del.status}
              </span>
            </div>

            {/* ETA */}
            <div className="delivery-eta-col">
              <span className="eta-label">ETA</span>
              <span className="eta-value">{del.eta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
