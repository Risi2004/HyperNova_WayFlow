import { useNavigate } from 'react-router-dom'

export default function DeferredHeader({ plannerDate }) {
  const navigate = useNavigate()

  return (
    <div className="deferred-header-container">
      <div className="deferred-title-group">
        <h1 className="deferred-page-title">Deferred Orders</h1>
        <p className="deferred-page-subtitle">Orders the plan could not fit, with the recorded reason and their next run.</p>
      </div>

      <div className="deferred-header-actions">
        <button
          type="button"
          className="btn-review-planning-primary"
          onClick={() => navigate(plannerDate ? `/dispatcher/delivery-planner?date=${plannerDate}` : '/dispatcher/delivery-planner')}
        >
          <span>Review Planning</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
