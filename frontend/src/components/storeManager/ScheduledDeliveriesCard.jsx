export default function ScheduledDeliveriesCard({
  deliveries = [],
}) {
  return (
    <div className="sm-scheduled-deliveries-card">
      <div className="sm-card-top-row">
        <div className="sm-card-title-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h3 className="sm-subcard-title">Scheduled Deliveries</h3>
        </div>
        <span className="sm-runs-count-meta">
          {deliveries.length} run{deliveries.length === 1 ? '' : 's'} scheduled
        </span>
      </div>

      <div className="sm-scheduled-list">
        {deliveries.length === 0 && (
          <p className="sm-empty-note">No deliveries scheduled. Orders show here once dispatch assigns them to a trip.</p>
        )}
        {deliveries.map((del) => (
          <div key={del.id} className="sm-scheduled-item-row">
            <div className="sm-item-left-block">
              <div className="sm-item-code-status-row">
                <span className="sm-item-order-id">{del.id}</span>
                <span className={`sm-item-status-pill ${del.statusType}`}>{del.status}</span>
              </div>
              <div className="sm-item-meta-sub">
                {del.location} &bull; {del.items} &bull; {del.trip}
              </div>
            </div>

            <div className="sm-item-right-block">
              <span className={`sm-item-time-title ${del.highlightTime ? 'accent-blue' : ''}`}>
                {del.timeText}
              </span>
              <span className={`sm-item-time-sub ${del.highlightTime ? 'arrival-countdown' : ''}`}>
                {del.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
