export default function LiveMetricCards({ metrics, total }) {
  const cards = [
    { label: 'On the Road', value: metrics.active, subtext: `of ${total} published trips` },
    { label: 'Completed', value: metrics.completed, subtext: 'All stops recorded' },
    { label: 'Late Stops', value: metrics.lateStops, subtext: `${metrics.delayed} trip${metrics.delayed === 1 ? '' : 's'} affected` },
    { label: 'Issues / Offline', value: metrics.openIssues, subtext: `${metrics.openIssues} open issue${metrics.openIssues === 1 ? '' : 's'} · ${metrics.offlineRecords} synced from offline` },
  ]

  return (
    <div className="live-metric-cards-grid">
      {cards.map((card) => (
        <div key={card.label} className="live-metric-card">
          <span className="live-card-label">{card.label}</span>
          <div className="live-card-value">{card.value ?? 0}</div>
          <p className="live-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}
