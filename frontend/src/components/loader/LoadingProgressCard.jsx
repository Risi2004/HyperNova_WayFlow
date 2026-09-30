export default function LoadingProgressCard({ loadedCount = 18, totalCount = 30 }) {
  const percentage = Math.round((loadedCount / totalCount) * 100)

  return (
    <div className="loader-card loading-overall-progress-card">
      <div className="progress-card-header">
        <h3 className="progress-card-title">Today's Loading Progress</h3>
        <span className="progress-fraction-stat">
          {loadedCount} of {totalCount} orders loaded — {percentage}%
        </span>
      </div>

      <div className="overall-progress-track">
        <div
          className="overall-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
