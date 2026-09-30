export default function TodayLoadsSummaryPills({
  counts = {
    total: 8,
    awaiting: 3,
    loading: 2,
    ready: 2,
    issues: 1,
  },
  activeStatus = 'ALL',
  onSelectStatus,
}) {
  const pills = [
    { key: 'ALL', label: 'Total Loads', count: counts.total, colorClass: 'pill-neutral' },
    { key: 'AWAITING', label: 'Awaiting Loading', count: counts.awaiting, colorClass: 'pill-awaiting' },
    { key: 'LOADING', label: 'Loading', count: counts.loading, colorClass: 'pill-loading' },
    { key: 'READY', label: 'Ready', count: counts.ready, colorClass: 'pill-ready' },
    { key: 'ISSUE', label: 'Issues', count: counts.issues, colorClass: 'pill-issues' },
  ]

  return (
    <div className="today-loads-pills-row">
      {pills.map((pill) => {
        const isActive = activeStatus === pill.key
        return (
          <button
            key={pill.key}
            type="button"
            className={`summary-filter-pill ${pill.colorClass} ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelectStatus && onSelectStatus(pill.key)}
          >
            <span className="summary-pill-label">{pill.label}:</span>
            <span className="summary-pill-count">{pill.count}</span>
          </button>
        )
      })}
    </div>
  )
}
