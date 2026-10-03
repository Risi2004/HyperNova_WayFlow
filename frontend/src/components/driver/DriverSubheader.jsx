import { useCurrentUser, initialsOf, firstNameOf, greetingFor, longDateLabel } from '../../hooks/useCurrentUser'
export default function DriverSubheader({
  driverName,
  dateText,
  isOnline = true,
  onNotificationClick,
}) {
  const user = useCurrentUser()
  return (
    <div className="driver-subheader-row">
      {/* Title & Greeting */}
      <div className="driver-subheader-left">
        <h1 className="driver-dashboard-title">Driver Dashboard</h1>
        <p className="driver-dashboard-greeting">
          <span className="driver-greeting-highlight">{greetingFor()}, {driverName || firstNameOf(user?.name)}</span>
          <span className="driver-greeting-bullet">•</span>
          <span>{dateText || longDateLabel()}</span>
        </p>
      </div>

      {/* Online Badge, Alerts & Mini Avatar */}
      <div className="driver-subheader-right">
        <div className={`driver-status-badge ${isOnline ? 'online' : 'offline'}`}>
          <span className="status-dot-pulse" />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <button
          type="button"
          className="driver-bell-btn"
          aria-label="Notifications"
          onClick={onNotificationClick}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="bell-badge-indicator" />
        </button>

        <div className="driver-mini-avatar" title={user?.name}>
          {initialsOf(user?.name)}
        </div>
      </div>
    </div>
  )
}
