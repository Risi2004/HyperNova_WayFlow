export default function DeliveryOutletSummaryCard({
  storeName = 'Metro Grocers',
  outletId = 'OUT043',
  orderId = 'ORD-1042',
  deliveryWindow = '11:00 AM – 11:30 AM',
  route = 'Peliyagoda → Colombo South',
  vehicle = 'WP-REF-007',
  badgeText = 'CURRENT STOP',
}) {
  return (
    <div className="delivery-outlet-summary-card">
      {/* Top Store Info Row */}
      <div className="outlet-summary-top-row">
        <div className="outlet-name-block">
          <h2 className="outlet-store-name">{storeName}</h2>
          <span className="outlet-id-subtext">Outlet ID: {outletId}</span>
        </div>
        <span className="current-stop-badge-pill">{badgeText}</span>
      </div>

      <div className="outlet-summary-divider" />

      {/* 4 Metadata Columns */}
      <div className="outlet-meta-grid">
        <div className="outlet-meta-col">
          <span className="meta-col-label">ORDER ID</span>
          <span className="meta-col-value">{orderId}</span>
        </div>

        <div className="outlet-meta-col">
          <span className="meta-col-label">DELIVERY WINDOW</span>
          <span className="meta-col-value">{deliveryWindow}</span>
        </div>

        <div className="outlet-meta-col">
          <span className="meta-col-label">ROUTE</span>
          <span className="meta-col-value">{route}</span>
        </div>

        <div className="outlet-meta-col">
          <span className="meta-col-label">VEHICLE</span>
          <span className="meta-col-value">{vehicle}</span>
        </div>
      </div>
    </div>
  )
}
