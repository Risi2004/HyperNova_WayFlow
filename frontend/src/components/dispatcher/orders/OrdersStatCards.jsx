export default function OrdersStatCards() {
  const stats = [
    { label: 'Total Orders', count: 86, dotColor: '#3b82f6' },
    { label: 'Pending Planning', count: 24, dotColor: '#f59e0b' },
    { label: 'Planned', count: 41, dotColor: '#22c55e' },
    { label: 'In Loading', count: 9, dotColor: '#3b82f6' },
    { label: 'Deferred', count: 7, dotColor: '#64748b' },
    { label: 'Exceptions', count: 5, dotColor: '#ef4444' },
  ]

  return (
    <div className="orders-stats-row">
      {stats.map((s) => (
        <div key={s.label} className="order-mini-stat-card">
          <span className="order-mini-label">{s.label}</span>
          <div className="order-mini-value-row">
            <span className="order-mini-number">{s.count}</span>
            <span className="order-mini-dot" style={{ backgroundColor: s.dotColor }} />
          </div>
        </div>
      ))}
    </div>
  )
}
