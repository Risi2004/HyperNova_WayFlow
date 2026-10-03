export default function LiveMetricCards({ metrics }) {
  const cards = metrics ? [
    {
      label: 'Active Deliveries',
      value: metrics.active ?? 0,
      subtext: 'Currently on route',
    },
    {
      label: 'Completed',
      value: metrics.completed ?? 0,
      subtext: 'Finished today',
    },
    {
      label: 'Late Stops',
      value: metrics.lateStops ?? metrics.delayed ?? 0,
      subtext: metrics.delayed ? `${metrics.delayed} routes affected` : 'Behind reported ETA',
    },
    {
      label: 'Offline / Issues',
      value: (metrics.openIssues || 0) + (metrics.offlineRecords || 0),
      subtext: `${metrics.offlineRecords || 0} offline synced · ${metrics.openIssues || 0} issues`,
    },
  ] : [
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
