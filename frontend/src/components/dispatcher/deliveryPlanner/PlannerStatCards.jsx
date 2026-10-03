export default function PlannerStatCards({ stats }) {
  const v = (n, suffix = '') => (stats ? `${n}${suffix}` : '–')
  const cards = [
    { label: 'Orders to Plan', value: v(stats?.unscheduled) },
    { label: 'Orders Planned', value: v(stats?.planned) },
    { label: 'Vehicles Available', value: v(stats?.vehicles_available) },
    { label: 'Routes Planned', value: v(stats?.routes) },
    { label: 'Vehicles Used', value: v(stats?.vehicles_used) },
    { label: 'Capacity Utilization', value: v(stats?.utilization, '%') },
  ]

  return (
    <div className="planner-stats-grid">
      {cards.map((stat) => (
        <div key={stat.label} className="planner-stat-card">
          <span className="planner-stat-value">{stat.value}</span>
          <span className="planner-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
