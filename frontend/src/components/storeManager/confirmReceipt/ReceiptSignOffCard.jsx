export default function ReceiptSignOffCard({
  notes,
  onChangeNotes,
  temperature,
  onChangeTemperature,
  chilled,
  storeName,
  managerName,
  outletId,
  error,
  isConfirmed,
  onToggleConfirm,
  onBack,
  onReportIssue,
  onConfirmReceipt,
  isSubmitting = false,
}) {
  return (
    <div className="cr-signoff-card">
      {/* Header with Icon */}
      <div className="cr-signoff-header">
        <div className="cr-signoff-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        </div>
        <div className="cr-signoff-title-col">
          <h3 className="cr-signoff-title">Receipt Confirmation &amp; Sign-Off</h3>
          <p className="cr-signoff-subtitle">
            Provide operational notes and certify cargo acceptance.
          </p>
        </div>
      </div>

      {/* Additional Notes Field */}
      <div className="cr-notes-group">
        <label className="cr-notes-label" htmlFor="cr-notes-input">
          Additional Notes <span className="cr-optional-tag">(Optional)</span>
        </label>
        <textarea
          id="cr-notes-input"
          className="cr-notes-textarea"
          rows={3}
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="Add any comments about the received delivery... e.g. All items received in good condition, seal intact on arrival."
        />
      </div>

      <div className="cr-notes-group">
        <label className="cr-notes-label" htmlFor="cr-temp-input">
          Product temperature at receipt (°C) {!chilled && <span className="cr-optional-tag">(Optional)</span>}
        </label>
        <input
          id="cr-temp-input"
          className="cr-notes-textarea"
          type="number"
          step="0.1"
          inputMode="decimal"
          value={temperature}
          onChange={(e) => onChangeTemperature(e.target.value)}
          placeholder={chilled ? 'e.g. 3.5' : 'Leave blank for ambient goods'}
        />
      </div>

      {/* Warm Warning / Legal Confirmation Box */}
      <div
        className={`cr-certify-box ${isConfirmed ? 'is-checked' : ''}`}
        onClick={onToggleConfirm}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            onToggleConfirm()
          }
        }}
      >
        <div className="cr-certify-checkbox-wrap">
          <input
            type="checkbox"
            id="cr-confirm-checkbox"
            className="cr-certify-checkbox"
            checked={isConfirmed}
            onClick={(e) => e.stopPropagation()}
            onChange={onToggleConfirm}
          />
        </div>
        <div className="cr-certify-text-col">
          <label htmlFor="cr-confirm-checkbox" className="cr-certify-text" onClick={(e) => e.stopPropagation()}>
            I confirm that the above delivery has been received by <strong>{storeName}</strong> and I have reviewed the delivered items and quantities.
          </label>
          <span className="cr-certify-subtext">
            Digital signature will be timestamped under Store Manager credentials: <strong>{managerName || 'you'} ({outletId})</strong>.
          </span>
        </div>
      </div>

      {error && <p className="sm-page-state error" role="alert">{error}</p>}

      {/* Bottom Action Buttons */}
      <div className="cr-signoff-actions-bar">
        <div className="cr-actions-left">
          <button
            type="button"
            className="btn-cr-secondary btn-cr-back"
            onClick={onBack}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Delivery</span>
          </button>

          <button
            type="button"
            className="btn-cr-secondary btn-cr-issue"
            onClick={onReportIssue}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Report Issue</span>
          </button>
        </div>

        <div className="cr-actions-right">
          <button
            type="button"
            className={`btn-cr-confirm-receipt ${!isConfirmed ? 'disabled-hint' : ''}`}
            onClick={onConfirmReceipt}
            disabled={!isConfirmed || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="cr-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                </svg>
                <span>Processing Sign-Off...</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Confirm Receipt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
