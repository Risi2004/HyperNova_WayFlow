export default function RoutesMetricCards() {
  const metrics = [
    { label: 'Total Routes', value: 24 },
    { label: 'Planned', value: 8 },
    { label: 'Active', value: 6 },
    { label: 'Completed', value: 5 },
    { label: 'Delayed', value: 1, isDanger: true },
    { label: 'Total Stops', value: 86 },
  ]

  return (
    <div className="routes-metrics-grid">
      {metrics.map((m, idx) => (
        <div key={idx} className="routes-metric-card">
          <span className="routes-metric-label">{m.label}</span>
          <span className={`routes-metric-val ${m.isDanger ? 'val-danger' : ''}`}>
            {m.value}
          </span>
        </div>
      ))}
    </div>
  )
}
