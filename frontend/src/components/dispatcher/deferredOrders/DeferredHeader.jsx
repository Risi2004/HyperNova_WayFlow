import { useNavigate } from 'react-router-dom'
import dateIcon from '../../../assets/icons/date.svg'
import searchIcon from '../../../assets/icons/search.svg'

export default function DeferredHeader() {
  const navigate = useNavigate()

  return (
    <div className="deferred-header-container">
      {/* Title & Subtitle */}
      <div className="deferred-title-group">
        <h1 className="deferred-page-title">Deferred Orders</h1>
        <p className="deferred-page-subtitle">
          Orders that could not be scheduled for the current delivery run
        </p>
      </div>

      {/* Top Actions & Global Controls */}
      <div className="deferred-header-actions">
        {/* Date Picker Button */}
        <div className="deferred-date-picker-btn">
          <span>26 September 2026</span>
          <img src={dateIcon} alt="" className="deferred-date-icon" />
        </div>

        {/* Search Waypoint Input */}
        <div className="deferred-header-search">
          <svg
            className="deferred-header-search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Waypoint..."
            className="deferred-header-search-input"
          />
        </div>

        {/* Export Button */}
        <button type="button" className="btn-deferred-export" title="Export Deferred Orders">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export</span>
        </button>

        {/* Review Planning Primary Button */}
        <button
          type="button"
          className="btn-review-planning-primary"
          onClick={() => navigate('/dispatcher/delivery-planner')}
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
