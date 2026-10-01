export default function OrderSummaryCard({
  orderCode = 'ORD-1043',
  items = [],
  deliveryDate = 'Sep 29, 2026',
  deliveryWindow = '10:30 – 11:00 AM',
  onSubmitOrder,
  onSaveDraft,
}) {
  const totalSkus = items.length
  const totalCases = items.reduce((acc, curr) => acc + curr.cases, 0)
  
  // Calculate cold chain breakdown
  const ambientCases = items
    .filter((i) => i.type === 'ambient')
    .reduce((acc, curr) => acc + curr.cases, 0)
  const chilledCases = items
    .filter((i) => i.type === 'chilled')
    .reduce((acc, curr) => acc + curr.cases, 0)
  const frozenCases = items
    .filter((i) => i.type === 'frozen')
    .reduce((acc, curr) => acc + curr.cases, 0)

  // Dynamic estimate calculation
  const totalWeightKg = items.reduce((acc, curr) => acc + curr.cases * curr.weightPerCase, 0)
  const palletFootprint = (totalCases / 20).toFixed(1)

  return (
    <div className="co-card co-summary-card">
      {/* Top Header */}
      <div className="co-summary-header">
        <h3 className="co-summary-title">Order Summary</h3>
        <span className="co-order-code-badge">{orderCode}</span>
      </div>

      {/* 2 Stat Boxes */}
      <div className="co-summary-stat-grid">
        <div className="co-stat-box">
          <span className="co-stat-label">TOTAL SKUS</span>
          <span className="co-stat-value">{totalSkus}</span>
        </div>
        <div className="co-stat-box">
          <span className="co-stat-label">TOTAL UNITS</span>
          <span className="co-stat-value blue">{totalCases} Cases</span>
        </div>
      </div>

      {/* Key-Value Details */}
      <div className="co-summary-details-list">
        <div className="co-summary-row">
          <span className="co-row-label">Est. Payload Weight</span>
          <span className="co-row-value">~{totalWeightKg} kg</span>
        </div>
        <div className="co-summary-row">
          <span className="co-row-label">Pallet Footprint</span>
          <span className="co-row-value">~{palletFootprint} Pallets</span>
        </div>
        <div className="co-summary-row">
          <span className="co-row-label">Destination</span>
          <span className="co-row-value">Colombo 05 Store</span>
        </div>
        <div className="co-summary-row">
          <span className="co-row-label">Delivery Date</span>
          <span className="co-row-value">{deliveryDate}</span>
        </div>
        <div className="co-summary-row">
          <span className="co-row-label">Delivery Window</span>
          <span className="co-row-value">{deliveryWindow.split('(')[0].replace('Morning', '').trim() || '10:30 – 11:00 AM'}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="co-summary-divider" />

      {/* Cold Chain Spec Breakdown */}
      <div className="co-cold-chain-spec-section">
        <div className="co-spec-header-row">
          <span className="co-spec-title">COLD CHAIN SPEC</span>
          <span className="co-spec-sub-tag">WP-REF Tri-Zone</span>
        </div>

        <div className="co-spec-breakdown-list">
          <div className="co-spec-item">
            <div className="co-spec-bullet-row">
              <span className="co-spec-dot ambient" />
              <span className="co-spec-name">Ambient (Dry Goods)</span>
            </div>
            <span className="co-spec-cases">{ambientCases} Cases</span>
          </div>

          <div className="co-spec-item">
            <div className="co-spec-bullet-row">
              <span className="co-spec-dot chilled" />
              <span className="co-spec-name">Chilled (+4°C)</span>
            </div>
            <span className="co-spec-cases">{chilledCases} Cases</span>
          </div>

          <div className="co-spec-item">
            <div className="co-spec-bullet-row">
              <span className="co-spec-dot frozen" />
              <span className="co-spec-name">Frozen (-18°C)</span>
            </div>
            <span className="co-spec-cases">{frozenCases} Cases</span>
          </div>
        </div>
      </div>

      {/* Consolidation Scheduled Alert Box */}
      <div className="co-consolidation-alert-box">
        <div className="co-consolidation-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="co-consolidation-title">Consolidation Scheduled</span>
        </div>
        <p className="co-consolidation-desc">
          Eligible for tomorrow&apos;s morning linehaul run from Peliyagoda DC.
        </p>
      </div>

      {/* Primary Submit Button */}
      <button
        type="button"
        className="btn-co-main-submit"
        onClick={onSubmitOrder}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
        <span>Submit Order ({totalCases} Units)</span>
      </button>

      {/* Save as Draft Link */}
      <button
        type="button"
        className="btn-co-save-draft-link"
        onClick={onSaveDraft}
      >
        Save as Draft
      </button>

      {/* Footer Authorization Notice */}
      <div className="co-summary-auth-footer">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>Authorized by Sarah Perera (Store Manager)</span>
      </div>
    </div>
  )
}
