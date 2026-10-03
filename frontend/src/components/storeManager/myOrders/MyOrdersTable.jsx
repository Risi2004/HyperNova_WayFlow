import { useState } from 'react'

export default function MyOrdersTable({
  orders = [],
  onViewOrder,
  onTrackOrder,
  onViewReceipt,
  selectedOrderIds = [],
  setSelectedOrderIds,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrderIds(orders.map((o) => o.id))
    } else {
      setSelectedOrderIds([])
    }
  }

  // Handle select single
  const handleSelectRow = (id) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id))
    } else {
      setSelectedOrderIds([...selectedOrderIds, id])
    }
  }

  const allSelected = orders.length > 0 && selectedOrderIds.length === orders.length

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize))
  const page = Math.min(currentPage, totalPages)
  const pageOrders = orders.slice((page - 1) * pageSize, page * pageSize)
  const firstShown = orders.length === 0 ? 0 : (page - 1) * pageSize + 1
  const lastShown = Math.min(page * pageSize, orders.length)

  const getStatusBadge = (order) => {
    switch (order.status) {
      case 'IN_DELIVERY':
        return (
          <div className="mo-status-col">
            <span className="mo-badge-pill in-delivery">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>In Delivery</span>
            </span>
            {order.statusSub && <span className="mo-status-sub blue">{order.statusSub}</span>}
          </div>
        )
      case 'SCHEDULED':
        return (
          <div className="mo-status-col">
            <span className="mo-badge-pill scheduled">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Scheduled</span>
            </span>
            {order.statusSub && <span className="mo-status-sub">{order.statusSub}</span>}
          </div>
        )
      case 'CONFIRMED':
        return (
          <div className="mo-status-col">
            <span className="mo-badge-pill confirmed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Confirmed</span>
            </span>
            {order.statusSub && <span className="mo-status-sub">{order.statusSub}</span>}
          </div>
        )
      case 'PENDING':
        return (
          <div className="mo-status-col">
            <span className="mo-badge-pill pending">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Pending</span>
            </span>
            {order.statusSub && <span className="mo-status-sub">{order.statusSub}</span>}
          </div>
        )
      case 'DEFERRED':
        return (
          <div className="mo-status-col">
            <span className="mo-badge-pill deferred">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Deferred</span>
            </span>
            {order.statusSub && <span className="mo-status-sub red">{order.statusSub}</span>}
          </div>
        )
      case 'COMPLETED':
        return (
          <div className="mo-status-col">
            <span className="mo-status-completed-text">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Completed</span>
            </span>
            {order.statusSub && <span className="mo-status-sub">{order.statusSub}</span>}
          </div>
        )
      default:
        return <span className="mo-badge-pill default">{order.status}</span>
    }
  }

  return (
    <div className="mo-table-wrapper">
      <table className="mo-orders-table">
        <thead>
          <tr>
            <th className="th-checkbox">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                aria-label="Select all orders"
              />
            </th>
            <th className="th-order-id">ORDER ID &amp; PRIORITY</th>
            <th className="th-placed-date">PLACED DATE</th>
            <th className="th-payload">ITEMS &amp; PAYLOAD</th>
            <th className="th-req-date">REQUESTED DATE</th>
            <th className="th-window">DELIVERY WINDOW</th>
            <th className="th-status">STATUS</th>
            <th className="th-actions">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {pageOrders.map((order) => {
            const isRowChecked = selectedOrderIds.includes(order.id)
            return (
              <tr key={order.id} className={`mo-table-row ${isRowChecked ? 'selected' : ''}`}>
                {/* 1. Checkbox */}
                <td className="td-checkbox">
                  <input
                    type="checkbox"
                    checked={isRowChecked}
                    onChange={() => handleSelectRow(order.id)}
                    aria-label={`Select order ${order.id}`}
                  />
                </td>

                {/* 2. Order ID & Priority */}
                <td className="td-order-id">
                  <div className="mo-order-id-group">
                    <div className="mo-id-badge-row">
                      <span
                        className="mo-order-code-link"
                        onClick={() => onViewOrder(order)}
                      >
                        {order.id}
                      </span>
                      {order.priority === 'URGENT' && (
                        <span className="mo-priority-tag urgent">URGENT</span>
                      )}
                      {order.priority === 'NORMAL' && (
                        <span className="mo-priority-tag normal">NORMAL</span>
                      )}
                    </div>
                    <span className="mo-order-subtext">{order.hubOrRoute}</span>
                  </div>
                </td>

                {/* 3. Placed Date */}
                <td className="td-placed-date">
                  <div className="mo-placed-date-group">
                    <span className="mo-date-main">{order.placedDate}</span>
                    <span className="mo-date-time">{order.placedTime}</span>
                  </div>
                </td>

                {/* 4. Items & Payload */}
                <td className="td-payload">
                  <div className="mo-payload-group">
                    <span className="mo-payload-main">
                      <strong>{order.itemCount} items</strong> - {order.weightKg} kg
                    </span>
                    <span className="mo-payload-sub">{order.skusSummary}</span>
                  </div>
                </td>

                {/* 5. Requested Date */}
                <td className="td-req-date">
                  <span className={`mo-req-date-text ${order.isToday ? 'today-blue' : ''} ${order.status === 'DEFERRED' ? 'deferred-red' : ''}`}>
                    {order.requestedDate}
                  </span>
                </td>

                {/* 6. Delivery Window */}
                <td className="td-window">
                  <div className="mo-window-group">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{order.deliveryWindow}</span>
                  </div>
                </td>

                {/* 7. Status */}
                <td className="td-status">
                  {getStatusBadge(order)}
                </td>

                {/* 8. Actions */}
                <td className="td-actions">
                  <div className="mo-actions-cell">
                    {order.status === 'IN_DELIVERY' && (
                      <button
                        type="button"
                        className="btn-mo-track-action"
                        onClick={() => onTrackOrder(order)}
                        title="Track delivery in real-time"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                        <span>Track</span>
                      </button>
                    )}

                    {order.status === 'COMPLETED' ? (
                      <button
                        type="button"
                        className="btn-mo-receipt-link"
                        onClick={() => onViewReceipt(order)}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-mo-view-link"
                        onClick={() => onViewOrder(order)}
                      >
                        View
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}

          {orders.length === 0 && (
            <tr>
              <td colSpan="8" className="mo-empty-table-cell">
                <div className="mo-empty-wrap">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <p>No replenishment orders match your current filter.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer */}
      <div className="mo-pagination-footer">
        <div className="mo-pagination-left">
          <span>Showing <strong>{firstShown}-{lastShown}</strong> of <strong>{orders.length}</strong> orders</span>
          <div className="mo-page-size-selector">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>

        <div className="mo-pagination-right">
          <button
            type="button"
            className="mo-page-btn arrow"
            disabled={page === 1}
            onClick={() => setCurrentPage(Math.max(1, page - 1))}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`mo-page-btn ${page === n ? 'active' : ''}`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className="mo-page-btn arrow"
            disabled={page === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
