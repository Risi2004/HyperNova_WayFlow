import { useCurrentUser, initialsOf, longDateLabel } from '../../hooks/useCurrentUser'
export default function LoaderHeader({
  title = 'Loader Dashboard',
  hub,
  dateText,
}) {
  const user = useCurrentUser()
  return (
    <header className="loader-header">
      {/* Title & Hub / Date */}
      <div className="loader-header-left">
        <h1 className="loader-page-title">{title}</h1>
        <p className="loader-page-subtitle">
          <span className="hub-highlight">{hub || user?.facility}</span>
          <span className="subtitle-bullet">•</span>
          <span>{dateText || longDateLabel()}</span>
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
          <div className="loader-header-avatar">{initialsOf(user?.name)}</div>
          <div className="loader-header-meta">
            <span className="loader-header-name">{user?.name}</span>
            <span className="loader-header-role">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
