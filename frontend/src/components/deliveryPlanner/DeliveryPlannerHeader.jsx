import dateIcon from '../../assets/icons/date.svg'
import allDepotsIcon from '../../assets/icons/all-depots.svg'
import suggestIcon from '../../assets/icons/suggest.svg'
import saveIcon from '../../assets/icons/save.svg'
import planIcon from '../../assets/icons/plan.svg'

export default function DeliveryPlannerHeader() {
  return (
    <div className="planner-header-container">
      {/* Top Title & Primary Actions Row */}
      <div className="planner-top-row">
        <div className="planner-title-group">
          <h1 className="planner-title">Delivery Planner</h1>
          <p className="planner-subtitle">Build today's delivery plan</p>
          <div className="planner-draft-status">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Draft plan • Last saved 4:42 PM</span>
          </div>
        </div>

        <div className="planner-actions-group">
          {/* Date Selector */}
          <div className="planner-dropdown-btn">
            <img src={dateIcon} alt="" className="planner-btn-icon" />
            <span>26 September 2026</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Depot Selector */}
          <div className="planner-dropdown-btn">
            <img src={allDepotsIcon} alt="" className="planner-btn-icon" />
            <span>All Depots</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Suggest Plan */}
          <button type="button" className="planner-btn-outline">
            <img src={suggestIcon} alt="" className="planner-btn-icon" />
            <span>Suggest Plan</span>
          </button>

          {/* Save Draft */}
          <button type="button" className="planner-btn-outline">
            <img src={saveIcon} alt="" className="planner-btn-icon" />
            <span>Save Draft</span>
          </button>

          {/* Publish Plan */}
          <button type="button" className="planner-btn-primary">
            <img src={planIcon} alt="" className="planner-btn-icon-white" />
            <span>Publish Plan</span>
          </button>
        </div>
      </div>

      {/* Advisory Info Banner */}
      <div className="planner-advisory-banner">
        <div className="advisory-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <p className="advisory-text">
          Suggested allocation based on vehicle capacity, temperature requirements, outlet restrictions, delivery windows, depot, and fuel availability. Results are a reviewable draft — Dispatcher remains in control.
        </p>
      </div>
    </div>
  )
}
