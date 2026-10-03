export default function OrderHistoryMetricsCards({
  metrics = {
    total: 128,
    completed: 112,
    completedRate: '87.5% Rate',
    deferred: 9,
    cancelled: 7,
  },
  activeTab,
  onSelectTab,
}) {
  return (
    <div className="oh-metrics-grid">
      {/* 1. Total Orders */}
      <div
        className={`oh-metric-card ${activeTab === 'all' ? 'active-metric' : ''}`}
        onClick={() => onSelectTab && onSelectTab('all')}
        role="button"
        tabIndex={0}
      >
        <div className="oh-metric-top">
          <span className="oh-metric-label">TOTAL ORDERS</span>
          <div className="oh-metric-icon-box blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
        </div>
        <div className="oh-metric-value">{metrics.total}</div>
        <div className="oh-metric-subtext">All logged since facility rollout</div>
      </div>

      {/* 2. Completed */}
      <div
        className={`oh-metric-card ${activeTab === 'completed' ? 'active-metric' : ''}`}
        onClick={() => onSelectTab && onSelectTab('completed')}
        role="button"
        tabIndex={0}
      >
        <div className="oh-metric-top">
          <span className="oh-metric-label">COMPLETED</span>
          <div className="oh-metric-icon-box blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <div className="oh-metric-value">{metrics.completed}</div>
        <div className="oh-metric-subtext">
          <span className="oh-tag-pill-rate">{metrics.completedRate}</span> Confirmed delivery
        </div>
      </div>

      {/* 3. Deferred */}
      <div
        className={`oh-metric-card ${activeTab === 'deferred' ? 'active-metric' : ''}`}
        onClick={() => onSelectTab && onSelectTab('deferred')}
        role="button"
        tabIndex={0}
      >
        <div className="oh-metric-top">
          <span className="oh-metric-label">DEFERRED</span>
          <div className="oh-metric-icon-box indigo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="oh-metric-value">{metrics.deferred}</div>
        <div className="oh-metric-subtext">
          <span className="oh-tag-pill-pushed">Pushed</span> Rescheduled arrival
        </div>
      </div>

      {/* 4. Cancelled */}
      <div
        className={`oh-metric-card ${activeTab === 'cancelled' ? 'active-metric' : ''}`}
        onClick={() => onSelectTab && onSelectTab('cancelled')}
        role="button"
        tabIndex={0}
      >
        <div className="oh-metric-top">
          <span className="oh-metric-label">CANCELLED</span>
          <div className="oh-metric-icon-box red">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
        </div>
        <div className="oh-metric-value">{metrics.cancelled}</div>
        <div className="oh-metric-subtext">
          <span className="oh-tag-pill-stockout">Withdrawn</span> Cancelled before dispatch
        </div>
      </div>
    </div>
  )
}
