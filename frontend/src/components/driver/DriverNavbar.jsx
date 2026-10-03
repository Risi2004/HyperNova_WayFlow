import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import logoImg from '../../assets/images/logo.png'
import { useCurrentUser, initialsOf } from '../../hooks/useCurrentUser'

export default function DriverNavbar({ activeTab = 'Dashboard' }) {
  const user = useCurrentUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="driver-top-navbar">
      {/* Left: Brand */}
      <div className="driver-nav-brand-group" onClick={() => navigate('/driver/dashboard')} role="button" tabIndex={0}>
        <img src={logoImg} alt="WayFlow Logo" className="driver-nav-logo" />
        <span className="driver-nav-brand-text">WAYFLOW</span>
      </div>

      {/* Center: Navigation Tabs */}
      <nav className="driver-nav-tabs">
        <button
          type="button"
          className={`driver-nav-tab-btn ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/driver/dashboard')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`driver-nav-tab-btn ${activeTab === 'My Trips' ? 'active' : ''}`}
          onClick={() => navigate('/driver/my-trips')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span>My Trips</span>
        </button>
      </nav>

      {/* Right: Driver Profile & Exit */}
      <div className="driver-nav-user-area">
        <div className="driver-profile-pill" title="Driver Profile">
          <div className="driver-avatar-circle">{initialsOf(user?.name)}</div>
          <div className="driver-meta-text">
            <span className="driver-user-name">{user?.name}</span>
            <span className="driver-user-role">{user?.role} • {user?.assigned_vehicle_id || user?.facility}</span>
          </div>
        </div>

        <button
          type="button"
          className="driver-logout-btn"
          title="Sign out to Login"
          onClick={handleLogout}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  )
}
