export default function StoreManagerMetricsCards({
  activeOrders = '06',
  scheduledDeliveries = '04',
  nextEta = '10:45 AM',
  nextEtaSub = 'Today • Trip TR-024',
  deferredOrders = '02',
}) {
  return (
    <div className="sm-metrics-grid">
      {/* Metric 1 */}
      <div className="sm-metric-card">
        <div className="sm-metric-header">
          <span className="sm-metric-label">ACTIVE ORDERS</span>
          <div className="sm-metric-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        </div>
        <div className="sm-metric-value">{activeOrders}</div>
        <div className="sm-metric-subtext">Orders currently being processed</div>
      </div>

      {/* Metric 2 */}
      <div className="sm-metric-card">
        <div className="sm-metric-header">
          <span className="sm-metric-label">SCHEDULED DELIVERIES</span>
          <div className="sm-metric-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
        </div>
        <div className="sm-metric-value">{scheduledDeliveries}</div>
        <div className="sm-metric-subtext">Upcoming deliveries on a trip</div>
      </div>

      {/* Metric 3 */}
      <div className="sm-metric-card">
        <div className="sm-metric-header">
          <div className="sm-metric-label-with-dot">
            <span className="sm-metric-label">NEXT ETA</span>
            <span className="sm-live-dot" />
          </div>
          <div className="sm-metric-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="sm-metric-value eta-time">{nextEta}</div>
        <div className="sm-metric-subtext">{nextEtaSub}</div>
      </div>

      {/* Metric 4 */}
      <div className="sm-metric-card alert-tint">
        <div className="sm-metric-header">
          <span className="sm-metric-label">DEFERRED ORDERS</span>
          <div className="sm-metric-icon-wrap alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        </div>
        <div className="sm-metric-value">{deferredOrders}</div>
        <div className="sm-metric-subtext">Require attention / rescheduling</div>
      </div>
    </div>
  )
}
