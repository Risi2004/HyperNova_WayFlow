export default function DeliverySummaryStripCard({
  outlet = 'Metro Grocers (OUT043)',
  order = 'ORD-1042',
  status = 'DELIVERED',
  deliveryWindow = '11:00 AM – 11:30 AM',
  vehicle = 'WP-REF-007',
}) {
  return (
    <div className="delivery-summary-strip-card">
      <div className="summary-strip-column">
        <span className="strip-col-label">OUTLET</span>
        <span className="strip-col-value outlet-name">{outlet}</span>
      </div>

      <div className="strip-col-divider" />

      <div className="summary-strip-column">
        <span className="strip-col-label">ORDER</span>
        <span className="strip-col-value">{order}</span>
      </div>

      <div className="strip-col-divider" />

      <div className="summary-strip-column">
        <span className="strip-col-label">STATUS</span>
        <span className="strip-status-badge delivered">{status}</span>
      </div>

      <div className="strip-col-divider" />

      <div className="summary-strip-column">
        <span className="strip-col-label">DELIVERY WINDOW</span>
        <span className="strip-col-value">{deliveryWindow}</span>
      </div>

      <div className="strip-col-divider" />

      <div className="summary-strip-column">
        <span className="strip-col-label">VEHICLE</span>
        <span className="strip-col-value">{vehicle}</span>
      </div>
    </div>
  )
}
