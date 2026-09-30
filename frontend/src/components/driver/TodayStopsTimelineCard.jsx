export default function TodayStopsTimelineCard({
  stops = [
    {
      id: 1,
      stopNumber: '01',
      name: 'Waypoint Fresh',
      location: 'Colombo 03',
      time: '08:30 AM',
      status: 'completed',
    },
    {
      id: 2,
      stopNumber: '02',
      name: 'Waypoint Style',
      location: 'Bambalapitiya',
      time: '08:45 AM',
      status: 'completed',
    },
    {
      id: 3,
      stopNumber: '03',
      name: 'Waypoint Tech',
      location: 'Wellawatte',
      time: '09:15 AM',
      status: 'completed',
    },
    {
      id: 4,
      stopNumber: '04',
      name: 'Waypoint Fresh',
      location: 'Dehiwala',
      time: '09:50 AM',
      status: 'completed',
    },
    {
      id: 5,
      stopNumber: '05',
      name: 'Waypoint Fresh',
      location: 'Colombo 04',
      time: '10:42 AM',
      status: 'current',
    },
    {
      id: 6,
      stopNumber: '06',
      name: 'Waypoint Fresh',
      location: 'Mount Lavinia',
      time: '--:--',
      status: 'upcoming',
    },
    {
      id: 7,
      stopNumber: '07',
      name: 'Waypoint Market',
      location: 'Moratuwa',
      time: '--:--',
      status: 'upcoming',
    },
    {
      id: 8,
      stopNumber: '08',
      name: 'Waypoint Fresh',
      location: 'Panadura',
      time: '--:--',
      status: 'upcoming',
    },
  ],
  onSelectStop,
}) {
  return (
    <div className="driver-card today-stops-timeline-card">
      <div className="driver-card-header">
        <h3 className="driver-card-title">Today's Stops</h3>
      </div>

      <div className="stops-timeline-container">
        {stops.map((stop, index) => {
          const isCurrent = stop.status === 'current'
          const isCompleted = stop.status === 'completed'
          const isLast = index === stops.length - 1

          return (
            <div
              key={stop.id}
              className={`timeline-stop-row ${stop.status}`}
              onClick={() => onSelectStop && onSelectStop(stop)}
            >
              {/* Timeline Track & Node */}
              <div className="timeline-track-col">
                <div className={`timeline-node-dot ${stop.status}`}>
                  {isCompleted && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {isCurrent && <span className="current-inner-dot" />}
                </div>
                {!isLast && (
                  <div
                    className={`timeline-connector-line ${
                      isCompleted ? 'line-completed' : isCurrent ? 'line-current' : 'line-upcoming'
                    }`}
                  />
                )}
              </div>

              {/* Stop Info Column */}
              <div className="timeline-info-col">
                <div className="timeline-stop-headline">
                  <span className={`stop-number-name ${isCurrent ? 'current-highlight' : ''}`}>
                    {stop.stopNumber} • {stop.name}
                  </span>
                </div>
                <span className="stop-location-text">{stop.location}</span>
              </div>

              {/* Timing & Badge Column */}
              <div className="timeline-status-col">
                <span className="stop-timing-text">{stop.time}</span>
                {isCompleted && (
                  <span className="stop-badge green">
                    <span className="badge-bullet-green" />
                    <span>Completed</span>
                  </span>
                )}
                {isCurrent && (
                  <span className="stop-badge blue">
                    <span className="badge-bullet-blue" />
                    <span>Current</span>
                  </span>
                )}
                {stop.status === 'upcoming' && (
                  <span className="stop-badge grey">
                    <span>Upcoming</span>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
