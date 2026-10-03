export default function AffectedProductCard({ items, itemId, onChangeItem, affectedQty, onChangeAffectedQty }) {
  const item = items.find((i) => String(i.item_id) === String(itemId))
  const unit = (n) => `${item.unit.toLowerCase()}${n === 1 ? '' : 's'}`

  return (
    <div className="ri-section-card">
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">2</div>
          <h2 className="ri-section-title">Affected Product &amp; Quantities</h2>
        </div>
        <span className="ri-badge-optional">OPTIONAL</span>
      </div>
      <p className="ri-section-subtitle">Pick the product line, or leave it on “whole order” for delays and other problems.</p>

      <div className="ri-product-info-bar">
        <div className="ri-product-left">
          <div className="ri-product-meta">
            {item && (
              <div className="ri-product-tags-row">
                <span className="ri-tag-chilled">{item.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient'}</span>
                <span className="ri-tag-code">{item.product_code}</span>
              </div>
            )}
            <label className="ri-product-sku-cat" htmlFor="ri-item-select">Product line</label>
            <select id="ri-item-select" className="ri-desc-textarea" value={itemId} onChange={(e) => onChangeItem(e.target.value)}>
              <option value="">Whole order (not item-specific)</option>
              {items.map((i) => (
                <option key={i.item_id} value={i.item_id}>
                  {i.product_name} — {i.quantity} {i.unit.toLowerCase()}{i.quantity === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {item && (
        <div className="ri-quantities-grid">
          <div className="ri-qty-box">
            <span className="ri-qty-label">ORDERED</span>
            <div className="ri-qty-val-row">
              <span className="ri-qty-num">{item.quantity}</span>
              <span className="ri-qty-unit">{unit(item.quantity)}</span>
            </div>
          </div>

          <div className="ri-qty-box highlighted-short">
            <label className="ri-qty-label blue" htmlFor="ri-affected-qty">AFFECTED</label>
            <div className="ri-qty-val-row">
              <input
                id="ri-affected-qty"
                className="ri-qty-num blue"
                type="number"
                min="0"
                max={item.quantity}
                value={affectedQty}
                onChange={(e) => onChangeAffectedQty(Math.max(0, Math.min(item.quantity, Math.floor(Number(e.target.value) || 0))))}
                style={{ width: '5ch', border: 'none', background: 'transparent' }}
              />
              <span className="ri-qty-unit blue">{unit(affectedQty)}</span>
            </div>
          </div>

          <div className="ri-qty-box">
            <span className="ri-qty-label">UNAFFECTED</span>
            <div className="ri-qty-val-row">
              <span className="ri-qty-num">{item.quantity - affectedQty}</span>
              <span className="ri-qty-unit">{unit(item.quantity - affectedQty)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
