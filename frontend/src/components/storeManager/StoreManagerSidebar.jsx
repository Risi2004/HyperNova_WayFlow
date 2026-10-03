import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService'
import logoImg from '../../assets/images/logo.png'
import './StoreManagerSidebar.css'
import { useCurrentUser, initialsOf, workplaceOf } from '../../hooks/useCurrentUser'

export default function StoreManagerSidebar({ activeItem = 'Dashboard' }) {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = () => {
    setIsMobileOpen(false)
    authService.logout()
    navigate('/login', { replace: true })
  }

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  // Prevent background scrolling when mobile menu is open
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

  // Navigation items matching exact Dispatcher/Loader color system (#6B778C inactive, #1d4ed8 active blue)
  const navItems = [
    {
      label: 'Dashboard',
      path: '/store-manager/dashboard',
      icon: (
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.75 0.5H1.20833C0.817132 0.5 0.5 0.817132 0.5 1.20833V6.16667C0.5 6.55787 0.817132 6.875 1.20833 6.875H4.75C5.1412 6.875 5.45833 6.55787 5.45833 6.16667V1.20833C5.45833 0.817132 5.1412 0.5 4.75 0.5Z" />
          <path d="M12.5417 0.5H9C8.6088 0.5 8.29167 0.817132 8.29167 1.20833V3.33333C8.29167 3.72453 8.6088 4.04167 9 4.04167H12.5417C12.9329 4.04167 13.25 3.72453 13.25 3.33333V1.20833C13.25 0.817132 12.9329 0.5 12.5417 0.5Z" />
          <path d="M12.5417 6.875H9C8.6088 6.875 8.29167 7.19213 8.29167 7.58333V12.5417C8.29167 12.9329 8.6088 13.25 9 13.25H12.5417C12.9329 13.25 13.25 12.9329 13.25 12.5417V7.58333C13.25 7.19213 12.9329 6.875 12.5417 6.875Z" />
          <path d="M4.75 9.70833H1.20833C0.817132 9.70833 0.5 10.0255 0.5 10.4167V12.5417C0.5 12.9329 0.817132 13.25 1.20833 13.25H4.75C5.1412 13.25 5.45833 12.9329 5.45833 12.5417V10.4167C5.45833 10.0255 5.1412 9.70833 4.75 9.70833Z" />
        </svg>
      ),
    },
    {
      label: 'Create Order',
      path: '/store-manager/create-order',
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" />
          <line x1="8" y1="4.5" x2="8" y2="11.5" />
          <line x1="4.5" y1="8" x2="11.5" y2="8" />
        </svg>
      ),
    },
    {
      label: 'My Orders',
      path: '/store-manager/my-orders',
      icon: (
        <svg width="15" height="17" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.875 14.6661V7.58236M6.875 7.58236L0.705444 4.04049M6.875 7.58236L13.0446 4.04049M3.6875 2.10629L10.0625 5.75442M6.16667 14.4748C6.38203 14.5991 6.62632 14.6646 6.875 14.6646C7.12368 14.6646 7.36797 14.5991 7.58333 14.4748L12.5417 11.6413C12.7568 11.5171 12.9355 11.3384 13.0598 11.1233C13.1842 10.9082 13.2497 10.6642 13.25 10.4158V4.74879C13.2497 4.50035 13.1842 4.25634 13.0598 4.04124C12.9355 3.82615 12.7568 3.64753 12.5417 3.52331L7.58333 0.689808C7.36797 0.565463 7.12368 0.5 6.875 0.5C6.62632 0.5 6.38203 0.565463 6.16667 0.689808L1.20833 3.52331C0.993186 3.64753 0.814486 3.82615 0.69016 4.04124C0.565834 4.25634 0.500255 4.50035 0.5 4.74879V10.4158C0.500255 10.6642 0.565834 10.9082 0.69016 11.1233C0.814486 11.3384 0.993186 11.5171 1.20833 11.6413L6.16667 14.4748Z" />
        </svg>
      ),
    },
    {
      label: 'Track Delivery',
      path: '/store-manager/track-delivery',
      icon: (
        <svg width="15" height="15" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.9167 12.7497V4.25051C9.9167 3.87482 9.76743 3.51452 9.50173 3.24887C9.23603 2.98322 8.87567 2.83398 8.49992 2.83398H2.8328C2.45704 2.83398 2.09668 2.98322 1.83098 3.24887C1.56528 3.51452 1.41602 3.87482 1.41602 4.25051V12.0414C1.41602 12.2292 1.49065 12.4094 1.6235 12.5422C1.75635 12.675 1.93653 12.7497 2.12441 12.7497H3.54119" />
          <circle cx="4.95797" cy="12.7497" r="1.416" />
          <path d="M6.37475 12.7497H10.6251" />
          <circle cx="12.0419" cy="12.7497" r="1.416" />
          <path d="M13.4586 12.7497H14.8754C15.0633 12.7497 15.2435 12.675 15.3763 12.5422C15.5092 12.4094 15.5838 12.2292 15.5838 12.0414V9.45624C15.5835 9.29551 15.5286 9.13965 15.428 9.01428L12.9628 5.93334C12.8965 5.85039 12.8125 5.78339 12.7168 5.73729C12.6212 5.6912 12.5164 5.66719 12.4102 5.66703H9.9167" />
        </svg>
      ),
    },
    {
      label: 'Confirm Receipt',
      path: '/store-manager/confirm-receipt',
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="12" height="12" rx="2" />
          <polyline points="4.5 6 6 7.5 8.5 4.5" />
          <line x1="10.5" y1="6" x2="12" y2="6" />
          <line x1="4.5" y1="9.5" x2="11.5" y2="9.5" />
          <line x1="4.5" y1="12" x2="9" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Report Issue',
      path: '/store-manager/report-issue',
      icon: (
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2L1.5 13.5H14.5L8 2Z" />
          <line x1="8" y1="6" x2="8" y2="9" />
          <circle cx="8" cy="11.25" r="0.75" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: 'Order History',
      path: '/store-manager/order-history',
      icon: (
        <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M0.5 6.875C0.5 8.13586 0.873887 9.3684 1.57438 10.4168C2.27488 11.4651 3.27051 12.2822 4.43539 12.7647C5.60027 13.2472 6.88207 13.3735 8.1187 13.1275C9.35533 12.8815 10.4912 12.2744 11.3828 11.3828C12.2744 10.4912 12.8815 9.35533 13.1275 8.1187C13.3735 6.88207 13.2472 5.60027 12.7647 4.43539C12.2822 3.27051 11.4651 2.27488 10.4168 1.57438C9.3684 0.873887 8.13586 0.5 6.875 0.5C5.0928 0.506704 3.38219 1.20212 2.10083 2.44083L0.5 4.04167M4.04167 4.04167H0.5V0.5M6.875 3.33333V6.875L9.70833 8.29167" />
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
      {/* ========================================================
          MOBILE TOP MENU BAR (Visible on smaller screens <= 900px)
          ======================================================== */}
      <header className="sm-mobile-menubar">
        <div className="sm-mobile-menubar-left" onClick={() => handleNavClick('/store-manager/dashboard')}>
          <img src={logoImg} alt="WayFlow Logo" className="sm-mobile-logo" />
          <span className="sm-mobile-brand-name">WAYFLOW</span>
        </div>

        <div className="sm-mobile-menubar-right">
          <span className="sm-mobile-active-tag">{activeItem}</span>
          <button
            type="button"
            className="btn-sm-hamburger"
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

      {/* ========================================================
          MOBILE DRAWER BOX (Appears when hamburger is clicked)
          ======================================================== */}
      {isMobileOpen && (
        <div className="sm-mobile-overlay" onClick={() => setIsMobileOpen(false)}>
          <div className="sm-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="sm-mobile-drawer-header">
              <div className="sm-mobile-drawer-brand">
                <img src={logoImg} alt="WayFlow Logo" className="sm-sidebar-logo" />
                <span className="sm-sidebar-brand-name">WAYFLOW</span>
              </div>
              <button
                type="button"
                className="btn-sm-drawer-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* User Profile Card */}
            <div className="sm-user-card" style={{ margin: '12px 14px' }} title="Store Manager Profile">
              <div className="sm-user-left">
                <div className="sm-avatar">{initialsOf(user?.name)}</div>
                <div className="sm-user-meta">
                  <span className="sm-user-name">{user?.name}</span>
                  <span className="sm-user-role">{user?.role} • {workplaceOf(user)}</span>
                </div>
              </div>
              <span className="sm-user-arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                </svg>
              </span>
            </div>

            {/* Mobile Nav Links */}
            <nav className="sm-sidebar-nav" style={{ padding: '0 10px', flex: 1, overflowY: 'auto' }}>
              {navItems.map((item) => {
                const isActive =
                  activeItem === item.label ||
                  location.pathname === item.path ||
                  (item.path !== '/store-manager/dashboard' && location.pathname.startsWith(item.path))
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`sm-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <span className="sm-nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Mobile Bottom Section */}
            <div className="sm-sidebar-bottom" style={{ padding: '16px', background: '#fafbfc' }}>
              <button
                type="button"
                className="sm-logout-btn"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
              <span className="sm-version-footer">Waypoint DMS · v4.9</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DESKTOP SIDEBAR (> 900px) - Exact match to Loader & Dispatcher
          ======================================================== */}
      <aside className="sm-sidebar">
        <div className="sm-sidebar-top">
          {/* Brand Header */}
          <div className="sm-sidebar-brand" onClick={() => navigate('/store-manager/dashboard')}>
            <img src={logoImg} alt="WayFlow Logo" className="sm-sidebar-logo" />
            <span className="sm-sidebar-brand-name">WAYFLOW</span>
          </div>

          {/* User Card (Placed directly under Brand Header) */}
          <div className="sm-user-card" title="Store Manager Profile">
            <div className="sm-user-left">
              <div className="sm-avatar">{initialsOf(user?.name)}</div>
              <div className="sm-user-meta">
                <span className="sm-user-name">{user?.name}</span>
                <span className="sm-user-role">{user?.role} • {workplaceOf(user)}</span>
              </div>
            </div>
            <span className="sm-user-arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
              </svg>
            </span>
          </div>

          {/* Navigation List */}
          <nav className="sm-sidebar-nav">
            {navItems.map((item) => {
              const isActive =
                activeItem === item.label ||
                location.pathname === item.path ||
                (item.path !== '/store-manager/dashboard' && location.pathname.startsWith(item.path))
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`sm-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="sm-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout & Version */}
        <div className="sm-sidebar-bottom">
          <button
            type="button"
            className="sm-logout-btn"
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
          <span className="sm-version-footer">Waypoint DMS · v4.9</span>
        </div>
      </aside>
    </>
  )
}
