export default function AffectedDeliveryCard({
  orderId = 'ORD-1042',
  outletName = 'Metro Grocers',
  stopPosition = 'Stop 05/08',
  deliveryWindow = '11:00 AM – 11:30 AM',
  statusBadge = 'STALLED OUTCOME',
}) {
  return (
    <div className="report-sidebar-card affected-delivery-card">
      <h4 className="sidebar-card-title">Affected Delivery</h4>

      <div className="affected-delivery-meta-list">
        <div className="affected-meta-row">
          <span className="affected-meta-label">Order ID</span>
          <span className="affected-meta-val bold">{orderId}</span>
        </div>

        <div className="affected-meta-row">
          <span className="affected-meta-label">Outlet Name</span>
          <span className="affected-meta-val">{outletName}</span>
        </div>

        <div className="affected-meta-row">
          <span className="affected-meta-label">Stop Position</span>
          <span className="affected-meta-val">{stopPosition}</span>
        </div>

        <div className="affected-meta-row">
          <span className="affected-meta-label">Delivery Window</span>
          <span className="affected-meta-val">{deliveryWindow}</span>
        </div>
      </div>

      <div className="affected-badge-wrapper">
        <span className="stalled-outcome-badge">{statusBadge}</span>
      </div>
    </div>
  )
}
