export default function OrderActivityTimeline() {
  const events = [
    {
      time: '08:42 AM',
      title: 'Order created',
      desc: 'by Store Manager',
      status: 'green',
    },
    {
      time: '08:45 AM',
      title: 'Order received',
      desc: 'by Dispatcher system',
      status: 'green',
    },
    {
      time: '09:05 AM',
      title: 'Order marked High Priority',
      desc: 'Planning attention requested',
      status: 'green',
    },
    {
      time: '09:15 AM',
      title: 'Order waiting for delivery planning',
      desc: 'No plan assigned yet',
      status: 'amber',
    },
  ]

  return (
    <div className="order-details-card activity-timeline-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Order Activity</h2>
        <span className="details-card-subtitle">Latest order events</span>
      </div>

      <div className="activity-timeline-list">
        {events.map((evt, idx) => (
          <div key={evt.title} className="timeline-item">
            <div className="timeline-time-col">{evt.time}</div>

            <div className="timeline-spine-col">
              <div className={`timeline-dot dot-${evt.status}`} />
              {idx < events.length - 1 && <div className="timeline-line" />}
            </div>

            <div className="timeline-content-col">
              <span className="timeline-event-title">{evt.title}</span>
              <span className="timeline-event-desc">{evt.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
