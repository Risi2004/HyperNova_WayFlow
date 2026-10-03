export default function LoaderStatCards({ stats = [] }) {

  return (
    <div className="loader-stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="loader-stat-card">
          <div className="loader-stat-top">
            <span className="loader-stat-value">{stat.value}</span>
            <span className={`loader-stat-dot dot-${stat.dotColor}`} />
          </div>
          <span className="loader-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
