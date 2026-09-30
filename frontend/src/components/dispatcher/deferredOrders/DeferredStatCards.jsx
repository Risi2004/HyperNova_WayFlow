export default function DeferredStatCards() {
  const cards = [
    {
      label: 'Deferred Today',
      value: 12,
      subtext: '12 orders were not assigned to a route today.',
    },
    {
      label: 'Awaiting Next Run',
      value: 8,
      subtext: 'Queued for the next feasible delivery run.',
    },
    {
      label: 'Capacity Related',
      value: 7,
      subtext: 'Weight, volume, or refrigerated space constrained.',
    },
    {
      label: 'Vehicle Constraint',
      value: 5,
      subtext: 'No currently compatible vehicle available.',
    },
  ]

  return (
    <div className="deferred-stat-cards-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="deferred-stat-card">
          <span className="deferred-card-label">{card.label}</span>
          <div className="deferred-card-value">{card.value}</div>
          <p className="deferred-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}
