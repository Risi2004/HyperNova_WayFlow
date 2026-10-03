import { Link, useNavigate } from 'react-router-dom'
import deliveryPlanner2Icon from '../../../assets/icons/delivery-planner2.svg'
import delayIcon from '../../../assets/icons/delay.svg'

export default function OrderHeader({
  orderId,
  status = 'Pending Planning',
  statusTone = 'amber',
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
    <div className="order-details-header-section">
      {/* Back to Orders */}
      <Link to="/dispatcher/orders" className="back-to-orders-link">
        &larr; Orders
      </Link>

      <div className="order-header-main-row">
        {/* Left Title and Status */}
        <div className="order-title-group">
          <h1 className="order-main-title">Order Details</h1>
          <div className="order-code-status-row">
            <span className="order-code-badge">{orderId}</span>
            <span className={`order-status-pill-amber tone-${statusTone}`}>
              <img src={delayIcon} alt="" className="order-status-clock-icon" aria-hidden="true" />
              <span>{status}</span>
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="order-actions-right-col">
          <div className="order-primary-buttons-row">
            <button
              type="button"
              className="btn-add-planner-green"
              disabled={!canPlan}
              title={canPlan ? undefined : 'Only confirmed or deferred orders can be planned'}
              onClick={() => navigate('/dispatcher/delivery-planner', { state: { orderIds: [orderId] } })}
            >
              <img src={deliveryPlanner2Icon} alt="" className="btn-add-planner-icon" aria-hidden="true" />
              <span>Add to Delivery Planner</span>
            </button>
          </div>

          <div className="order-sub-actions-row">
            <button type="button" className="sub-action-text-btn" onClick={onMarkPriority} disabled={isBusy}>
              {isUrgent ? 'Clear Priority' : 'Mark Priority'}
            </button>
            <span className="sub-action-divider">&bull;</span>
            <button type="button" className="sub-action-text-btn" onClick={onDefer} disabled={isBusy || !canDefer}>
              Defer Order
            </button>
            <span className="sub-action-divider">&bull;</span>
            <button type="button" className="sub-action-text-btn btn-cancel-text" onClick={onCancel} disabled={isBusy || !canCancel}>
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
