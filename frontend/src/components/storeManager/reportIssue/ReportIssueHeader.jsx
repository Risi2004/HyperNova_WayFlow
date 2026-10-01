export default function ReportIssueHeader({
  orderId = 'ORD-1042',
  status = 'Delivery Completed',
  onBackToOrders,
}) {
  return (
    <div className="ri-header-container">
      <div className="ri-top-row">
        <div>
          {/* Breadcrumb */}
          <div className="ri-breadcrumb">
            <span className="ri-bc-link" onClick={onBackToOrders}>Store Manager</span>
            <span className="ri-bc-sep">&gt;</span>
            <span className="ri-bc-link" onClick={onBackToOrders}>Report Issue</span>
            <span className="ri-bc-sep">&gt;</span>
            <span className="ri-bc-curr">{orderId}</span>
          </div>

          {/* Title */}
          <h1 className="ri-page-title">Report an Issue</h1>
          <p className="ri-page-subtitle">
            Report a problem with an order or delivery so it can be reviewed and resolved by operations.
          </p>
        </div>

        {/* Top Right Order Status Badge */}
        <div className="ri-top-status-badge">
          <span className="ri-status-dot blue" />
          <span className="ri-badge-order-id">Order {orderId}</span>
          <span className="ri-badge-sep">&bull;</span>
          <span className="ri-badge-status">{status}</span>
        </div>
      </div>
    </div>
  )
}
