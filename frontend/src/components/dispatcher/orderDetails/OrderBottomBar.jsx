import { useNavigate } from 'react-router-dom'
import priorityIcon from '../../../assets/icons/priority.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'
import cancelIcon from '../../../assets/icons/cancel.svg'
import deliveryPlanner2Icon from '../../../assets/icons/delivery-planner2.svg'

export default function OrderBottomBar({
  orderId,
  message,
  isUrgent = false,
  isBusy = false,
  canPlan = false,
  canDefer = false,
  canCancel = false,
  onMarkPriority,
  onDefer,
  onCancel,
}) {
  const navigate = useNavigate()

  return (
    <div className="order-details-bottom-bar">
      <div className="bottom-bar-left">
        <span>{message}</span>
      </div>

      <div className="bottom-bar-right">
        <button type="button" className="action-pill-btn" onClick={onMarkPriority} disabled={isBusy}>
          <img src={priorityIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>{isUrgent ? 'Clear Priority' : 'Mark as Priority'}</span>
        </button>

        <button type="button" className="action-pill-btn" onClick={onDefer} disabled={isBusy || !canDefer}>
          <img src={deferredOrdersIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>Defer Order</span>
        </button>

        <button type="button" className="action-pill-btn btn-danger-cancel" onClick={onCancel} disabled={isBusy || !canCancel}>
          <img src={cancelIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>Cancel Order</span>
        </button>

        <button
          type="button"
          className="action-pill-btn-green"
          disabled={!canPlan}
          onClick={() => navigate('/dispatcher/delivery-planner', { state: { orderIds: [orderId] } })}
        >
          <img src={deliveryPlanner2Icon} alt="" className="action-icon" aria-hidden="true" />
          <span>Add to Delivery Planner</span>
        </button>
      </div>
    </div>
  )
}
