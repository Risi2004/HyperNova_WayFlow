import { useNavigate } from 'react-router-dom'

export default function LoadDetailHeader({
  loadId = 'LD-025',
  hub = 'Peliyagoda Distribution Center',
}) {
  const navigate = useNavigate()

  return (
    <header className="load-detail-header">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="load-detail-header-left">
        <nav className="load-breadcrumbs" aria-label="Breadcrumb">
          <button
            type="button"
            className="breadcrumb-link"
            onClick={() => navigate('/loader/today-loads')}
          >
            Today's Loads
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{loadId} Details</span>
        </nav>
        <h1 className="load-detail-title">Load Preparation Terminal</h1>
      </div>

      {/* Right: Connected Status & Hub Info & Avatar */}
      <div className="load-detail-header-right">
        <div className="loader-status-pill connected">
          <span className="status-dot"></span>
          <span>Connected</span>
        </div>
        <span className="load-detail-hub-name">{hub}</span>
        <div className="load-detail-avatar-circle">JD</div>
      </div>
    </header>
  )
}
