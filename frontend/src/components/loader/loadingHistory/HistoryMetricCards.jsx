export default function HistoryMetricCards({
  metrics = {
    totalLoads: 128,
    completed: 121,
    issuesReported: 7,
    avgLoadingTime: '42 min',
  },
}) {
  return (
    <div className="history-metrics-grid">
      {/* 1: Total Loads */}
      <div className="history-metric-card">
        <div className="metric-content">
          <span className="metric-val text-dark">{metrics.totalLoads}</span>
          <span className="metric-label">Total Loads</span>
        </div>
      </div>

      {/* 2: Completed */}
      <div className="history-metric-card">
        <div className="metric-content">
          <span className="metric-val text-green">{metrics.completed}</span>
          <span className="metric-label">Completed</span>
        </div>
      </div>

      {/* 3: Issues Reported */}
      <div className="history-metric-card">
        <div className="metric-content">
          <span className="metric-val text-red">{metrics.issuesReported}</span>
          <span className="metric-label">Issues Reported</span>
        </div>
      </div>

      {/* 4: Average Loading Time */}
      <div className="history-metric-card">
        <div className="metric-content">
          <span className="metric-val text-blue">{metrics.avgLoadingTime}</span>
          <span className="metric-label">Average Loading Time</span>
        </div>
      </div>
    </div>
  )
}
