export default function PlannedStopSequenceCard({
  stops = [],
}) {
  return (
    <div className="loader-detail-card planned-sequence-card">
      <div className="detail-card-header">
        <h3 className="detail-card-title">Planned Stop Sequence</h3>
        <p className="detail-card-subtitle">
          Sequence items in strict reverse delivery order for LIFO vehicle packing
        </p>
      </div>

      <div className="stop-sequence-list">
        {stops.map((stop, idx) => {
          const isLast = idx === stops.length - 1
          return (
            <div key={stop.step} className="stop-sequence-item">
              {/* Left Timeline Indicator */}
              <div className="timeline-indicator-col">
                <div
                  className={`sequence-number-circle ${
                    stop.completed ? 'circle-active' : 'circle-pending'
                  }`}
                >
                  {stop.step}
                </div>
                {!isLast && (
                  <div
                    className={`timeline-vertical-line ${
                      stop.completed ? 'line-active' : 'line-pending'
                    }`}
                  />
                )}
              </div>

              {/* Middle Outlet Info */}
              <div className="stop-outlet-meta">
                <h4 className="stop-outlet-name">{stop.name}</h4>
                <p className="stop-outlet-info">{stop.outletInfo}</p>
              </div>

              {/* Right Time Window Badge */}
              <div className="stop-time-badge">
                {stop.timeWindow}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
