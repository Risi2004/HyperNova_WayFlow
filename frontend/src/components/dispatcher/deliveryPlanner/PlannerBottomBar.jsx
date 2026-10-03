import deferredIcon from '../../../assets/icons/deferred-orders.svg'
import saveIcon from '../../../assets/icons/save.svg'
import planIcon from '../../../assets/icons/plan.svg'

export default function PlannerBottomBar({ stats, plan, isBusy, onReviewDeferrals, onSaveDraft, onPublish }) {
  const published = plan?.status === 'published'
  const s = stats || { planned: 0, unscheduled: 0, routes: 0, constraint_errors: 0 }

  return (
    <div className="planner-sticky-bottom-bar">
      {/* Left Planning Status Metrics */}
      <div className="bottom-bar-left-group">
        <div className="live-stat-item">
          <span className="live-stat-text bold">{s.planned} orders planned</span>
        </div>
        <div className="live-stat-item">
          <span className="live-stat-text">
            {s.unscheduled} {published ? 'left unplanned' : 'to be deferred'}
          </span>
        </div>

        {/* Status Badges Row */}
        <div className="bottom-badges-strip">
          <span className="summary-status-badge badge-green">{s.routes} ROUTES READY</span>
          <span className="summary-status-badge badge-green">{s.planned} ORDERS ASSIGNED</span>
          <span className={`summary-status-badge ${s.unscheduled ? 'badge-amber' : 'badge-green'}`}>{s.unscheduled} ORDERS UNSCHEDULED</span>
          <span className={`summary-status-badge ${s.constraint_errors ? 'badge-amber' : 'badge-green'}`}>
            {s.constraint_errors} UNRESOLVED CONSTRAINT ERRORS
          </span>
        </div>
      </div>

      {/* Right Primary Action Buttons */}
      <div className="bottom-bar-actions-group">
        <button type="button" className="btn-bottom-outline" onClick={onReviewDeferrals}>
          <img src={deferredIcon} alt="" className="btn-bottom-icon" />
          <span>Review Deferrals</span>
        </button>
        <button type="button" className="btn-bottom-outline" onClick={onSaveDraft} disabled={isBusy || published}>
          <img src={saveIcon} alt="" className="btn-bottom-icon" />
          <span>Save Draft</span>
        </button>
        <button
          type="button"
          className="btn-bottom-primary"
          onClick={onPublish}
          disabled={isBusy || published || !plan || plan.status === 'none' || s.constraint_errors > 0}
        >
          <img src={planIcon} alt="" className="btn-bottom-icon-white" />
          <span>{published ? 'Published' : 'Publish Plan'}</span>
        </button>
      </div>
    </div>
  )
}
