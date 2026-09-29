export default function PlannerStatCards() {
  const stats = [
    { label: 'Orders to Plan', value: '24' },
    { label: 'Orders Planned', value: '62' },
    { label: 'Vehicles Available', value: '18' },
    { label: 'Routes Planned', value: '12' },
    { label: 'Deferred', value: '7' },
    { label: 'Capacity Utilization', value: '78%' },
  ]

  return (
    <div className="planner-stats-grid">
      {stats.map((stat, idx) => (
        <div key={idx} className="planner-stat-card">
          <span className="planner-stat-value">{stat.value}</span>
          <span className="planner-stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
