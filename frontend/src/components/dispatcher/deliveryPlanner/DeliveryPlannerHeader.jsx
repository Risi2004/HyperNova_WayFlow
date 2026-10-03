import { Link } from 'react-router-dom'
import dateIcon from '../../../assets/icons/date.svg'
import allDepotsIcon from '../../../assets/icons/all-depots.svg'
import suggestIcon from '../../../assets/icons/suggest.svg'
import saveIcon from '../../../assets/icons/save.svg'
import planIcon from '../../../assets/icons/plan.svg'
import { formatTimestamp } from '../../../utils/orderFormat'

function statusLine(plan) {
  if (!plan || plan.status === 'none') return 'No plan yet • run Suggest Plan to build one'
  if (plan.status === 'published') {
    const t = formatTimestamp(plan.published_at)
    return `Published ${t.date} at ${t.time} • handed to loaders and drivers`
  }
  const t = formatTimestamp(plan.updated_at)
  return `Draft plan • Last saved ${t.time}`
}

export default function DeliveryPlannerHeader({
  date,
  onDateChange,
  depot,
  onDepotChange,
  plan,
  awaitingCutoff = 0,
  isBusy,
  onSuggest,
  onRebuild,
  onSaveDraft,
  onPublish,
  onLoadScenario,
}) {
  const published = plan?.status === 'published'

  return (
    <div className="planner-header-container">
      {/* Top Title & Primary Actions Row */}
      <div className="planner-top-row">
        <div className="planner-title-group">
          <h1 className="planner-title">Delivery Planner</h1>
          <p className="planner-subtitle">Build the delivery plan for a run date</p>
          <div className="planner-draft-status">
            <span>{statusLine(plan)}</span>
          </div>
        </div>

        <div className="planner-actions-group">
          {/* Date Selector */}
          <label className="planner-dropdown-btn">
            <img src={dateIcon} alt="" className="planner-btn-icon" />
            <input
              type="date"
              className="planner-inline-input"
              value={date}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              aria-label="Delivery date"
            />
          </label>

          {/* Depot Selector */}
          <label className="planner-dropdown-btn">
            <img src={allDepotsIcon} alt="" className="planner-btn-icon" />
            <select className="planner-inline-input" value={depot} onChange={(e) => onDepotChange(e.target.value)} aria-label="Depot">
              <option value="all">All Depots</option>
              <option value="Peliyagoda">Peliyagoda DC</option>
              <option value="Kandy">Kandy Hub</option>
            </select>
          </label>

          {/* Suggest Plan */}
          <button type="button" className="planner-btn-outline" onClick={onSuggest} disabled={isBusy || published}>
            <img src={suggestIcon} alt="" className="planner-btn-icon" />
            <span>Suggest Plan</span>
          </button>

          {/* Save Draft */}
          <button type="button" className="planner-btn-outline" onClick={onSaveDraft} disabled={isBusy || published}>
            <img src={saveIcon} alt="" className="planner-btn-icon" />
            <span>Save Draft</span>
          </button>

          {/* Publish Plan */}
          <button type="button" className="planner-btn-primary" onClick={onPublish} disabled={isBusy || published || !plan || plan.status === 'none'}>
            <img src={planIcon} alt="" className="planner-btn-icon-white" />
            <span>{published ? 'Published' : 'Publish Plan'}</span>
          </button>
        </div>
      </div>

      {/* Advisory Info Banner */}
      <div className="planner-advisory-banner">
        <div className="advisory-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <p className="advisory-text">
          Suggested allocation respects vehicle weight and volume, refrigeration, van-only access, depot, one brand and district per
          trip, two trips per vehicle, the Fresh 270-min and Style/Tech 480-min budgets, delivery windows and weekly fuel. Outlets
          deferred on an earlier run are served first. The draft is yours to review — nothing reaches the depot until you publish.
          {onRebuild && !published && (
            <>
              {' '}
              <button type="button" className="planner-link-btn" onClick={onRebuild} disabled={isBusy}>
                Rebuild from scratch
              </button>
            </>
          )}
          {!published && (
            <>
              {onRebuild ? ' • ' : ' '}
              <button type="button" className="planner-link-btn" onClick={onLoadScenario} disabled={isBusy}>
                Load peak-day scenario
              </button>
            </>
          )}
        </p>
      </div>

      {awaitingCutoff > 0 && !published && (
        <div className="planner-cutoff-warning">
          {awaitingCutoff} order{awaitingCutoff === 1 ? ' is' : 's are'} still awaiting the 4:00 PM cutoff for this date and will not be
          planned until intake closes. <Link to="/dispatcher/orders">Close intake on the Orders page</Link>.
        </div>
      )}
    </div>
  )
}
