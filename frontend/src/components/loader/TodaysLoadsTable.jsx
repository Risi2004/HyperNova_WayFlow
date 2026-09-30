import { Link, useNavigate } from 'react-router-dom'

export default function TodaysLoadsTable() {
  const navigate = useNavigate()
  const loads = [
    {
      id: 'LD-024',
      vehicleNumber: 'WP-LOR-012',
      vehicleType: 'Lorry',
      route: 'Peliyagoda → Colombo North',
      departure: '05:30 AM',
      stops: '6 stops',
      loadedCount: 0,
      totalCount: 6,
      progressPercent: 0,
      status: 'AWAITING',
      statusType: 'awaiting',
      actionLabel: 'Start Loading',
      actionType: 'primary',
    },
    {
      id: 'LD-025',
      vehicleNumber: 'WP-REF-007',
      vehicleType: 'Refrigerated',
      route: 'Peliyagoda → Colombo South',
      departure: '06:00 AM',
      stops: '5 stops',
      loadedCount: 3,
      totalCount: 5,
      progressPercent: 60,
      status: 'LOADING',
      statusType: 'loading',
      actionLabel: 'Continue Loading',
      actionType: 'primary',
    },
    {
      id: 'LD-026',
      vehicleNumber: 'WP-VAN-004',
      vehicleType: 'Van',
      route: 'Peliyagoda → Mall Outlets',
      departure: '06:15 AM',
      stops: '4 stops',
      loadedCount: 4,
      totalCount: 4,
      progressPercent: 100,
      status: 'READY',
      statusType: 'ready',
      actionLabel: 'View Load',
      actionType: 'secondary',
    },
    {
      id: 'LD-027',
      vehicleNumber: 'WP-DRY-019',
      vehicleType: 'Dry Van',
      route: 'Peliyagoda → Negombo',
      departure: '06:30 AM',
      stops: '7 stops',
      loadedCount: 2,
      totalCount: 7,
      progressPercent: 28,
      status: 'ISSUE',
      statusType: 'issue',
      actionLabel: 'View Issue',
      actionType: 'issue',
    },
  ]

  return (
    <div className="loader-card todays-loads-card">
      {/* Card Header */}
      <div className="loader-card-header">
        <h2 className="loader-card-title">Today's Loads</h2>
        <p className="loader-card-subtitle">
          Vehicles scheduled for loading and departure today
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
                    onClick={() => {
                      if (load.actionType === 'issue' || load.statusType === 'issue') {
                        navigate(`/loader/today-loads/${load.id}/report-issue`)
                      } else {
                        navigate(`/loader/today-orders/${load.id}`)
                      }
                    }}
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
