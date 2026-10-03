import { useNavigate } from 'react-router-dom'
import { formatShortDate } from '../../../utils/orderFormat'

export default function DeferredBulkBanner({ selectedCount, onClear, plannerDate }) {
  const navigate = useNavigate()

  return (
    <div className="deferred-selection-banner">
      <div className="selection-banner-left">
        <span className="selection-text-count bold">
          {selectedCount} order{selectedCount === 1 ? '' : 's'} selected
        </span>
        <span className="selection-instruction-note">
          Deferred orders are planned again on their next run{plannerDate ? ` (${formatShortDate(plannerDate)})` : ''}. Assign them in the Delivery Planner.
        </span>
        <button type="button" className="btn-clear-deferred-filters" onClick={onClear}>
          Clear selection
        </button>
      </div>

      <button
        type="button"
        className="btn-review-selected-planner"
        onClick={() => navigate(plannerDate ? `/dispatcher/delivery-planner?date=${plannerDate}` : '/dispatcher/delivery-planner')}
      >
        <span>Open Planner{plannerDate ? ` for ${formatShortDate(plannerDate)}` : ''}</span>
      </button>
    </div>
  )
}
