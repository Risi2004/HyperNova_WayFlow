import { Link, useNavigate } from 'react-router-dom'
import { dispatchStatusOf, formatWindow, outletLabel } from '../../../utils/orderFormat'

// Rows come from the orders API `attention` list (repeat deferrals, exceptions, urgent orders).
function toRow(o) {
  const exception = ['shortfall', 'failed', 'disputed'].includes(o.status)
  const deferredAgain = o.status === 'deferred' && o.consecutive_deferral_count > 1
  return {
    id: o.order_id,
    outlet: outletLabel(o),
    productType: o.temp_requirement === 'chilled' ? 'Chilled / Reefer' : 'Ambient',
    window: formatWindow(o.requested_window_open, o.requested_window_close),
    status: (o.status === 'deferred' ? `Deferred ${o.consecutive_deferral_count || 1}×` : dispatchStatusOf(o.status).label).toUpperCase(),
    statusType: exception || deferredAgain ? 'at-risk' : o.status === 'deferred' ? 'deferred' : 'pending',
    priority: (o.priority || 'normal').toUpperCase(),
    priorityType: o.priority === 'urgent' ? 'urgent' : 'normal',
    action: exception ? 'Resolve' : o.status === 'deferred' ? 'Review' : 'Plan',
  }
}

export default function OrdersAttentionTable({ orders: source = [] }) {
  const navigate = useNavigate()
  const orders = source.map(toRow)

  return (
    <div className="dashboard-card orders-table-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Orders Requiring Attention</h2>
          <span className="card-subheading">Orders requiring assignment, review, or immediate intervention</span>
        </div>
        <Link to="/dispatcher/orders" className="card-header-link">
          View All Orders &rarr;
        </Link>
      </div>

      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>OUTLET</th>
              <th>PRODUCT TYPE</th>
              <th>DELIVERY WINDOW</th>
              <th>STATUS</th>
              <th>PRIORITY</th>
              <th className="text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id}>
                <td className="order-id-cell">{ord.id}</td>
                <td className="outlet-cell">{ord.outlet}</td>
                <td className="product-type-cell">{ord.productType}</td>
                <td className="window-cell">{ord.window}</td>
                <td>
                  <span className={`pill-status pill-${ord.statusType}`}>
                    {ord.status}
                  </span>
                </td>
                <td>
                  <span className={`pill-priority pill-${ord.priorityType}`}>
                    {ord.priority}
                  </span>
                </td>
                <td className="text-right">
                  <button type="button" className="table-action-btn" onClick={() => navigate(`/dispatcher/orders/${ord.id}`)}>
                    {ord.action}
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="outlet-cell">No orders need attention right now.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
