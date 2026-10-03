export default function UpcomingDeparturesCard({ departures = [] }) {

  return (
    <div className="loader-card upcoming-departures-card">
      <div className="loader-card-header">
        <h2 className="loader-card-title">Upcoming Departures</h2>
      </div>

      <div className="departures-timeline">
        <div className="timeline-vertical-guide" />
        <div className="departures-steps-list">
          {departures.map((item, idx) => (
            <div key={idx} className="departure-timeline-item">
              <div className="departure-left-col">
                <span className={`timeline-node-dot dot-${item.dotColor}`} />
                <div className="departure-meta">
                  <span className="departure-time bold">{item.time}</span>
                  <span className="departure-route-sub">{item.route}</span>
                </div>
              </div>

              <div className="departure-right-col">
                <span className={`loader-status-badge badge-${item.statusType}`}>
                  <span className="status-badge-dot" />
                  <span>{item.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
