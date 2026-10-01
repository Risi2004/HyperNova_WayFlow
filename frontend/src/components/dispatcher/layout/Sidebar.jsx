import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../../assets/images/logo.png'
import dashboardIcon from '../../../assets/icons/dashboard.svg'
import ordersIcon from '../../../assets/icons/orders.svg'
import deliveryPlannerIcon from '../../../assets/icons/delivery-planner.svg'
import fleetAvailabilityIcon from '../../../assets/icons/fleet-availability.svg'
import routesIcon from '../../../assets/icons/routes.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'
import liveDeliveriesIcon from '../../../assets/icons/live-deliveries.svg'
import deliveryHistoryIcon from '../../../assets/icons/delivery-history.svg'
import settingsIcon from '../../../assets/icons/settings.svg'
import { authService } from '../../../services/authService'
import './Sidebar.css'

export default function Sidebar({ activeItem = 'Dashboard' }) {
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
    { label: 'Dashboard', icon: dashboardIcon, path: '/dispatcher/dashboard' },
    { label: 'Orders', icon: ordersIcon, path: '/dispatcher/orders' },
    { label: 'Delivery Planner', icon: deliveryPlannerIcon, path: '/dispatcher/delivery-planner' },
    { label: 'Fleet Availability', icon: fleetAvailabilityIcon, path: '/dispatcher/fleet-availability' },
    { label: 'Routes', icon: routesIcon, path: '/dispatcher/routes' },
    { label: 'Deferred Orders', icon: deferredOrdersIcon, path: '/dispatcher/deferred-orders' },
    { label: 'Live Deliveries', icon: liveDeliveriesIcon, path: '/dispatcher/live-deliveries' },
    { label: 'Delivery History', icon: deliveryHistoryIcon, path: '/dispatcher/delivery-history' },
    { label: 'Settings', icon: settingsIcon, path: '/dispatcher/settings' },
  ]

  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Bar (<= 900px) */}
      <header className="dispatcher-mobile-menubar">
        <div className="dispatcher-mobile-menubar-left" onClick={() => handleNavClick('/dispatcher/dashboard')}>
          <img src={logoImg} alt="WayFlow Logo" className="dispatcher-mobile-logo" />
          <span className="dispatcher-mobile-brand-name">WAYFLOW</span>
        </div>

        <div className="dispatcher-mobile-menubar-right">
          <span className="dispatcher-mobile-active-tag">{activeItem}</span>
          <button
            type="button"
            className="btn-dispatcher-hamburger"
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
        <div className="dispatcher-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="dispatcher-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="dispatcher-mobile-drawer-header">
              <div className="dispatcher-mobile-drawer-brand">
                <img src={logoImg} alt="WayFlow Logo" className="sidebar-logo" />
                <span className="sidebar-brand-name">WAYFLOW</span>
              </div>
              <button
                type="button"
                className="btn-dispatcher-drawer-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="sidebar-user-card" style={{ margin: '12px 14px' }}>
              <div className="sidebar-user-left">
                <div className="sidebar-avatar">JD</div>
                <div className="sidebar-user-meta">
                  <span className="sidebar-user-name">Jordan Davis</span>
                  <span className="sidebar-user-role">Dispatcher • West Hub</span>
                </div>
              </div>
            </div>

            <nav className="sidebar-nav" style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`sidebar-nav-item ${activeItem === item.label ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  <img src={item.icon} alt="" className="sidebar-nav-icon" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="sidebar-bottom" style={{ padding: '16px', background: '#fafbfc' }}>
              <button
                type="button"
                className="sidebar-logout-btn"
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
      <aside className="dispatcher-sidebar">
        <div className="sidebar-top">
          {/* Brand */}
          <div className="sidebar-brand" onClick={() => navigate('/dispatcher/dashboard')}>
            <img src={logoImg} alt="WayFlow Logo" className="sidebar-logo" />
            <span className="sidebar-brand-name">WAYFLOW</span>
          </div>

          {/* User Card */}
          <div className="sidebar-user-card" title="Switch dispatcher profile">
            <div className="sidebar-user-left">
              <div className="sidebar-avatar">JD</div>
              <div className="sidebar-user-meta">
                <span className="sidebar-user-name">Jordan Davis</span>
                <span className="sidebar-user-role">Dispatcher • West Hub</span>
              </div>
            </div>
            <span className="sidebar-user-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
              </svg>
            </span>
          </div>

          {/* Navigation list */}
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`sidebar-nav-item ${activeItem === item.label ? 'active' : ''}`}
                onClick={() => {
                  if (item.path !== '#') {
                    navigate(item.path)
                  }
                }}
              >
                <img src={item.icon} alt="" className="sidebar-nav-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
          <span className="sidebar-version-footer">Waypoint DMS • v4.8</span>
        </div>
      </aside>
    </>
  )
}
