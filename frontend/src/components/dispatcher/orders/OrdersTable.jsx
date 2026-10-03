import { Link, useNavigate } from 'react-router-dom'

// Page numbers to show: first, last, and a window around the current page.
function pageList(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
}

export default function OrdersTable({
  orders,
  selectedOrderIds,
  onToggleSelectOrder,
  onToggleSelectAll,
  onViewOrder,
  pagination = { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  onClearFilters,
}) {
  const navigate = useNavigate()
  const allSelected = orders.length > 0 && orders.every((o) => selectedOrderIds.includes(o.id))
  const { page, pageSize, total, totalPages } = pagination
  const firstShown = total === 0 ? 0 : (page - 1) * pageSize + 1
  const lastShown = Math.min(page * pageSize, total)
  const pages = pageList(page, totalPages)

  return (
    <div className="orders-table-wrapper">
      {/* Table Header Bar */}
      <div className="orders-table-top-bar">
        <div className="table-title-group">
          <h2 className="table-main-title">All Orders</h2>
          <span className="table-count-badge">{total} total</span>
        </div>
        <div className="table-sort-group">
          <span>{isLoading ? 'Refreshing…' : 'Sorted by newest order'}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Table Element */}
      <div className="orders-table-scroll">
        <table className="orders-grid-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  aria-label="Select all orders"
                />
              </th>
              <th>ORDER ID</th>
              <th>OUTLET</th>
              <th>BRAND</th>
              <th>DELIVERY DATE</th>
              <th>DELIVERY WINDOW</th>
              <th>WEIGHT</th>
              <th>VOLUME</th>
              <th>REQUIREMENTS</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>ASSIGNED VEHICLE</th>
              <th className="th-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => {
              const isChecked = selectedOrderIds.includes(ord.id)

              return (
                <tr key={ord.id} className={isChecked ? 'row-selected' : ''}>
                  <td className="td-checkbox">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectOrder(ord.id)}
                      aria-label={`Select order ${ord.id}`}
                    />
                  </td>
                  <td className="td-order-id">
                    <Link to={`/dispatcher/orders/${ord.id}`} className="order-id-link">
                      {ord.id}
                    </Link>
                  </td>
                  <td className="td-outlet">{ord.outlet}</td>
                  <td className="td-brand">{ord.brand}</td>
                  <td className="td-date">{ord.date}</td>
                  <td className={`td-window ${ord.isUrgentWindow ? 'window-urgent' : ''}`}>
                    {ord.window}
                  </td>
                  <td className="td-weight">{ord.weight}</td>
                  <td className="td-volume">{ord.volume}</td>
                  <td>
                    <span className={`requirement-tag tag-${ord.requirementType}`}>
                      {ord.requirement}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-tag tag-${ord.priorityType}`}>
                      {ord.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-tag tag-${ord.statusType}`} title={ord.statusDetail || undefined}>
                      {ord.status}
                    </span>
                  </td>
                  <td className={`td-vehicle ${ord.vehicle !== 'Not Assigned' ? 'vehicle-assigned' : ''}`}>
                    {ord.vehicle}
                  </td>
                  <td className="td-actions">
                    <button
                      type="button"
                      className="btn-action-view"
                      onClick={() => {
                        if (onViewOrder) {
                          onViewOrder(ord)
                        } else {
                          navigate(`/dispatcher/orders/${ord.id}`)
                        }
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              )
            })}

            {orders.length === 0 && !isLoading && (
              <tr>
                <td colSpan="13" className="orders-empty-cell">
                  <div className="empty-state-content">
                    <h4 className="empty-title">No orders found</h4>
                    <p className="empty-desc">Try changing your filters or search criteria.</p>
                    <button type="button" className="empty-clear-btn" onClick={onClearFilters}>
                      Clear Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="orders-pagination-bar">
        <div className="pagination-info">
          Showing {firstShown}–{lastShown} of {total} orders
        </div>

        <div className="pagination-pages">
          <button
            type="button"
            className="pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          {pages.map((p, i) => (
            <span key={p} className="pagination-page-group">
              {i > 0 && p - pages[i - 1] > 1 && <span className="pagination-ellipsis">...</span>}
              <button
                type="button"
                className={`pagination-page-number ${p === page ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            </span>
          ))}
          <button
            type="button"
            className="pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>

        <div className="pagination-size-select">
          <select value={String(pageSize)} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  )
}
