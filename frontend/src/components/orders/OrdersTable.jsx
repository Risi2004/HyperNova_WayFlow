import { Link, useNavigate } from 'react-router-dom'

export default function OrdersTable({
  orders,
  selectedOrderIds,
  onToggleSelectOrder,
  onToggleSelectAll,
  onViewOrder,
}) {
  const navigate = useNavigate()
  const allSelected = orders.length > 0 && orders.every((o) => selectedOrderIds.includes(o.id))

  return (
    <div className="orders-table-wrapper">
      {/* Table Header Bar */}
      <div className="orders-table-top-bar">
        <div className="table-title-group">
          <h2 className="table-main-title">All Orders</h2>
          <span className="table-count-badge">86 total</span>
        </div>
        <div className="table-sort-group">
          <span>Sorted by newest order</span>
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
              <th>ORDER DATE</th>
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
                    <span className={`status-tag tag-${ord.statusType}`}>
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
                    <button type="button" className="btn-action-more">
                      More
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="orders-pagination-bar">
        <div className="pagination-info">
          Showing 1–20 of 86 orders
        </div>

        <div className="pagination-pages">
          <button type="button" className="pagination-btn" disabled>
            Previous
          </button>
          <button type="button" className="pagination-page-number active">
            1
          </button>
          <button type="button" className="pagination-page-number">
            2
          </button>
          <button type="button" className="pagination-page-number">
            3
          </button>
          <span className="pagination-ellipsis">...</span>
          <button type="button" className="pagination-btn">
            Next
          </button>
        </div>

        <div className="pagination-size-select">
          <select defaultValue="20">
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  )
}
