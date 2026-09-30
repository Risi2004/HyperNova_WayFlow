export default function LiveRouteUpdatesCard({
  updates = [
    { id: 1, color: 'orange', text: 'Stop 05 delivery window begins at 11:30 AM' },
    { id: 2, color: 'blue', text: 'Dispatcher updated the route 8 minutes ago' },
    { id: 3, color: 'green', text: 'GPS Signal Stable' },
  ],
}) {
  return (
    <div className="driver-card live-route-updates-card">
      <div className="driver-card-header">
        <h3 className="driver-card-title">Live Route Updates</h3>
      </div>

      <div className="live-updates-list">
        {updates.map((item) => (
          <div key={item.id} className="live-update-item">
            <span className={`live-update-dot ${item.color}`} />
            <span className="live-update-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
