export default function LoadHeroCard({
  load,
  onReportIssue,
  onContinueLoading,
}) {
  return (
    <div className="load-hero-card">
      {/* Top Row: Title + Status Pill and Top Action Buttons */}
      <div className="load-hero-top-row">
        <div className="load-hero-id-group">
          <h2 className="load-hero-id">{load.id}</h2>
          <span className={`load-status-badge badge-${load.statusType || 'loading'}`}>{load.status}</span>
        </div>

        <div className="load-hero-actions">
          <button
            type="button"
            className="btn-report-issue"
            onClick={onReportIssue}
            disabled={!load.canEdit}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Report Loading Issue</span>
          </button>
          {load.actionLabel && (
            <button
              type="button"
              className="btn-continue-loading"
              onClick={onContinueLoading}
              disabled={load.actionDisabled}
            >
              {load.actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* 4-column Meta Grid */}
      <div className="load-hero-meta-grid">
        {/* Vehicle ID */}
        <div className="hero-meta-item">
          <span className="hero-meta-label">VEHICLE ID</span>
          <span className="hero-meta-val bold">{load.vehicleId}</span>
          <span className="hero-meta-sub">{load.vehicleType}</span>
        </div>

        {/* Route Profile */}
        <div className="hero-meta-item">
          <span className="hero-meta-label">ROUTE PROFILE</span>
          <span className="hero-meta-val bold">{load.routeProfile}</span>
          <span className="hero-meta-sub">{load.routeStopsDistance}</span>
        </div>

        {/* Departure */}
        <div className="hero-meta-item">
          <span className="hero-meta-label">DEPARTURE</span>
          <span className="hero-meta-val bold">{load.departureTime}</span>
          <span className="hero-meta-sub departure-amber">{load.departureSub}</span>
        </div>

        {/* Preparation Progress */}
        <div className="hero-meta-item progress-meta-item">
          <div className="hero-progress-labels">
            <span className="hero-meta-label">PREPARATION PROGRESS</span>
            <span className="hero-progress-percent">{load.progressPercent}%</span>
          </div>
          <div className="hero-progress-track">
            <div
              className="hero-progress-fill"
              style={{ width: `${load.progressPercent}%` }}
            />
          </div>
          <span className="hero-meta-sub">{load.progressSub}</span>
        </div>
      </div>
    </div>
  )
}
