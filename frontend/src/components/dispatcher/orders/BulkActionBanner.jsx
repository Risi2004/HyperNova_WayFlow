import deliveryPlanner2Icon from '../../../assets/icons/delivery-planner2.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'
import priorityIcon from '../../../assets/icons/priority.svg'

export default function BulkActionBanner({
  selectedCount = 0,
  hint = '',
  allUrgent = false,
  isBusy = false,
  onClearSelection,
  onMarkPriority,
  onDefer,
  onAddToPlanner,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="bulk-action-banner">
      <div className="bulk-action-left">
        <input
          type="checkbox"
          className="bulk-banner-checkbox"
          checked={selectedCount > 0}
          onChange={onClearSelection}
          aria-label="Clear selection"
        />
        <div className="bulk-banner-text-group">
          <span className="bulk-banner-count">
            {selectedCount} order{selectedCount === 1 ? '' : 's'} selected
          </span>
          <span className="bulk-banner-hint">{hint}</span>
        </div>
      </div>

      <div className="bulk-action-right">
        <button type="button" className="bulk-btn-outline" onClick={onMarkPriority} disabled={isBusy}>
          <img src={priorityIcon} alt="" className="bulk-icon-img" aria-hidden="true" />
          <span>{allUrgent ? 'Clear Priority' : 'Mark Priority'}</span>
        </button>

        <button type="button" className="bulk-btn-outline" onClick={onDefer} disabled={isBusy}>
          <img src={deferredOrdersIcon} alt="" className="bulk-icon-img" aria-hidden="true" />
          <span>Defer Order</span>
        </button>

        <button type="button" className="bulk-btn-primary" onClick={onAddToPlanner} disabled={isBusy}>
          <img src={deliveryPlanner2Icon} alt="" className="bulk-icon-primary" aria-hidden="true" />
          <span>Add to Delivery Planner</span>
        </button>
      </div>
    </div>
  )
}
