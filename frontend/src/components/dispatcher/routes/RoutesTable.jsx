import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RoutesTable({ routes = [], onViewRoute }) {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="routes-table-wrapper">
      <div className="routes-table-scroll">
        <table className="routes-grid-table">
          <thead>
            <tr>
              <th>ROUTE ID</th>
              <th>STATUS</th>
              <th>DEPOT</th>
              <th>VEHICLE</th>
              <th>DRIVER</th>
              <th>TRIP</th>
              <th>STOPS</th>
              <th>DISTANCE</th>
              <th>ESTIMATED DURATION</th>
              <th>DEPARTURE</th>
              <th>PROGRESS</th>
              <th className="th-action-col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id}>
                {/* Route ID */}
                <td className="td-route-id">
                  <Link to={`/dispatcher/routes/${r.id}`} className="route-id-link">
                    {r.id}
                  </Link>
                </td>

                {/* Status */}
                <td className="td-route-status">
                  <div className="route-status-wrap">
                    <span className={`route-status-badge badge-${r.statusType}`}>
                      <span className="badge-bullet">•</span>
                      <span>{r.status}</span>
                    </span>
                    {r.statusSub && (
                      <span className="route-status-subtext">{r.statusSub}</span>
                    )}
                  </div>
                </td>

                {/* Depot */}
                <td className="td-route-depot">{r.depot}</td>

                {/* Vehicle */}
                <td className="td-route-vehicle">{r.vehicle}</td>

                {/* Driver */}
                <td className="td-route-driver">{r.driver}</td>

                {/* Trip */}
                <td className="td-route-trip">{r.trip}</td>

                {/* Stops */}
                <td className="td-route-stops">{r.stops}</td>

                {/* Distance */}
                <td className="td-route-dist">{r.distance}</td>

                {/* Duration */}
                <td className="td-route-dur">{r.duration}</td>

                {/* Departure */}
                <td className="td-route-dept">{r.departure}</td>

                {/* Progress */}
                <td className="td-route-prog">
                  <div className="prog-cell-group">
                    <div className="prog-text-row">
                      <span className="prog-label">{r.progressText}</span>
                      <span className={`prog-percentage ${r.progressPercent === 100 ? 'prog-green' : ''}`}>
                        {r.progressPercent}%
                      </span>
                    </div>

                    <div className="prog-track-bar">
                      <div
                        className={`prog-fill-bar ${r.progressPercent === 100 ? 'fill-green' : ''}`}
                        style={{ width: `${r.progressPercent}%` }}
                      ></div>
                    </div>

                    {r.progressSub && (
                      <span className="prog-sub-next">{r.progressSub}</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="td-action-col">
                  <button
                    type="button"
                    className="btn-view-route-link"
                    onClick={() => onViewRoute && onViewRoute(r)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="routes-pagination-row">
        <span className="routes-showing-text">Showing 5 of 24 routes</span>
        <div className="routes-page-btn-group">
          <button
            type="button"
            className="routes-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="routes-current-page-tag">1 / 5</span>
          <button
            type="button"
            className="routes-nav-btn"
            disabled={currentPage === 5}
            onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
