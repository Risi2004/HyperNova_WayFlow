export default function OrderHistoryHeader({
  onCreateOrder,
  onBackToOrders,
}) {
  return (
    <div className="oh-header-container">
      <div className="oh-top-row">
        <div>
          {/* Breadcrumb */}
          <div className="oh-breadcrumb">
            <span className="oh-bc-link" onClick={onBackToOrders}>My Orders</span>
            <span className="oh-bc-sep">&gt;</span>
            <span className="oh-bc-curr">Order History</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="oh-page-title">Order History</h1>
          <p className="oh-page-subtitle">
            Review previous orders and delivery records for your outlet.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="btn-oh-create-order"
          onClick={onCreateOrder}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Create New Order</span>
        </button>
      </div>
    </div>
  )
}
