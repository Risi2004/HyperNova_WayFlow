export default function LoadAttentionBanner({
  orderCode = 'ORD-1057',
  productName = 'Frozen Chicken',
  description = 'Requires ultra-low temp verify. Confirm frozen storage handling is pre-activated on WP-REF-007 before loading this shipment.',
}) {
  return (
    <div className="load-attention-banner-card">
      <div className="attention-banner-header">
        <svg
          className="attention-warn-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span className="attention-banner-title">Loading Attention Required</span>
      </div>

      <div className="attention-banner-body">
        <p className="attention-order-highlight">
          Order: {orderCode} ({productName})
        </p>
        <p className="attention-order-desc">{description}</p>
      </div>
    </div>
  )
}
