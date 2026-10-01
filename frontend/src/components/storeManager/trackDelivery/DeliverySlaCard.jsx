export default function DeliverySlaCard({
  targetDate = 'Today, 29 Sep 2026',
  bookedWindow = '10:30 – 11:00 AM',
  estimatedArrival = '10:45 AM',
  simState = 'in_delivery',
}) {
  const isDelayed = simState === 'delayed'

  return (
    <div className="td-sla-card">
      <div className="td-sla-header">
        <h4 className="td-sla-title">DELIVERY SLA &amp; SCHEDULE</h4>
        <button
          type="button"
          className="btn-sla-info"
          title="SLA calculation and traffic feeds"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>

      <div className="td-sla-list">
        <div className="td-sla-row">
          <span className="td-sla-label">Target Date:</span>
          <span className="td-sla-val">{targetDate}</span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">Booked Delivery Window:</span>
          <span className="td-sla-val">{bookedWindow}</span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">Estimated Arrival:</span>
          <span className={`td-sla-val bold ${isDelayed ? 'red' : 'blue'}`}>
            {isDelayed ? '11:20 AM' : estimatedArrival}
          </span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">SLA Compliance:</span>
          <span className={`td-sla-compliance-pill ${isDelayed ? 'delayed' : 'on-time'}`}>
            {isDelayed ? 'Delayed (+35m)' : 'Standard SLA (On-Time)'}
          </span>
        </div>
      </div>

      <div className="td-sla-notice-box">
        <p>
          Delivery estimates recalculate continuously using real-time GPS coordinates, vehicle weight data, and metropolitan traffic feeds.
        </p>
      </div>
    </div>
  )
}
