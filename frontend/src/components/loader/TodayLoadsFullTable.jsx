export default function TodayLoadsFullTable({ loads, onActionClick }) {
  return (
    <div className="today-loads-table-card">
      <div className="loader-table-responsive">
        <table className="today-loads-table">
          <thead>
            <tr>
              <th className="th-load-id">LOAD ID</th>
              <th className="th-vehicle">VEHICLE</th>
              <th className="th-route">ROUTE</th>
              <th className="th-departure">DEPARTURE</th>
              <th className="th-stops">STOPS</th>
              <th className="th-progress">LOADING PROGRESS</th>
              <th className="th-status">STATUS</th>
              <th className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loads.length === 0 ? (
              <tr>
                <td colSpan="8" className="td-empty">
                  No loads found matching the selected filters.
                </td>
              </tr>
            ) : (
              loads.map((load) => {
                // Determine progress color style
                let barClass = 'progress-bar-blue'
                if (load.statusType === 'issue') {
                  barClass = 'progress-bar-amber'
                } else if (load.statusType === 'ready') {
                  barClass = 'progress-bar-ready'
                }

                return (
                  <tr key={load.id} className="today-load-row">
                    {/* Load ID */}
                    <td className="td-load-id">
                      <button
                        type="button"
                        className="load-id-link"
                        onClick={() => onActionClick && onActionClick(load, 'view')}
                      >
                        {load.id}
                      </button>
                    </td>

                    {/* Vehicle */}
                    <td className="td-vehicle">
                      <div className="vehicle-cell">
                        <span className="vehicle-plate">{load.vehicleId}</span>
                        <span className="vehicle-type-label">{load.vehicleType}</span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="td-route">
                      <span className="route-name">{load.route}</span>
                    </td>

                    {/* Departure */}
                    <td className="td-departure">
                      <div className="departure-cell">
                        <span className="departure-time-val">{load.departureTime}</span>
                        {load.departureAlert && (
                          <span className="departure-alert-tag">{load.departureAlert}</span>
                        )}
                      </div>
                    </td>

                    {/* Stops */}
                    <td className="td-stops">
                      <span className="stops-count-text">{load.stops} stops</span>
                    </td>

                    {/* Loading Progress */}
                    <td className="td-progress">
                      <div className="progress-bar-cell">
                        <div className="progress-labels">
                          <span className="progress-fraction-text">
                            {load.loaded}/{load.totalStops} loaded
                          </span>
                          <span className="progress-percentage-text">
                            {load.progressPercent}%
                          </span>
                        </div>
                        <div className="progress-bar-track">
                          <div
                            className={`progress-bar-fill ${barClass}`}
                            style={{ width: `${load.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="td-status">
                      <div className="status-cell">
                        <span className={`status-badge badge-${load.statusType}`}>
                          <span className="status-badge-dot"></span>
                          <span>{load.status}</span>
                        </span>
                        {load.statusSubtext && (
                          <span className="status-subtext-warn">{load.statusSubtext}</span>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="td-action">
                      <button
                        type="button"
                        className={`btn-loader-action btn-${load.actionType}`}
                        onClick={() => onActionClick && onActionClick(load, load.actionType)}
                      >
                        {load.actionText}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

