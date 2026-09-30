export default function DeliveryHistoryStatCards() {
  const cards = [
    {
      label: 'Completed Deliveries',
      value: '1,392',
      subtext: '96.3% success rate across all hubs.',
    },
    {
      label: 'On-Time Deliveries',
      value: '1,348',
      subtext: '96.8% SLA on-time arrival benchmark.',
    },
    {
      label: 'Returned / Exceptions',
      value: '36',
      subtext: '2.5% exception rate requiring review.',
    },
    {
      label: 'Avg Service Duration',
      value: '24 mins',
      subtext: 'Average dwell & unloading time per outlet.',
    },
  ]

  return (
    <div className="history-stat-cards-grid">
      {cards.map((card, idx) => (
        <div key={idx} className="history-stat-card">
          <span className="history-card-label">{card.label}</span>
          <div className="history-card-value">{card.value}</div>
          <p className="history-card-subtext">{card.subtext}</p>
        </div>
      ))}
    </div>
  )
}
