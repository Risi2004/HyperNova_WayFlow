export default function DeferredStatCards({ stats }) {
  const cards = stats ? [
    {
      label: 'Deferred Total',
      value: stats.total ?? 0,
      subtext: `${stats.total ?? 0} orders require rescheduling or next-run dispatch.`,
    },
    {
      label: 'Consecutive Deferred',
      value: stats.consecutive ?? 0,
      subtext: 'Skipped more than once — top operational priority.',
    },
    {
      label: 'Capacity Related',
      value: stats.capacity ?? 0,
      subtext: 'Weight, volume, or refrigerated space constrained.',
    },
    {
      label: 'Access / Windows',
      value: stats.vehicle ?? 0,
      subtext: 'Van-only access or tight delivery window limits.',
    },
  ] : [
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
