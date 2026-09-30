import { Link } from 'react-router-dom'

export default function DeliveryHistoryTable({
  deliveries = [],
  currentPage = 1,
  totalPages = 145,
  onPageChange,
}) {
  return (
    <div className="history-table-card">
      <div className="history-table-header-row">
        <div>
          <h2 className="history-table-title">Historical Delivery Records</h2>
          <p className="history-table-subtitle">
            Showing historical delivery confirmations and proof of delivery audits
          </p>
        </div>
        <div className="history-records-count">
          <span>{deliveries.length} records shown</span>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="delivery-history-grid-table">
          <thead>
            <tr>
              <th>DELIVERY ID</th>
              <th>ORDER ID</th>
              <th>OUTLET</th>
              <th>COMPLETED AT</th>
              <th>DRIVER</th>
              <th>VEHICLE</th>
              <th>DEPOT</th>
              <th>DURATION</th>
              <th>POD PROOF</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((item) => (
              <tr key={item.id}>
                <td className="td-delivery-id bold">
                  <Link
                    to={`/dispatcher/delivery-history/${item.id}`}
                    className="blue-table-link"
                  >
                    {item.id}
                  </Link>
                </td>
                <td className="td-order-id">
                  <Link
                    to={`/dispatcher/orders/${item.orderId}`}
                    className="blue-table-link"
                  >
                    {item.orderId}
                  </Link>
                </td>
                <td className="td-outlet">
                  <div className="outlet-name-meta">
                    <span className="bold">{item.outletCode}</span>
                    <span className="outlet-subname">{item.outletName}</span>
                  </div>
                </td>
                <td className="td-timestamp">{item.completedAt}</td>
                <td className="td-driver">{item.driver}</td>
                <td className="td-vehicle bold">{item.vehicle}</td>
                <td className="td-depot">{item.depot}</td>
                <td className="td-duration">{item.duration}</td>
                <td className="td-pod-badge">
                  <span className="pod-proof-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item.podType || 'Sign + Photo'}</span>
                  </span>
                </td>
                <td className="td-status">
                  <span className={`status-pill-badge pill-${item.statusType}`}>
                    <span className="dot"></span>
                    {item.status}
                  </span>
                </td>
                <td className="td-action">
                  <Link
                    to={`/dispatcher/delivery-history/${item.id}`}
                    className="history-view-btn"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="history-table-pagination-row">
        <span className="pagination-count-label">
          Showing 1-{deliveries.length} of 1,446 historical deliveries
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
