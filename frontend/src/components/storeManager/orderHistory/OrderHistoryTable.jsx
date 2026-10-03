export default function OrderHistoryTable({
  orders,
  onViewOrder,
  currentPage = 1,
  totalPages = 1,
  totalOrders = 0,
  onPageChange,
}) {
  return (
    <div className="oh-table-card">
      <div className="oh-table-wrapper">
        <table className="oh-table">
          <thead>
            <tr>
              <th className="th-order-id">ORDER ID</th>
              <th className="th-order-date">ORDER DATE</th>
              <th className="th-del-date">DELIVERY DATE</th>
              <th className="th-items">ITEMS &amp; VOLUME</th>
              <th className="th-type">DELIVERY TYPE</th>
              <th className="th-status">STATUS</th>
              <th className="th-receipt">RECEIPT STATUS</th>
              <th className="th-action text-right">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="oh-empty-cell">
                  <div className="oh-empty-state">
                    <p>No historical orders match the selected filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((row) => (
                <tr key={row.id} className="oh-table-row">
                  {/* Order ID */}
                  <td className="td-order-id">
                    <button
                      type="button"
                      className="btn-oh-order-link"
                      onClick={() => onViewOrder(row)}
                    >
                      {row.id}
                    </button>
                  </td>

                  {/* Order Date */}
                  <td className="td-order-date">
                    <span className="oh-date-text">{row.orderDate}</span>
                  </td>

                  {/* Delivery Date */}
                  <td className="td-del-date">
                    <span className="oh-date-text">{row.deliveryDate}</span>
                  </td>

                  {/* Items & Volume */}
                  <td className="td-items">
                    <span className="oh-items-text">{row.itemsVolume}</span>
                  </td>

                  {/* Delivery Type */}
                  <td className="td-type">
                    <span className={`oh-del-type-badge ${row.deliveryType.toLowerCase()}`}>
                      {row.deliveryType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="td-status">
                    <span className={`oh-status-pill ${row.status.toLowerCase()}`}>
                      {row.status === 'Completed' ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Completed</span>
                        </>
                      ) : row.status === 'Cancelled' ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          <span>Cancelled</span>
                        </>
                      ) : (
                        <span>{row.status}</span>
                      )}
                    </span>
                  </td>

                  {/* Receipt Status */}
                  <td className="td-receipt">
                    {row.receiptStatus === 'Confirmed' ? (
                      <span className="oh-receipt-confirmed">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Confirmed</span>
                      </span>
                    ) : (
                      <span className="oh-receipt-unconfirmed">Not Confirmed</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="td-action text-right">
                    <button
                      type="button"
                      className="btn-oh-view"
                      onClick={() => onViewOrder(row)}
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

      {/* Pagination Footer */}
      <div className="oh-pagination-bar">
        <div className="oh-pagination-left">
          {totalOrders === 0
            ? 'No orders match these filters'
            : `Showing ${(currentPage - 1) * 10 + 1}-${(currentPage - 1) * 10 + orders.length} of ${totalOrders} orders`}
        </div>

        <div className="oh-pagination-controls">
          <button
            type="button"
            className="btn-oh-page-nav"
            disabled={currentPage === 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
            .map((n, i, shown) => (
              <span key={n} className="oh-page-group">
                {i > 0 && n - shown[i - 1] > 1 && <span className="oh-page-dots">...</span>}
                <button
                  type="button"
                  className={`btn-oh-page-num ${currentPage === n ? 'active' : ''}`}
                  onClick={() => onPageChange && onPageChange(n)}
                >
                  {n}
                </button>
              </span>
            ))}

          <button
            type="button"
            className="btn-oh-page-nav"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
