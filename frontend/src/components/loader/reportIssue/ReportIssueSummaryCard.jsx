export default function ReportIssueSummaryCard({
  issueType = 'Quantity Mismatch',
  stop = '02 — Bambalapitiya',
  item = 'Rice 5kg',
  order = 'ORD-1048',
  discrepancy = -8,
}) {
  const discrepancyStr =
    discrepancy > 0 ? `+${discrepancy} units` : `${discrepancy} units`

  return (
    <div className="report-summary-preview-card">
      <h4 className="summary-preview-title">Summary Preview</h4>

      <div className="summary-preview-list">
        <div className="summary-preview-row">
          <span className="preview-label">Type</span>
          <span className="preview-value">{issueType}</span>
        </div>

        <div className="summary-preview-row">
          <span className="preview-label">Stop</span>
          <span className="preview-value">{stop}</span>
        </div>

        <div className="summary-preview-row">
          <span className="preview-label">Item</span>
          <span className="preview-value">
            {item} {order ? `(${order})` : ''}
          </span>
        </div>

        <div className="summary-preview-row">
          <span className="preview-label">Discrepancy</span>
          <span
            className={`preview-value discrepancy-val ${
              discrepancy < 0 ? 'negative' : 'positive'
            }`}
          >
            {discrepancyStr}
          </span>
        </div>
      </div>

      <div className="summary-preview-warning">
        <svg
          className="preview-warning-icon"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>Reporting an issue may hold this order's status.</span>
      </div>
    </div>
  )
}
