import deliveryPlanner2Icon from '../../assets/icons/delivery-planner2.svg'
import deferredOrdersIcon from '../../assets/icons/deferred-orders.svg'
import priorityIcon from '../../assets/icons/priority.svg'

export default function BulkActionBanner({ selectedCount = 3, onClearSelection }) {
  if (selectedCount === 0) return null

  return (
    <div className="bulk-action-banner">
      <div className="bulk-action-left">
        <input
          type="checkbox"
          className="bulk-banner-checkbox"
          checked={selectedCount > 0}
          onChange={onClearSelection}
        />
        <div className="bulk-banner-text-group">
          <span className="bulk-banner-count">{selectedCount} orders selected</span>
          <span className="bulk-banner-hint">All selected orders are ready for planning</span>
        </div>
      </div>

      <div className="bulk-action-right">
        <button type="button" className="bulk-btn-outline">
          <img src={priorityIcon} alt="" className="bulk-icon-img" aria-hidden="true" />
          <span>Mark Priority</span>
        </button>

        <button type="button" className="bulk-btn-outline">
          <img src={deferredOrdersIcon} alt="" className="bulk-icon-img" aria-hidden="true" />
          <span>Defer Order</span>
        </button>

        <button type="button" className="bulk-btn-primary">
          <img src={deliveryPlanner2Icon} alt="" className="bulk-icon-primary" aria-hidden="true" />
          <span>Add to Delivery Planner</span>
        </button>
      </div>
    </div>
  )
}
