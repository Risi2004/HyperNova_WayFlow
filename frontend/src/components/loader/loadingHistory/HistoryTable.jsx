import { useNavigate } from 'react-router-dom'

export default function HistoryTable({ loads = [] }) {
  const navigate = useNavigate()

  return (
    <div className="history-table-card">
      <div className="history-table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>LOAD ID</th>
              <th>VEHICLE</th>
              <th>ROUTE</th>
              <th>LOADING DATE</th>
              <th>DEPARTURE</th>
              <th>DURATION</th>
              <th>ITEMS</th>
              <th>STATUS</th>
              <th>ISSUES</th>
              <th className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loads.length === 0 ? (
              <tr>
                <td colSpan="10" className="history-td-empty">
                  No loading history records found.
                </td>
              </tr>
            ) : (
              loads.map((row) => (
                <tr key={row.id} className="history-row">
                  {/* LOAD ID */}
                  <td className="td-load-id">
                    <button
                      type="button"
                      className="history-id-link"
                      onClick={() => navigate(`/loader/today-orders/${row.id}`)}
                    >
                      {row.id}
                    </button>
                  </td>

                  {/* VEHICLE */}
                  <td className="td-vehicle">
                    <div className="history-vehicle-cell">
                      <span className="history-vehicle-plate bold">{row.vehicleId}</span>
                      <span className="history-vehicle-type">{row.vehicleType}</span>
                    </div>
                  </td>

                  {/* ROUTE */}
                  <td className="td-route">
                    <span className="history-route-text">{row.route}</span>
                  </td>

                  {/* LOADING DATE */}
                  <td className="td-date">
                    <span className="history-date-text">{row.loadingDate}</span>
                  </td>

                  {/* DEPARTURE */}
                  <td className="td-departure">
                    <span className="history-dep-text">{row.departure}</span>
                  </td>

                  {/* DURATION */}
                  <td className="td-duration">
                    <span className="history-dur-text">{row.duration}</span>
                  </td>

                  {/* ITEMS */}
                  <td className="td-items">
                    <span className="history-items-text">{row.items}</span>
                  </td>

                  {/* STATUS */}
                  <td className="td-status">
                    <span
                      className={`history-status-pill ${
                        row.statusType === 'issue' ? 'pill-issue' : 'pill-completed'
                      }`}
                    >
                      <span className="status-dot-circle" />
                      <span>{row.status}</span>
                    </span>
                  </td>

                  {/* ISSUES */}
                  <td className="td-issues">
                    <span
                      className={`history-issue-text ${
                        row.issues !== 'None' ? 'has-issue' : 'no-issue'
                      }`}
                    >
                      {row.issues}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="td-action">
                    <button
                      type="button"
                      className="btn-history-view"
                      onClick={() => navigate(`/loader/today-orders/${row.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
