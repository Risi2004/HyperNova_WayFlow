import { Link } from 'react-router-dom'

export default function OrdersOnRouteSection() {
  const orders = [
    {
      id: 'ORD-1042',
      outlet: 'OUT042',
      brand: 'Waypoint Fresh',
      items: 36,
      weight: '620 kg',
      volume: '3.4 m³',
      temp: 'Chilled',
      window: '05:45-06:15',
      status: 'Assigned',
    },
    {
      id: 'ORD-1048',
      outlet: 'OUT017',
      brand: 'Waypoint Fresh',
      items: 18,
      weight: '460 kg',
      volume: '2.8 m³',
      temp: 'Frozen',
      window: '06:00-06:30',
      status: 'Assigned',
    },
    {
      id: 'ORD-1001',
      outlet: 'OUT001',
      brand: 'Waypoint Style',
      items: 14,
      weight: '380 kg',
      volume: '2.1 m³',
      temp: 'Ambient',
      window: '06:30-07:15',
      status: 'Assigned',
    },
    {
      id: 'ORD-1057',
      outlet: 'OUT033',
      brand: 'Waypoint Fresh',
      items: 22,
      weight: '540 kg',
      volume: '3.2 m³',
      temp: 'Chilled',
      window: '07:00-07:45',
      status: 'Assigned',
    },
    {
      id: 'ORD-1002',
      outlet: 'OUT078',
      brand: 'Waypoint Tech',
      items: 16,
      weight: '410 kg',
      volume: '2.6 m³',
      temp: 'Ambient',
      window: '07:30-08:15',
      status: 'Assigned',
    },
    {
      id: 'ORD-1006',
      outlet: 'OUT019',
      brand: 'Waypoint Fresh',
      items: 24,
      weight: '520 kg',
      volume: '3.0 m³',
      temp: 'Chilled',
      window: '08:15-09:00',
      status: 'Assigned',
    },
    {
      id: 'ORD-1071',
      outlet: 'OUT052',
      brand: 'Waypoint Style',
      items: 19,
      weight: '430 kg',
      volume: '2.2 m³',
      temp: 'Ambient',
      window: '09:00-09:45',
      status: 'Assigned',
    },
    {
      id: 'ORD-1076',
      outlet: 'OUT011',
      brand: 'Waypoint Fresh',
      items: 21,
      weight: '460 kg',
      volume: '2.1 m³',
      temp: 'Frozen',
      window: '09:45-10:30',
      status: 'Assigned',
    },
  ]

  return (
    <div className="route-card orders-on-route-card">
      <div className="route-card-header flex-between">
        <div>
          <h2 className="route-card-title">Orders on Route</h2>
          <p className="route-card-subtitle">8 orders · 190 items · 3,820 kg · 21.4 m³</p>
        </div>
        <span className="all-assigned-pill">All assigned</span>
      </div>

      <div className="table-responsive-container">
        <table className="orders-route-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>OUTLET</th>
              <th>BRAND</th>
              <th>ITEMS</th>
              <th>WEIGHT</th>
              <th>VOLUME</th>
              <th>TEMPERATURE</th>
              <th>DELIVERY WINDOW</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord.id}>
                <td className="cell-order-id bold">
                  <Link to={`/dispatcher/orders/${ord.id}`} className="blue-table-link">
                    {ord.id}
                  </Link>
                </td>
                <td className="cell-outlet">{ord.outlet}</td>
                <td className="cell-brand">{ord.brand}</td>
                <td className="cell-items">{ord.items}</td>
                <td className="cell-weight">{ord.weight}</td>
                <td className="cell-volume">{ord.volume}</td>
                <td className="cell-temp">{ord.temp}</td>
                <td className="cell-window">{ord.window}</td>
                <td className="cell-status">
                  <span className="status-pill-badge pill-assigned">
                    <span className="dot"></span>
                    {ord.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
