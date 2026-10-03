import { useNavigate } from 'react-router-dom'

export default function TodaysLoadsTable({ loads = [] }) {
  const navigate = useNavigate()

  return (
    <div className="loader-card todays-loads-card">
      {/* Card Header */}
      <div className="loader-card-header">
        <h2 className="loader-card-title">Today's Loads</h2>
        <p className="loader-card-subtitle">
          Published trips for the next loading run
        </p>
      </div>

      {/* Table Container */}
      <div className="loader-table-responsive">
        <table className="loader-table">
          <thead>
            <tr>
              <th>LOAD ID</th>
              <th>VEHICLE</th>
              <th>ROUTE</th>
              <th>DEPARTURE</th>
              <th>STOPS</th>
              <th>LOADING PROGRESS</th>
              <th>STATUS</th>
              <th className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loads.map((load) => (
              <tr key={load.id}>
                {/* LOAD ID */}
                <td className="td-load-id">
                  <span
                    className="load-id-link"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/loader/today-orders/${load.id}`)}
                  >
                    {load.id}
                  </span>
                </td>

                {/* VEHICLE */}
                <td className="td-vehicle">
                  <div className="vehicle-info-cell">
                    <span className="vehicle-plate bold">{load.vehicleNumber}</span>
                    <span className="vehicle-type-sub">{load.vehicleType}</span>
                  </div>
                </td>

                {/* ROUTE */}
                <td className="td-route">
                  <span className="route-arrow-text">{load.route}</span>
                </td>

                {/* DEPARTURE */}
                <td className="td-departure">
                  <span className="departure-time-text">{load.departure}</span>
                </td>

                {/* STOPS */}
                <td className="td-stops">
                  <span className="stops-count-text">{load.stops}</span>
                </td>

                {/* LOADING PROGRESS */}
                <td className="td-progress">
                  <div className="loading-progress-cell">
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill fill-${load.statusType}`}
                        style={{ width: `${load.progressPercent}%` }}
                      />
                    </div>
                    <span className="progress-fraction-label">
                      {load.loadedCount} / {load.totalCount} loaded
                    </span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="td-status">
                  <span className={`loader-status-badge badge-${load.statusType}`}>
                    <span className="status-badge-dot" />
                    <span>{load.status}</span>
                  </span>
                </td>

                {/* ACTION */}
                <td className="td-action">
                  <button
                    type="button"
                    className={`btn-loader-action btn-${load.actionType}`}
                    onClick={() => navigate(`/loader/today-orders/${load.id}`)}
                  >
                    {load.actionLabel}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
