export default function PlannedStopSequenceCard({
  stops = [
    {
      step: 1,
      name: 'Waypoint Fresh — Colombo 03',
      outletInfo: 'Outlet ID: OUT-018 · Colombo 03 District',
      timeWindow: '05:30 - 07:00 AM',
      completed: true,
    },
    {
      step: 2,
      name: 'Waypoint Style — Bambalapitiya',
      outletInfo: 'Outlet ID: OUT-024 · Galle Road, Bamba',
      timeWindow: '06:00 - 08:00 AM',
      completed: true,
    },
    {
      step: 3,
      name: 'Waypoint Tech — Wellawatte',
      outletInfo: 'Outlet ID: OUT-031 · Highlevel Rd, Wellawatte',
      timeWindow: '06:30 - 09:00 AM',
      completed: true,
    },
    {
      step: 4,
      name: 'Waypoint Fresh — Dehiwala',
      outletInfo: 'Outlet ID: OUT-042 · Hill Street Junction',
      timeWindow: '07:00 - 09:30 AM',
      completed: false,
    },
    {
      step: 5,
      name: 'Waypoint Fresh — Mount Lavinia',
      outletInfo: 'Outlet ID: OUT-051 · Hotel Road Coastal',
      timeWindow: '07:30 - 10:00 AM',
      completed: false,
    },
  ],
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
