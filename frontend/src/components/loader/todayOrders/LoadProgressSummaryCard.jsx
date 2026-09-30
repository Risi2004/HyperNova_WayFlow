export default function LoadProgressSummaryCard({
  loadedCount = 3,
  pendingCount = 2,
  issuesCount = 0,
  totalOrders = 5,
  percentage = 60,
}) {
  return (
    <div className="loader-detail-card load-progress-summary-card">
      <h3 className="detail-sidecard-title">Loading Progress</h3>

      {/* Progress Track & Subhead */}
      <div className="summary-progress-section">
        <div className="summary-progress-row">
          <span className="summary-progress-title">Preparation Total</span>
          <span className="summary-progress-stat">
            {loadedCount} of {totalOrders} Orders Loaded ({percentage}%)
          </span>
        </div>
        <div className="summary-progress-bar-track">
          <div
            className="summary-progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 3 Metrics Row */}
      <div className="progress-three-stats-row">
        <div className="progress-stat-col">
          <span className="stat-col-number text-green">{loadedCount}</span>
          <span className="stat-col-label">LOADED</span>
        </div>
        <div className="progress-stat-col">
          <span className="stat-col-number text-blue">{pendingCount}</span>
          <span className="stat-col-label">PENDING</span>
        </div>
        <div className="progress-stat-col">
          <span className="stat-col-number text-gray">{issuesCount}</span>
          <span className="stat-col-label">ISSUES</span>
        </div>
      </div>
    </div>
  )
}
