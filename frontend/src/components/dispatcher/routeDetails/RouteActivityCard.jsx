export default function RouteActivityCard() {
  const events = [
    { title: 'Route created by Dispatcher', time: '02:12 AM' },
    { title: 'Vehicle WP-CB-4521 assigned', time: '02:18 AM' },
    { title: '8 orders added to route', time: '02:21 AM' },
    { title: 'Route validation completed', time: '02:24 AM' },
    { title: 'Route marked Planned', time: '02:27 AM' },
  ]

  return (
    <div className="route-card route-activity-card">
      <div className="route-card-header">
        <h2 className="route-card-title">Route Activity</h2>
        <p className="route-card-subtitle">Latest planning events</p>
      </div>

      <div className="activity-timeline-list">
        {events.map((event, idx) => (
          <div key={idx} className="activity-event-item">
            <div className="activity-node-col">
              <span className="activity-blue-dot"></span>
              {idx < events.length - 1 && <span className="activity-vertical-line"></span>}
            </div>
            <div className="activity-event-content">
              <span className="activity-title">{event.title}</span>
              <span className="activity-time">{event.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
