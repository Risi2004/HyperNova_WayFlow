import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../../utils/orderFormat'

export default function LiveEmptyStateCard({ date }) {
  const navigate = useNavigate()

  return (
    <div className="live-empty-state-card">
      <h3 className="empty-state-title">No published trips</h3>
      <p className="empty-state-desc">Nothing has been published for {formatDate(date)}. Generate and publish a plan in the Delivery Planner.</p>
      <button type="button" className="btn-view-routes-blue" onClick={() => navigate('/dispatcher/delivery-planner')}>
        Open Delivery Planner
      </button>
    </div>
  )
}
