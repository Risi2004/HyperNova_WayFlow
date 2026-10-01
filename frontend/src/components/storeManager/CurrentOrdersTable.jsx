import { useNavigate } from 'react-router-dom'

export default function CurrentOrdersTable({
  orders = [
    {
      id: 'ORD-1041',
      date: 'Sep 28, 2026',
      items: '12 Items',
      deliveryDate: 'Today (02:30 PM)',
      status: 'In Delivery',
      statusType: 'in-delivery',
    },
    {
      id: 'ORD-1038',
      date: 'Sep 28, 2026',
      items: '24 Items',
      deliveryDate: 'Sep 29, 2026',
      status: 'Confirmed',
      statusType: 'confirmed',
    },
    {
      id: 'ORD-1035',
      date: 'Sep 27, 2026',
      items: '08 Items',
      deliveryDate: 'Sep 29, 2026',
      status: 'Pending',
      statusType: 'pending',
    },
  ],
  onViewOrder,
  onAssignDriver,
}) {
  const navigate = useNavigate()

  return (
    <div className="sm-current-orders-card">
      <div className="sm-table-card-header">
        <div className="sm-table-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h3 className="sm-table-card-title">Current Orders</h3>
        </div>

        <button
          type="button"
          className="btn-view-all-orders-link"
          onClick={() => navigate('/store-manager/orders')}
        >
          <span>View All Orders (6)</span>
          <span className="arrow-right">&rarr;</span>
        </button>
      </div>

      <div className="sm-orders-table-wrapper">
        <table className="sm-orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>ORDER DATE</th>
              <th>ITEMS</th>
              <th>DELIVERY DATE</th>
              <th>STATUS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id} className="sm-order-row">
                <td className="sm-order-id-cell">{ord.id}</td>
                <td className="sm-date-cell">{ord.date}</td>
                <td className="sm-items-cell">{ord.items}</td>
                <td className="sm-delivery-date-cell">{ord.deliveryDate}</td>
                <td>
                  <span className={`sm-order-status-pill ${ord.statusType}`}>
                    <span className="status-dot" />
                    <span>{ord.status}</span>
                  </span>
                </td>
                <td className="text-right">
                  <div className="sm-row-actions">
                    <button
                      type="button"
                      className="btn-action-icon"
                      title="Driver info"
                      onClick={() => onAssignDriver && onAssignDriver(ord)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-action-icon"
                      title="View order details"
                      onClick={() => onViewOrder && onViewOrder(ord)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
