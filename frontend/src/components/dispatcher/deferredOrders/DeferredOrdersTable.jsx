import { Link } from 'react-router-dom'

export default function DeferredOrdersTable({
  orders = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  currentPage = 1,
  totalPages = 2,
  onPageChange,
}) {
  const isAllChecked = orders.length > 0 && orders.every((o) => selectedIds.includes(o.id))

  return (
    <div className="deferred-table-card">
      <div className="deferred-table-header-row">
        <h2 className="deferred-table-title">
          Deferred Orders — Saturday, 26 September
        </h2>
        <div className="table-sort-meta">
          <span>{orders.length} orders · Most recent deferral first</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 15 12 20 17 15" />
            <polyline points="7 9 12 4 17 9" />
          </svg>
        </div>
      </div>

      <div className="table-responsive-container">
        <table className="deferred-orders-grid-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={isAllChecked}
                  onChange={onToggleSelectAll}
                  className="deferred-custom-checkbox"
                />
              </th>
              <th>ORDER ID</th>
              <th>OUTLET</th>
              <th>BRAND</th>
              <th>ORDER VALUE</th>
              <th>WEIGHT</th>
              <th>VOLUME</th>
              <th>DELIVERY WINDOW</th>
              <th>DEPOT</th>
              <th>DEFERRAL REASON</th>
              <th>NEXT RUN</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isChecked = selectedIds.includes(order.id)
              return (
                <tr
                  key={order.id}
                  className={isChecked ? 'row-selected-highlight' : ''}
                >
                  <td className="td-checkbox">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelect(order.id)}
                      className="deferred-custom-checkbox"
                    />
                  </td>
                  <td className="td-order-id bold">
                    <Link
                      to={`/dispatcher/orders/${order.id}`}
                      className="blue-table-link"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="td-outlet bold">{order.outlet}</td>
                  <td className="td-brand">{order.brand}</td>
                  <td className="td-order-val bold">{order.orderValue}</td>
                  <td className="td-weight">{order.weight}</td>
                  <td className="td-volume">{order.volume}</td>
                  <td className="td-window">{order.window}</td>
                  <td className="td-depot">{order.depot}</td>
                  <td className="td-deferral-reason">
                    <div className="reason-text-cell">
                      <span className="reason-primary-title">
                        {order.reasonTitle}
                      </span>
                      <span className="reason-secondary-desc">
                        {order.reasonSub}
                      </span>
                    </div>
                  </td>
                  <td className="td-next-run">{order.nextRun}</td>
                  <td className="td-status">
                    <span className="status-pill-badge pill-deferred">
                      <span className="dot"></span>
                      Deferred
                    </span>
                  </td>
                  <td className="td-action">
                    <Link
                      to={`/dispatcher/orders/${order.id}`}
                      className="table-action-view-btn"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="deferred-table-pagination-row">
        <span className="pagination-count-label">
          Showing 1-{orders.length} of 12 deferred orders
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
