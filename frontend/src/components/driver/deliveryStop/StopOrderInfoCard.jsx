export default function StopOrderInfoCard({
  orderCode = 'ORD-1042',
  items = [
    { name: 'Fresh Milk', quantity: '12 units' },
    { name: 'Yogurt', quantity: '10 units' },
    { name: 'Butter', quantity: '8 units' },
    { name: 'Cheese', quantity: '6 units' },
    { name: 'Juice', quantity: '6 units' },
  ],
  totalUnits = '42 units',
  isRefrigerated = true,
}) {
  return (
    <div className="stop-detail-card stop-order-info-card">
      {/* Header */}
      <div className="order-info-header">
        <h3 className="card-section-title">Order Information</h3>
        <span className="order-code-text">{orderCode}</span>
      </div>

      {/* Meta Badges Row */}
      <div className="order-meta-pills-row">
        <span className="order-spec-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span>Items: {items.length}</span>
        </span>

        <span className="order-spec-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <line x1="12" y1="3" x2="12" y2="21" />
            <path d="M6 8l6-5 6 5" />
          </svg>
          <span>Total Units: 42</span>
        </span>

        {isRefrigerated && (
          <span className="order-spec-pill refrigerated">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="12" y1="12" x2="20" y2="7.38" />
              <line x1="12" y1="12" x2="4" y2="16.62" />
              <line x1="12" y1="12" x2="4" y2="7.38" />
              <line x1="12" y1="12" x2="20" y2="16.62" />
            </svg>
            <span>Refrigerated</span>
          </span>
        )}
      </div>

      {/* Items Table */}
      <div className="order-items-table-list">
        {items.map((item, idx) => (
          <div key={idx} className="order-item-line-row">
            <span className="item-product-name">{item.name}</span>
            <span className="item-quantity-text">{item.quantity}</span>
          </div>
        ))}

        {/* Total Summary Row */}
        <div className="order-item-line-row total-summary-row">
          <span className="total-label-text">Total</span>
          <span className="total-value-text">{totalUnits}</span>
        </div>
      </div>
    </div>
  )
}
