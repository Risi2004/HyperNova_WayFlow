import { useNavigate } from 'react-router-dom'

export default function ReportIssueHeader({
  loadId = 'LD-025',
  vehicleId = 'WP-REF-007',
}) {
  const navigate = useNavigate()

  return (
    <header className="report-issue-header">
      {/* Breadcrumb & Title */}
      <div className="report-issue-header-left">
        <nav className="report-issue-breadcrumbs" aria-label="Breadcrumb">
          <button
            type="button"
            className="breadcrumb-nav-link"
            onClick={() => navigate('/loader/today-loads')}
          >
            Today's Loads
          </button>
          <span className="breadcrumb-nav-sep">/</span>
          <button
            type="button"
            className="breadcrumb-nav-link"
            onClick={() => navigate(`/loader/today-orders/${loadId}`)}
          >
            {loadId}
          </button>
          <span className="breadcrumb-nav-sep">/</span>
          <span className="breadcrumb-nav-current">Report Loading Issue</span>
        </nav>
        <h1 className="report-issue-title">Report Loading Issue</h1>
      </div>

      {/* Right side info & avatar */}
      <div className="report-issue-header-right">
        <span className="report-header-load-meta">
          {loadId} · {vehicleId}
        </span>
        <div className="loader-status-pill connected">
          <span className="status-dot"></span>
          <span>Connected</span>
        </div>
        <div className="report-header-avatar">JD</div>
      </div>
    </header>
  )
}
