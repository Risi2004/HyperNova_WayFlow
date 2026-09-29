import { useNavigate } from 'react-router-dom'
import priorityIcon from '../../assets/icons/priority.svg'
import deferredOrdersIcon from '../../assets/icons/deferred-orders.svg'
import cancelIcon from '../../assets/icons/cancel.svg'
import deliveryPlanner2Icon from '../../assets/icons/delivery-planner2.svg'

export default function OrderBottomBar() {
  const navigate = useNavigate()

  return (
    <div className="order-details-bottom-bar">
      <div className="bottom-bar-left">
        <span>Ready to begin planning? Add this order to a delivery plan.</span>
      </div>

      <div className="bottom-bar-right">
        <button type="button" className="action-pill-btn">
          <img src={priorityIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>Mark as Priority</span>
        </button>

        <button type="button" className="action-pill-btn">
          <img src={deferredOrdersIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>Defer Order</span>
        </button>

        <button type="button" className="action-pill-btn btn-danger-cancel">
          <img src={cancelIcon} alt="" className="action-icon" aria-hidden="true" />
          <span>Cancel Order</span>
        </button>

        <button
          type="button"
          className="action-pill-btn-green"
          onClick={() => navigate('/dispatcher/delivery-planner')}
        >
          <img src={deliveryPlanner2Icon} alt="" className="action-icon" aria-hidden="true" />
          <span>Add to Delivery Planner</span>
        </button>
      </div>
    </div>
  )
}
