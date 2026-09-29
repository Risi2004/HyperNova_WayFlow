export default function LiveMetricCards() {
  const cards = [
    {
      label: 'Active Deliveries',
      value: 18,
      subtext: 'Currently on route',
    },
    {
      label: 'Completed',
      value: 32,
      subtext: 'Finished today',
    },
    {
      label: 'Delayed',
      value: 4,
      subtext: 'Behind reported ETA',
    },
    {
      label: 'Problems',
      value: 2,
      subtext: 'Awaiting review',
    },
  ]

  return (
    <div className="live-metric-cards-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="live-metric-card">
          <span className="live-card-label">{card.label}</span>
          <div className="live-card-value">{card.value}</div>
          <p className="live-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}
