export default function OrdersStatCards({ stats = {}, activeStatus = 'all', onSelectStatus }) {
  const cards = [
    { key: 'all', label: 'Total Orders', count: stats.total, dotColor: '#3b82f6' },
    { key: 'pending', label: 'Pending Planning', count: stats.pending, dotColor: '#f59e0b' },
    { key: 'planned', label: 'Planned', count: stats.planned, dotColor: '#22c55e' },
    { key: 'loading', label: 'In Loading', count: stats.loading, dotColor: '#3b82f6' },
    { key: 'deferred', label: 'Deferred', count: stats.deferred, dotColor: '#64748b' },
    { key: 'exception', label: 'Exceptions', count: stats.exception, dotColor: '#ef4444' },
  ]

  return (
    <div className="orders-stats-row">
      {cards.map((s) => (
        <button
          key={s.label}
          type="button"
          className={`order-mini-stat-card ${activeStatus === s.key ? 'stat-active' : ''}`}
          onClick={() => onSelectStatus?.(s.key)}
        >
          <span className="order-mini-label">{s.label}</span>
          <div className="order-mini-value-row">
            <span className="order-mini-number">{s.count ?? '–'}</span>
            <span className="order-mini-dot" style={{ backgroundColor: s.dotColor }} />
          </div>
        </button>
      ))}
    </div>
  )
}
