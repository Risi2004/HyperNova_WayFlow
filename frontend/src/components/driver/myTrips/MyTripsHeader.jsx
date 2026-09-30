export default function MyTripsHeader({
  activeFilter = 'All',
  onFilterChange,
  counts = { all: 12, current: 1, upcoming: 3, completed: 8 },
}) {
  const tabs = [
    { key: 'All', label: 'All', count: counts.all },
    { key: 'Current', label: 'Current', count: counts.current },
    { key: 'Upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'Completed', label: 'Completed', count: counts.completed },
  ]

  return (
    <div className="my-trips-header-section">
      {/* Title & Subtitle */}
      <div className="my-trips-title-group">
        <h1 className="my-trips-page-title">My Trips</h1>
        <p className="my-trips-page-subtitle">
          View your assigned delivery trips and track trip progress.
        </p>
      </div>

      {/* Segmented Filter Pills */}
      <div className="my-trips-filter-pills-row">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              className={`trip-filter-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange && onFilterChange(tab.key)}
            >
              <span>{tab.label}</span>
              <span className="pill-count">({tab.count})</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
