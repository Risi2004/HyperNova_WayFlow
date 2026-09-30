import { useNavigate } from 'react-router-dom'
import planIcon from '../../../assets/icons/plan.svg'
import ordersIcon from '../../../assets/icons/orders.svg'
import fleetAvailabilityIcon from '../../../assets/icons/fleet-availability.svg'
import liveDeliveriesIcon from '../../../assets/icons/live-deliveries.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="dashboard-card quick-actions-card">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Quick Actions</h2>
          <span className="card-subheading">Common operational tasks</span>
        </div>
      </div>

      <div className="quick-actions-grid">
        <button type="button" className="action-btn-primary">
          <img src={planIcon} alt="" className="action-btn-icon" aria-hidden="true" />
          <span>Plan Today's Deliveries</span>
        </button>

        <button
          type="button"
          className="action-btn-outline"
          onClick={() => navigate('/dispatcher/orders')}
        >
          <img src={ordersIcon} alt="" className="action-btn-icon" aria-hidden="true" />
          <span>View Orders</span>
        </button>

        <button type="button" className="action-btn-outline">
          <img src={fleetAvailabilityIcon} alt="" className="action-btn-icon" aria-hidden="true" />
          <span>Check Fleet</span>
        </button>

        <button type="button" className="action-btn-outline">
          <img src={liveDeliveriesIcon} alt="" className="action-btn-icon" aria-hidden="true" />
          <span>View Live Deliveries</span>
        </button>

        <button type="button" className="action-btn-outline">
          <img src={deferredOrdersIcon} alt="" className="action-btn-icon" aria-hidden="true" />
          <span>Review Deferred Orders</span>
        </button>
      </div>
    </div>
  )
}
