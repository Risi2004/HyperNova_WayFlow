import { Link } from 'react-router-dom'

export default function SingleDeliverySummaryCard({ deliveryId = 'DEL-8401' }) {
  const fields = [
    { label: 'Delivery ID', value: deliveryId },
    { label: 'Order ID', value: 'ORD-2026-1048', isOrderLink: true, to: '/dispatcher/orders/ORD-2026-1048' },
    { label: 'Route ID', value: 'TR-024', isRouteLink: true, to: '/dispatcher/routes/TR-024' },
    { label: 'Outlet', value: 'OUT042 â€” Colombo North' },
    { label: 'Driver', value: 'K. Perera' },
    { label: 'Vehicle', value: 'WP-CB-4521 (Refrigerated Truck)' },
    { label: 'Scheduled Window', value: '08:45 AM - 09:15 AM' },
    { label: 'Actual Delivery', value: '09:14 AM (On Time)', isGreen: true },
    { label: 'Service Duration', value: '16 mins' },
    { label: 'Depot Origin', value: 'Peliyagoda DC' },
    { label: 'Weight Delivered', value: '620 kg' },
    { label: 'Recipient', value: 'M. Senanayake (Store Manager)' },
  ]

  return (
    <div className="single-card single-summary-card">
      <div className="single-card-header">
        <h2 className="single-card-title">Delivery Summary</h2>
        <p className="single-card-subtitle">
          Verified delivery timestamps, route origin, driver, and recipient details
        </p>
      </div>

      <div className="single-summary-grid">
        {fields.map((f, idx) => (
          <div key={idx} className="summary-col-cell">
            <span className="summary-label">{f.label}</span>
            {f.isOrderLink || f.isRouteLink ? (
              <Link to={f.to} className="summary-value blue-link bold">
                {f.value}
              </Link>
            ) : (
              <span className={`summary-value bold ${f.isGreen ? 'text-green' : ''}`}>
                {f.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
