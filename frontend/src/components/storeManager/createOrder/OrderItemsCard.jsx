export default function OrderItemsCard({
  items,
  onUpdateQty,
  onSetQty,
  onRemoveItem,
  onOpenAddModal,
}) {
  const getItemIcon = (type) => {
    if (type === 'chilled') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    }
    if (type === 'frozen') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <path d="m20 16-4-4 4-4" />
          <path d="m4 8 4 4-4 4" />
          <path d="m16 4-4 4-4-4" />
          <path d="m8 20 4-4 4 4" />
        </svg>
      )
    }
    // Ambient / Grain
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a6 6 0 0 0 12 0V2" />
        <line x1="6" y1="6" x2="18" y2="6" />
        <line x1="6" y1="10" x2="18" y2="10" />
      </svg>
    )
  }

  return (
    <div className="co-card co-items-card">
      {/* Header */}
      <div className="co-card-header">
        <div className="co-card-title-group">
          <div className="co-card-icon-wrap blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <div className="co-items-title-wrap">
            <h2 className="co-card-title">Order Items</h2>
            <span className="co-skus-count-badge">{items.length} SKUs</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-co-add-sku"
          onClick={onOpenAddModal}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Add</span>
        </button>
      </div>

      <p className="co-items-subtitle">
        Select the products, categories, and quantities required by your outlet.
      </p>

      {/* Items List */}
      <div className="co-items-list">
        {items.map((item) => {
          const itemWeight = Math.round(item.cases * item.weightPerCase * 10) / 10
          return (
            <div key={item.id} className="co-item-row">
              {/* Product Icon */}
              <div className={`co-item-icon-box ${item.type}`}>
                {getItemIcon(item.type)}
              </div>

              {/* Product Details */}
              <div className="co-item-details-col">
                <div className="co-item-title-row">
                  <h4 className="co-item-name">{item.name}</h4>
                  <span className={`co-category-tag ${item.type}`}>
                    {item.category}
                  </span>
                </div>
                <div className="co-item-meta-sub">
                  <span>{item.sku}</span>
                </div>
              </div>

              {/* Quantity Controls & Stepper */}
              <div className="co-item-qty-section">
                <div className="co-item-weight-col">
                  <span className="co-weight-value">{itemWeight} kg</span>
                  <span className="co-cases-label">{item.cases} × {item.unit}</span>
                </div>

                <div className="co-stepper-wrap">
                  <button
                    type="button"
                    className="btn-stepper minus"
                    onClick={() => onUpdateQty(item.id, -1)}
                    disabled={item.cases <= 1}
                    title="Decrease Cases"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="co-stepper-count"
                    min="1"
                    max="10000"
                    value={item.cases}
                    onChange={(e) => onSetQty(item.id, e.target.value)}
                    aria-label={`Quantity of ${item.name}`}
                  />
                  <button
                    type="button"
                    className="btn-stepper plus"
                    onClick={() => onUpdateQty(item.id, 1)}
                    title="Increase Cases"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-item-delete"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item from order"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <div className="co-empty-items-state">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p>No products currently added to this order.</p>
            <button type="button" className="btn-co-add-sku" onClick={onOpenAddModal}>
              + Add First Product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
