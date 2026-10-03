import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import dashboardIcon from '../../assets/icons/dashboard.svg'
import loadsIcon from '../../assets/icons/load.svg'
import historyIcon from '../../assets/icons/date.svg'
import settingsIcon from '../../assets/icons/settings.svg'
import { authService } from '../../services/authService'
import './LoaderSidebar.css'
import { useCurrentUser, initialsOf } from '../../hooks/useCurrentUser'

export default function LoaderSidebar({ activeItem = 'Dashboard' }) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    setIsMobileOpen(false)
    authService.logout()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const navItems = [
    { label: 'Dashboard', icon: dashboardIcon, path: '/loader/dashboard' },
    { label: "Today's Loads", icon: loadsIcon, path: '/loader/today-loads' },
    { label: 'Loading History', icon: historyIcon, path: '/loader/loading-history' },
    { label: 'Settings', icon: settingsIcon, path: '/loader/settings' },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Bar (<= 900px) */}
      <header className="loader-mobile-menubar">
        <div className="loader-mobile-menubar-left" onClick={() => handleNavClick('/loader/dashboard')}>
          <img src={logoImg} alt="WayFlow Logo" className="loader-mobile-logo" />
          <span className="loader-mobile-brand-name">WAYFLOW</span>
        </div>

        <div className="loader-mobile-menubar-right">
          <span className="loader-mobile-active-tag">{activeItem}</span>
          <button
            type="button"
            className="btn-loader-hamburger"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Box */}
      {isMobileOpen && (
        <div className="loader-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="loader-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="loader-mobile-drawer-header">
              <div className="loader-mobile-drawer-brand">
                <img src={logoImg} alt="WayFlow Logo" className="loader-sidebar-logo" />
                <span className="loader-sidebar-brand-name">WAYFLOW</span>
              </div>
              <button
                type="button"
                className="btn-loader-drawer-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="loader-user-card" style={{ margin: '12px 14px' }}>
              <div className="loader-user-left">
                <div className="loader-avatar">{initialsOf(user?.name)}</div>
                <div className="loader-user-meta">
                  <span className="loader-user-name">{user?.name}</span>
                  <span className="loader-user-role">{user?.role} • {user?.facility}</span>
                </div>
              </div>
            </div>

            <nav className="loader-sidebar-nav" style={{ padding: '0 10px', flex: 1 }}>
              {navItems.map((item) => {
                const isActive = activeItem === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`loader-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <img src={item.icon} alt="" className="loader-nav-icon" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            <div className="loader-sidebar-bottom" style={{ padding: '16px', background: '#fafbfc' }}>
              <button
                type="button"
                className="loader-logout-btn"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (> 900px) */}
      <aside className="loader-sidebar">
        <div className="loader-sidebar-top">
          {/* Brand */}
          <div className="loader-sidebar-brand" onClick={() => navigate('/loader/dashboard')}>
            <img src={logoImg} alt="WayFlow Logo" className="loader-sidebar-logo" />
            <span className="loader-sidebar-brand-name">WAYFLOW</span>
          </div>

          {/* User Card */}
          <div className="loader-user-card" title="Loader Profile">
            <div className="loader-user-left">
              <div className="loader-avatar">{initialsOf(user?.name)}</div>
              <div className="loader-user-meta">
                <span className="loader-user-name">{user?.name}</span>
                <span className="loader-user-role">{user?.role} • {user?.facility}</span>
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
            onClick={handleLogout}
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
    </>
  )
}
