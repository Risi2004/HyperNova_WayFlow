import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import './AdminSidebar.css'

export default function AdminSidebar({ activeItem, activeTab }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Normalize current active label
  const resolvedActive =
    activeItem ||
    (activeTab === 'users' ? 'User Management' : 'Dashboard') ||
    (location.pathname.includes('/users') ? 'User Management' : 'Dashboard')

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.75" y="1.75" width="5" height="5" rx="1.2" />
          <rect x="9.25" y="1.75" width="5" height="5" rx="1.2" />
          <rect x="1.75" y="9.25" width="5" height="5" rx="1.2" />
          <rect x="9.25" y="9.25" width="5" height="5" rx="1.2" />
        </svg>
      ),
    },
    {
      label: 'User Management',
      path: '/admin/users',
      badge: '10 Users',
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 13.5v-1a2.5 2.5 0 0 0-2.5-2.5h-5A2.5 2.5 0 0 0 1 12.5v1" />
          <circle cx="6" cy="5" r="3" />
          <path d="M15 13.5v-1a2.5 2.5 0 0 0-2-2.45" />
          <path d="M11 2.05a3 3 0 0 1 0 5.9" />
        </svg>
      ),
    },
    {
      label: 'Dispatcher Console',
      path: '/dispatcher/dashboard',
      isExternalRole: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
          <path d="M5 2.5V13.5" />
          <path d="M1.5 6.5H5" />
          <path d="M1.5 9.5H5" />
        </svg>
      ),
    },
    {
      label: 'Store Manager Portal',
      path: '/store-manager/dashboard',
      isExternalRole: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 5.5L8 2.5L14 5.5V13.5H2V5.5Z" />
          <path d="M6 13.5V9.5H10V13.5" />
        </svg>
      ),
    },
    {
      label: 'Loader Dashboard',
      path: '/loader/dashboard',
      isExternalRole: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 1.5L14 4.75V11.25L8 14.5L2 11.25V4.75L8 1.5Z" />
          <path d="M8 1.5V14.5" />
          <path d="M14 4.75L8 8L2 4.75" />
        </svg>
      ),
    },
    {
      label: 'Driver Dashboard',
      path: '/driver/dashboard',
      isExternalRole: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 3H10.5V11.5H1V3Z" rx="1" />
          <path d="M10.5 6H13.25L15 8.5V11.5H10.5V6Z" />
          <circle cx="4.25" cy="12.5" r="1.5" />
          <circle cx="12.5" cy="12.5" r="1.5" />
        </svg>
      ),
    },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Top Header (<= 900px) */}
      <header className="admin-mobile-menubar">
        <div className="admin-mobile-menubar-left" onClick={() => handleNavClick('/admin/dashboard')}>
          <img src={logoImg} alt="WayFlow Logo" className="admin-mobile-logo" />
          <span className="admin-mobile-brand-name">WAYFLOW</span>
          <span className="admin-pill-badge">ADMIN</span>
        </div>

        <div className="admin-mobile-menubar-right">
          <span className="admin-mobile-active-tag">{resolvedActive}</span>
          <button
            type="button"
            className="btn-admin-hamburger"
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

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="admin-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-mobile-drawer-header">
              <div className="admin-mobile-drawer-brand">
                <img src={logoImg} alt="WayFlow Logo" className="admin-sidebar-logo" />
                <span className="admin-sidebar-brand-name">WAYFLOW</span>
                <span className="admin-pill-badge">ADMIN</span>
              </div>
              <button
                type="button"
                className="btn-admin-drawer-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Admin Profile Card */}
            <div className="admin-user-card" style={{ margin: '14px 14px 10px' }}>
              <div className="admin-user-left">
                <div className="admin-avatar">AV</div>
                <div className="admin-user-meta">
                  <span className="admin-user-name">Alexander Vance</span>
                  <span className="admin-user-role">Super Admin • Regional HQ</span>
                </div>
              </div>
              <span className="admin-user-status-dot" title="Admin Active" />
            </div>

            {/* Mobile Nav Links */}
            <nav className="admin-sidebar-nav" style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
              <div className="admin-nav-section-label">ADMINISTRATION</div>
              {navItems.slice(0, 2).map((item) => {
                const isActive = resolvedActive === item.label || location.pathname === item.path
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="admin-nav-icon">{item.icon}</span>
                    <span className="admin-nav-text">{item.label}</span>
                    {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                  </button>
                )
              })}

              <div className="admin-nav-section-label" style={{ marginTop: '16px' }}>PORTAL PREVIEWS</div>
              {navItems.slice(2).map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="admin-nav-item external-role"
                  onClick={() => handleNavClick(item.path)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-text">{item.label}</span>
                  <span className="admin-nav-external-arrow">↗</span>
                </button>
              ))}
            </nav>

            {/* Mobile Bottom */}
            <div className="admin-sidebar-bottom" style={{ padding: '16px', background: '#0a0d14' }}>
              <button
                type="button"
                className="admin-logout-btn"
                onClick={() => {
                  setIsMobileOpen(false)
                  navigate('/login')
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
              <span className="admin-version-footer">Waypoint DMS · Admin v4.9</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Dark Theme Sidebar (> 900px) */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          {/* Brand Header */}
          <div className="admin-sidebar-brand" onClick={() => navigate('/admin/dashboard')}>
            <img src={logoImg} alt="WayFlow Logo" className="admin-sidebar-logo" />
            <span className="admin-sidebar-brand-name">WAYFLOW</span>
            <span className="admin-pill-badge">ADMIN</span>
          </div>

          {/* User Profile Card */}
          <div className="admin-user-card" title="Super Administrator Profile">
            <div className="admin-user-left">
              <div className="admin-avatar">AV</div>
              <div className="admin-user-meta">
                <span className="admin-user-name">Alexander Vance</span>
                <span className="admin-user-role">Super Admin • Regional HQ</span>
              </div>
            </div>
            <span className="admin-user-status-dot" title="Active Root Admin" />
          </div>

          {/* Navigation Links */}
          <nav className="admin-sidebar-nav">
            <div className="admin-nav-section-label">ADMINISTRATION</div>
            {navItems.slice(0, 2).map((item) => {
              const isActive = resolvedActive === item.label || location.pathname === item.path
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span className="admin-nav-text">{item.label}</span>
                  {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
                </button>
              )
            })}

            <div className="admin-nav-section-label" style={{ marginTop: '18px' }}>SWITCH TO ROLE</div>
            {navItems.slice(2).map((item) => (
              <button
                key={item.label}
                type="button"
                className="admin-nav-item external-role"
                title={`Quick inspect ${item.label}`}
                onClick={() => navigate(item.path)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span className="admin-nav-text">{item.label}</span>
                <span className="admin-nav-external-arrow">↗</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => navigate('/login')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Exit Admin Console</span>
          </button>
          <span className="admin-version-footer">Waypoint DMS · Admin v4.9 • Dark Mode</span>
        </div>
      </aside>
    </>
  )
}
