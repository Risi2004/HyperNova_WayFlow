import { Link } from 'react-router-dom'

export default function LiveDeliveriesTable({
  deliveries = [],
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) {
  return (
    <div className="live-table-card">
      <div className="live-table-top-header">
        <div className="table-header-left">
          <h2 className="live-table-title">Today's Deliveries</h2>
          <p className="live-table-subtitle">
            56 deliveries Â· Sorted by operational priority
          </p>
        </div>
        <div className="table-refreshed-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Refreshed just now</span>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="live-deliveries-grid-table">
          <thead>
            <tr>
              <th>ROUTE</th>
              <th>VEHICLE</th>
              <th>DRIVER</th>
              <th>STOPS</th>
              <th>CURRENT STOP</th>
              <th>PROGRESS</th>
              <th>ETA</th>
              <th>STATUS</th>
              <th>LAST UPDATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((del) => (
              <tr key={del.route}>
                <td className="td-route-id bold">
                  <Link to={`/dispatcher/routes/${del.route}`} className="blue-table-link">
                    {del.route}
                  </Link>
                </td>
                <td className="td-vehicle bold">{del.vehicle}</td>
                <td className="td-driver">{del.driver}</td>
                <td className="td-stops">{del.stops}</td>
                <td className="td-current-stop">{del.currentStop}</td>
                <td className="td-progress-cell">
                  <div className="progress-cell-group">
                    <div className="progress-labels-row">
                      <span className="stops-ratio bold">{del.completedStops} / {del.totalStops} stops</span>
                      <span className="percent-val bold">{del.percent}%</span>
                    </div>
                    <div className="live-progress-track">
                      <div
                        className={`live-progress-fill ${del.statusType === 'completed' ? 'fill-green' : del.statusType === 'problem' ? 'fill-red' : del.statusType === 'delayed' ? 'fill-amber' : 'fill-blue'}`}
                        style={{ width: `${del.percent}%` }}
                      ></div>
                    </div>
                    <span className="remaining-stops-subtext">
                      {del.subProgress || `Completed ${del.completedStops} | Remaining ${del.totalStops - del.completedStops}`}
                    </span>
                  </div>
                </td>
                <td className="td-eta bold">{del.eta}</td>
                <td className="td-status-cell">
                  <div className="status-cell-wrapper">
                    <span className={`status-pill-badge pill-${del.statusType}`}>
                      <span className="dot"></span>
                      {del.status.toUpperCase()}
                    </span>
                    {del.statusDetail && (
                      <span className="status-reason-subtext">{del.statusDetail}</span>
                    )}
                  </div>
                </td>
                <td className="td-last-update">{del.lastUpdate}</td>
                <td className="td-action">
                  <Link to={`/dispatcher/routes/${del.route}`} className="live-view-link">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="live-table-pagination-row">
        <span className="pagination-count-label">
          Showing 1-{deliveries.length} of 56 deliveries
        </span>

        <div className="pagination-buttons-group">
          <button
            type="button"
            className="btn-pagination-control"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span className="pagination-current-pill">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className="btn-pagination-control"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
