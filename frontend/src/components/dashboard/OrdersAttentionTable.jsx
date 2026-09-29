import { Link } from 'react-router-dom'

export default function OrdersAttentionTable() {
  const orders = [
    {
      id: 'ORD-8241',
      outlet: 'FreshMart - Riverside',
      productType: 'Frozen / Reefer',
      window: '10:00–11:30',
      status: 'PENDING PLANNING',
      statusType: 'pending',
      priority: 'HIGH',
      priorityType: 'high',
      action: 'Assign',
    },
    {
      id: 'ORD-8238',
      outlet: 'Metro Grocer - Central',
      productType: 'Ambient',
      window: '11:00–12:00',
      status: 'READY',
      statusType: 'ready',
      priority: 'NORMAL',
      priorityType: 'normal',
      action: 'Plan',
    },
    {
      id: 'ORD-8226',
      outlet: 'Green Basket - North',
      productType: 'Fresh Produce',
      window: '09:45–10:30',
      status: 'AT RISK',
      statusType: 'at-risk',
      priority: 'URGENT',
      priorityType: 'urgent',
      action: 'Resolve',
    },
    {
      id: 'ORD-8219',
      outlet: 'QuickStop - Harbor',
      productType: 'Beverages',
      window: '13:00–15:00',
      status: 'DEFERRED',
      statusType: 'deferred',
      priority: 'LOW',
      priorityType: 'low',
      action: 'Review',
    },
    {
      id: 'ORD-8214',
      outlet: 'Market Lane - East',
      productType: 'Chilled',
      window: '10:30–11:15',
      status: 'PENDING PLANNING',
      statusType: 'pending',
      priority: 'HIGH',
      priorityType: 'high',
      action: 'Assign',
    },
  ]

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
                  <button type="button" className="table-action-btn">
                    {ord.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
