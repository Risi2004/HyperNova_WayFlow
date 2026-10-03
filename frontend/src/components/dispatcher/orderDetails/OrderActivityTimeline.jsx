import { dispatchStatusOf, formatTimestamp } from '../../../utils/orderFormat'

// Turns an order_status_events row into a timeline entry.
function describe(evt) {
  const by = evt.actor_name ? `by ${evt.actor_name} (${evt.actor_role})` : `by ${evt.actor_role}`
  if (evt.from_status === evt.to_status && evt.to_status !== 'deferred') {
    return { title: evt.note || 'Order updated', desc: by, status: 'green' }
  }
  if (evt.from_status === 'deferred' && evt.to_status === 'deferred') {
    return { title: 'Deferred again', desc: evt.note ? `${evt.note} — ${by}` : by, status: 'amber' }
  }
  const label = evt.to_status === 'submitted' ? 'Order placed' : `Status → ${dispatchStatusOf(evt.to_status).label}`
  const amber = ['deferred', 'shortfall', 'failed', 'disputed', 'cancelled'].includes(evt.to_status)
  return {
    title: label,
    desc: evt.note ? `${evt.note} — ${by}` : by,
    status: amber ? 'amber' : 'green',
  }
}

export default function OrderActivityTimeline({ events = [] }) {
  // Newest first, so the latest decision is visible without scrolling.
  const items = [...events].reverse()

  return (
    <div className="order-details-card activity-timeline-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Order Activity</h2>
        <span className="details-card-subtitle">Every status change, who made it and why</span>
      </div>

      <div className="activity-timeline-list">
        {items.length === 0 && <span className="timeline-event-desc">No activity recorded yet.</span>}
        {items.map((evt, idx) => {
          const entry = describe(evt)
          const ts = formatTimestamp(evt.created_at)
          return (
            <div key={evt.event_id} className="timeline-item">
              <div className="timeline-time-col">
                {ts.time}
                <br />
                <span className="timeline-date">{ts.date}</span>
              </div>

              <div className="timeline-spine-col">
                <div className={`timeline-dot dot-${entry.status}`} />
                {idx < items.length - 1 && <div className="timeline-line" />}
              </div>

              <div className="timeline-content-col">
                <span className="timeline-event-title">{entry.title}</span>
                <span className="timeline-event-desc">{entry.desc}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
