import deferredIcon from '../../../assets/icons/deferred-orders.svg'
import saveIcon from '../../../assets/icons/save.svg'
import planIcon from '../../../assets/icons/plan.svg'

export default function PlannerBottomBar() {
  return (
    <div className="planner-sticky-bottom-bar">
      {/* Left Planning Status Metrics */}
      <div className="bottom-bar-left-group">
        <div className="live-stat-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="live-stat-text bold">24 orders planned</span>
        </div>

        <div className="live-stat-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="live-stat-text">7 orders deferred</span>
        </div>

        {/* Status Badges Row */}
        <div className="bottom-badges-strip">
          <span className="summary-status-badge badge-green">12 ROUTES READY</span>
          <span className="summary-status-badge badge-green">62 ORDERS ASSIGNED</span>
          <span className="summary-status-badge badge-amber">7 ORDERS DEFERRED</span>
          <span className="summary-status-badge badge-green">0 UNRESOLVED CONSTRAINT ERRORS</span>
        </div>
      </div>

      {/* Right Primary Action Buttons */}
      <div className="bottom-bar-actions-group">
        <button type="button" className="btn-bottom-outline">
          <img src={deferredIcon} alt="" className="btn-bottom-icon" />
          <span>Review Deferrals</span>
        </button>

        <button type="button" className="btn-bottom-outline">
          <img src={saveIcon} alt="" className="btn-bottom-icon" />
          <span>Save Draft</span>
        </button>

        <button type="button" className="btn-bottom-primary">
          <img src={planIcon} alt="" className="btn-bottom-icon-white" />
          <span>Publish Plan</span>
        </button>
      </div>
    </div>
  )
}
