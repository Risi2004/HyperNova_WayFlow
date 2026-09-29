import { useNavigate } from 'react-router-dom'
import editIcon from '../../assets/icons/edit.svg'
import moreIcon from '../../assets/icons/more.svg'

export default function RouteHeader({ routeId = 'TR-024' }) {
  const navigate = useNavigate()

  return (
    <div className="route-details-header">
      <div className="route-header-left">
        <div className="route-title-badge-row">
          <h1 className="route-main-title">Route {routeId}</h1>
          <span className="route-status-pill pill-planned">
            <span className="status-dot"></span>
            PLANNED
          </span>
        </div>
        <p className="route-subtitle-path">
          Peliyagoda Distribution Center &rarr; Colombo North
        </p>
        <p className="route-date-stamp">Saturday, 26 September 2026</p>
      </div>

      <div className="route-header-actions">
        <button
          type="button"
          className="btn-route-action"
          onClick={() => alert(`Editing route ${routeId}`)}
        >
          <img src={editIcon} alt="" className="route-action-icon" />
          <span>Edit Route</span>
        </button>

        <button
          type="button"
          className="btn-route-action"
          onClick={() => window.print()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="route-action-icon">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Print Route</span>
        </button>

        <button
          type="button"
          className="btn-route-action"
          title="More actions"
        >
          <img src={moreIcon} alt="" className="route-action-icon" />
          <span>More</span>
        </button>
      </div>
    </div>
  )
}
