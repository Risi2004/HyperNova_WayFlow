export default function DiscrepancySummaryCard({
  categoryLabel = 'Missing Item',
  skuName = 'Fresh Farm Milk 1L',
  discrepancyText = '4 Crates (48 Units)',
  evidenceCount = 1,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  return (
    <div className="ri-side-card">
      <div className="ri-side-card-header">
        <div className="ri-side-card-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="7" y1="8" x2="17" y2="8" />
            <line x1="7" y1="12" x2="13" y2="12" />
            <line x1="7" y1="16" x2="11" y2="16" />
          </svg>
          <h3 className="ri-side-card-title">Discrepancy Summary</h3>
        </div>
        <span className="ri-badge-draft">Draft</span>
      </div>

      <div className="ri-summary-details-list">
        <div className="ri-summary-row">
          <span className="ri-summary-label">Type</span>
          <span className="ri-summary-pill-blue">{categoryLabel}</span>
        </div>

        <div className="ri-summary-row">
          <span className="ri-summary-label">SKU</span>
          <span className="ri-summary-val-dark">{skuName}</span>
        </div>

        <div className="ri-summary-row">
          <span className="ri-summary-label">Discrepancy</span>
          <span className="ri-summary-val-highlight">{discrepancyText}</span>
        </div>

        <div className="ri-summary-row">
          <span className="ri-summary-label">Evidence</span>
          <span className="ri-summary-val-dark">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {evidenceCount} photo{evidenceCount === 1 ? '' : 's'} attached
          </span>
        </div>
      </div>

      {/* Credit notice box */}
      <div className="ri-review-notice-box">
        <div className="ri-notice-icon-circle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="ri-notice-text">
          Central logistics will review within 24h for store credit.
        </p>
      </div>

      {/* Action buttons */}
      <div className="ri-summary-actions">
        <button
          type="button"
          className="btn-ri-submit-issue"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="ri-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
              <span>Submitting Report...</span>
            </>
          ) : (
            <>
              <span>Submit Issue</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        <button
          type="button"
          className="btn-ri-cancel-return"
          onClick={onCancel}
        >
          Cancel &amp; Return to Order
        </button>
      </div>
    </div>
  )
}
