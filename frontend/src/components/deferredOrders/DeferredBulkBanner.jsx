import { useNavigate } from 'react-router-dom'

export default function DeferredBulkBanner({
  selectedCount = 3,
  onSelectAll,
  allSelected = true,
}) {
  const navigate = useNavigate()

  return (
    <div className="deferred-selection-banner">
      <div className="selection-banner-left">
        <label className="selection-checkbox-wrap">
          <input
            type="checkbox"
            checked={selectedCount > 0}
            onChange={onSelectAll}
            className="deferred-custom-checkbox"
          />
          <span className="selection-text-count bold">
            {selectedCount} orders selected
          </span>
        </label>
        <span className="selection-instruction-note">
          Review in Delivery Planner before assigning
        </span>
      </div>

      <button
        type="button"
        className="btn-review-selected-planner"
        onClick={() => navigate('/dispatcher/delivery-planner')}
      >
        <span>Review Selected in Planner</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
