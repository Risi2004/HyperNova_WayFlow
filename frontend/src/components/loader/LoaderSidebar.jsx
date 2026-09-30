import { useNavigate } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import dashboardIcon from '../../assets/icons/dashboard.svg'
import loadsIcon from '../../assets/icons/load.svg'
import historyIcon from '../../assets/icons/date.svg'
import settingsIcon from '../../assets/icons/settings.svg'
import './LoaderSidebar.css'

export default function LoaderSidebar({ activeItem = 'Dashboard' }) {
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', icon: dashboardIcon, path: '/loader/dashboard' },
    { label: "Today's Loads", icon: loadsIcon, path: '/loader/today-loads' },
    { label: 'Loading History', icon: historyIcon, path: '/loader/loading-history' },
    { label: 'Settings', icon: settingsIcon, path: '/loader/settings' },
  ]

  return (
    <aside className="loader-sidebar">
      <div className="loader-sidebar-top">
        {/* Brand */}
        <div className="loader-sidebar-brand">
          <img src={logoImg} alt="WayFlow Logo" className="loader-sidebar-logo" />
          <span className="loader-sidebar-brand-name">WAYFLOW</span>
        </div>

        {/* User Card */}
        <div className="loader-user-card" title="Loader Profile">
          <div className="loader-user-left">
            <div className="loader-avatar">JD</div>
            <div className="loader-user-meta">
              <span className="loader-user-name">Jordan Davis</span>
              <span className="loader-user-role">Loader • Peliyagoda DC</span>
            </div>
          </div>
          <span className="loader-user-arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
            </svg>
          </span>
        </div>

        {/* Navigation List */}
        <nav className="loader-sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeItem === item.label
            return (
              <button
                key={item.label}
                type="button"
                className={`loader-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <img src={item.icon} alt="" className="loader-nav-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="loader-sidebar-bottom">
        <button
          type="button"
          className="loader-logout-btn"
          onClick={() => navigate('/login')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
        <span className="loader-version-footer">Waypoint DMS · v4.9</span>
      </div>
    </aside>
  )
}
