export default function DeliveryOutcomeSelector({
  selectedOutcome = 'success',
  onSelectOutcome,
}) {
  return (
    <div className="delivery-outcome-selector-section">
      <h3 className="outcome-section-question">How was this delivery completed?</h3>

      <div className="outcome-cards-grid">
        {/* Option 1: Delivered Successfully */}
        <button
          type="button"
          className={`outcome-selection-card ${selectedOutcome === 'success' ? 'selected success' : ''}`}
          onClick={() => onSelectOutcome && onSelectOutcome('success')}
        >
          <div className="outcome-card-icon-wrap success">
            {selectedOutcome === 'success' ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563eb">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            )}
          </div>

          <div className="outcome-card-content">
            <h4 className="outcome-card-title">Delivered Successfully</h4>
            <p className="outcome-card-description">The order was delivered to the outlet.</p>
          </div>
        </button>

        {/* Option 2: Delivery Problem */}
        <button
          type="button"
          className={`outcome-selection-card ${selectedOutcome === 'problem' ? 'selected problem' : ''}`}
          onClick={() => onSelectOutcome && onSelectOutcome('problem')}
        >
          <div className="outcome-card-icon-wrap problem">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedOutcome === 'problem' ? '#dc2626' : '#64748b'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="outcome-card-content">
            <h4 className="outcome-card-title">Delivery Problem</h4>
            <p className="outcome-card-description">There was an issue preventing normal delivery.</p>
          </div>
        </button>
      </div>
    </div>
  )
}
