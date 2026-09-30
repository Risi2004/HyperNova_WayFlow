export default function LoaderHeader({
  title = 'Loader Dashboard',
  hub = 'Peliyagoda Distribution Center',
  dateText = 'Sunday, 27 September 2026',
}) {
  return (
    <header className="loader-header">
      {/* Title & Hub / Date */}
      <div className="loader-header-left">
        <h1 className="loader-page-title">{title}</h1>
        <p className="loader-page-subtitle">
          <span className="hub-highlight">{hub}</span>
          <span className="subtitle-bullet">•</span>
          <span>{dateText}</span>
        </p>
      </div>

      {/* Status & Profile Pill */}
      <div className="loader-header-right">
        {/* Connected Badge */}
        <div className="loader-status-pill connected">
          <span className="status-dot"></span>
          <span>Connected</span>
        </div>

        {/* User Card */}
        <div className="loader-profile-pill">
          <div className="loader-header-avatar">JD</div>
          <div className="loader-header-meta">
            <span className="loader-header-name">Jordan Davis</span>
            <span className="loader-header-role">Depot Lead Loader</span>
          </div>
        </div>
      </div>
    </header>
  )
}
