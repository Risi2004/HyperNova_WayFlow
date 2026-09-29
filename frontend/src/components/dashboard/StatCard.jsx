export default function StatCard({
  label,
  value,
  subtext,
  icon,
  iconBg = 'blue', // 'blue' | 'amber' | 'green' | 'red'
  dotColor,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <div className={`stat-card-icon-wrapper ${iconBg}`}>
          <img src={icon} alt="" className="stat-card-icon" aria-hidden="true" />
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      {subtext && (
        <div className="stat-card-subtext">
          {dotColor && <span className="stat-card-dot" style={{ backgroundColor: dotColor }} />}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  )
}
