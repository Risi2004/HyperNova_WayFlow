export default function FleetMetricCards() {
  const cards = [
    { label: 'Total Vehicles', value: 60, theme: 'default' },
    { label: 'Available', value: 18, theme: 'green' },
    { label: 'Assigned', value: 31, theme: 'blue' },
    { label: 'Loading', value: 7, theme: 'amber' },
    { label: 'In Transit', value: 12, theme: 'blue' },
    { label: 'Maintenance', value: 2, theme: 'red' },
    { label: 'Refrigerated Available', value: 6, theme: 'green' },
  ]

  return (
    <div className="fleet-metrics-grid">
      {cards.map((card, idx) => (
        <div key={idx} className={`fleet-metric-card card-theme-${card.theme}`}>
          <span className="fleet-metric-label">{card.label}</span>
          <span className="fleet-metric-value">{card.value}</span>
        </div>
      ))}
    </div>
  )
}
