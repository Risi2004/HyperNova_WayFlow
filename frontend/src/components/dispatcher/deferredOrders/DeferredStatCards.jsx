export default function DeferredStatCards({ stats }) {
  const cards = [
    { label: 'Deferred Total', value: stats.total, subtext: 'Waiting for a later delivery run.' },
    { label: 'Deferred 2+ Times', value: stats.consecutive, subtext: 'Skipped more than once — plan these first.' },
    { label: 'Capacity / Fleet', value: stats.capacity, subtext: 'Weight, volume, reefer space or fuel quota.' },
    { label: 'Access / Window', value: stats.access, subtext: 'Van-only access, outlet access or delivery window.' },
  ]

  return (
    <div className="deferred-stat-cards-grid">
      {cards.map((card) => (
        <div key={card.label} className="deferred-stat-card">
          <span className="deferred-card-label">{card.label}</span>
          <div className="deferred-card-value">{card.value}</div>
          <p className="deferred-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}
