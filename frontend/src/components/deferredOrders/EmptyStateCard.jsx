import { useNavigate } from 'react-router-dom'

export default function EmptyStateCard() {
  const navigate = useNavigate()

  return (
    <div className="deferred-empty-state-card">
      <div className="empty-state-check-circle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h3 className="empty-state-title">No Deferred Orders</h3>
      <p className="empty-state-desc">
        All confirmed orders are currently assigned to feasible delivery routes.
      </p>

      <button
        type="button"
        className="btn-view-planner-blue"
        onClick={() => navigate('/dispatcher/delivery-planner')}
      >
        View Delivery Planner
      </button>

      <span className="empty-state-footer-tag">ASSOCIATED EMPTY STATE</span>
    </div>
  )
}
