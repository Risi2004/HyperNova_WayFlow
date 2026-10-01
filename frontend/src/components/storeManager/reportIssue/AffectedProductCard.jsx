export default function AffectedProductCard({
  product = {
    name: 'Fresh Highland Milk 1L',
    sku: 'DAI-0402',
    code: 'DAI-MLK-001',
    category: 'Dairy & Cold Chain',
    tempClass: 'Chilled (+4°C)',
    orderedCrates: 24,
    orderedUnits: 288,
    affectedCrates: 4,
    affectedUnits: 48,
    receivedCrates: 20,
    receivedUnits: 240,
    sourceLocation: 'Peliyagoda DC Reefer',
    destinationLocation: 'Cold Storage-Bay 02',
  },
  onScanBarcode,
  onChangeSku,
}) {
  return (
    <div className="ri-section-card">
      {/* Section Header */}
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">2</div>
          <h2 className="ri-section-title">Affected Product &amp; Quantities</h2>
        </div>
        <button
          type="button"
          className="btn-ri-scan-barcode"
          onClick={onScanBarcode}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M3 17v2a2 2 0 0 0 2 2h2" />
            <line x1="8" y1="7" x2="8" y2="17" />
            <line x1="12" y1="7" x2="12" y2="17" />
            <line x1="16" y1="7" x2="16" y2="17" />
          </svg>
          <span>Scan Barcode</span>
        </button>
      </div>
      <p className="ri-section-subtitle">
        Specify the affected SKU and quantity discrepancy
      </p>

      {/* Selected Product Card */}
      <div className="ri-product-info-bar">
        <div className="ri-product-left">
          <div className="ri-product-thumb-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="ri-product-meta">
            <div className="ri-product-tags-row">
              <span className="ri-tag-chilled">{product.tempClass}</span>
              <span className="ri-tag-code">{product.code}</span>
            </div>
            <h3 className="ri-product-title">{product.name}</h3>
            <span className="ri-product-sku-cat">
              SKU: {product.sku} &bull; Category: {product.category} &bull;
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn-ri-change-sku"
          onClick={onChangeSku}
        >
          <span>Change SKU</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* 3 Quantity Cards Grid */}
      <div className="ri-quantities-grid">
        {/* 1. ORDERED EXPECTED */}
        <div className="ri-qty-box">
          <span className="ri-qty-label">1. ORDERED EXPECTED</span>
          <div className="ri-qty-val-row">
            <span className="ri-qty-num">{product.orderedCrates}</span>
            <span className="ri-qty-unit">Crates ({product.orderedUnits} Units)</span>
          </div>
          <span className="ri-qty-subtext">{product.sourceLocation}</span>
        </div>

        {/* 2. AFFECTED / SHORT (Highlighted) */}
        <div className="ri-qty-box highlighted-short">
          <span className="ri-qty-label blue">2. AFFECTED / SHORT</span>
          <div className="ri-qty-val-row">
            <span className="ri-qty-num blue">{product.affectedCrates}</span>
            <span className="ri-qty-unit blue">({product.affectedUnits} Units)</span>
          </div>
          <span className="ri-qty-subtext blue">Discrepancy tagged to seal</span>
        </div>

        {/* 3. INTAKE RECEIVED */}
        <div className="ri-qty-box">
          <span className="ri-qty-label">3. INTAKE RECEIVED</span>
          <div className="ri-qty-val-row">
            <span className="ri-qty-num">{product.receivedCrates}</span>
            <span className="ri-qty-unit">Crates ({product.receivedUnits} Units)</span>
          </div>
          <span className="ri-qty-subtext">{product.destinationLocation}</span>
        </div>
      </div>
    </div>
  )
}
