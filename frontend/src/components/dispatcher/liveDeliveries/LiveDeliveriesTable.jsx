export default function LiveDeliveriesTable({ deliveries, totalCount, firstIndex, currentPage, totalPages, onPageChange, selected, onSelect }) {
  return (
    <div className="live-table-card">
      <div className="live-table-top-header">
        <div className="table-header-left">
          <h2 className="live-table-title">Trips</h2>
          <p className="live-table-subtitle">{totalCount} trip{totalCount === 1 ? '' : 's'} · in departure order</p>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="live-deliveries-grid-table">
          <thead>
            <tr>
              <th>TRIP</th>
              <th>VEHICLE</th>
              <th>DRIVER</th>
              <th>DEPARTS</th>
              <th>NEXT STOP</th>
              <th>PROGRESS</th>
              <th>ARRIVALS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 && (
              <tr>
                <td colSpan={9} className="td-driver">No trips match these filters.</td>
              </tr>
            )}
            {deliveries.map((del) => (
              <tr key={del.route} className={selected === del.route ? 'live-row-selected' : undefined}>
                <td className="td-route-id bold">{del.route}</td>
                <td className="td-vehicle bold">
                  {del.vehicle}
                  <div className="status-reason-subtext">{del.vehicleType}</div>
                </td>
                <td className="td-driver">{del.driver}</td>
                <td className="td-driver">{del.departure}</td>
                <td className="td-current-stop">{del.currentStop}</td>
                <td className="td-progress-cell">
                  <div className="progress-cell-group">
                    <div className="progress-labels-row">
                      <span className="stops-ratio bold">
                        {del.completedStops} / {del.totalStops} stops
                      </span>
                      <span className="percent-val bold">{del.percent}%</span>
                    </div>
                    <div className="live-progress-track">
                      <div
                        className={`live-progress-fill ${del.statusType === 'completed' ? 'fill-green' : del.statusType === 'problem' ? 'fill-red' : del.statusType === 'delayed' ? 'fill-amber' : 'fill-blue'}`}
                        style={{ width: `${del.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="td-eta bold">{del.eta}</td>
                <td className="td-status-cell">
                  <div className="status-cell-wrapper">
                    <span className={`status-pill-badge pill-${del.statusType}`}>
                      <span className="dot"></span>
                      {del.status.toUpperCase()}
                    </span>
                    {del.statusDetail && <span className="status-reason-subtext">{del.statusDetail}</span>}
                  </div>
                </td>
                <td className="td-action">
                  <button type="button" className="live-view-link" onClick={() => onSelect(selected === del.route ? null : del.route)}>
                    {selected === del.route ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="live-table-pagination-row">
        <span className="pagination-count-label">
          {totalCount ? `Showing ${firstIndex + 1}–${firstIndex + deliveries.length} of ${totalCount} trips` : 'No trips'}
        </span>

        <div className="pagination-buttons-group">
          <button type="button" className="btn-pagination-control" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </button>
          <span className="pagination-current-pill">
            {currentPage} / {totalPages}
          </span>
          <button type="button" className="btn-pagination-control" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
