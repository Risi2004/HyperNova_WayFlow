export default function LoaderStatCards() {
  const stats = [
    {
      value: '8',
      label: 'Loads to Prepare',
      dotColor: 'gray',
    },
    {
      value: '2',
      label: 'Loading Now',
      dotColor: 'blue',
    },
    {
      value: '3',
      label: 'Ready for Departure',
      dotColor: 'green',
    },
    {
      value: '1',
      label: 'Issues',
      dotColor: 'amber',
    },
  ]

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
