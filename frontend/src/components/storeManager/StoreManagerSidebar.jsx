import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import dashboardIcon from '../../assets/icons/dashboard.svg'
import createOrderIcon from '../../assets/icons/create.svg'
import ordersIcon from '../../assets/icons/orders.svg'
import trackDeliveryIcon from '../../assets/icons/truck.svg'
import confirmReceiptIcon from '../../assets/icons/receipt.svg'
import reportIssueIcon from '../../assets/icons/attention.svg'
import orderHistoryIcon from '../../assets/icons/delivery-history.svg'
import './StoreManagerSidebar.css'

export default function StoreManagerSidebar({ activeItem = 'Dashboard' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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

  const navItems = [
    { label: 'Dashboard', icon: dashboardIcon, path: '/store-manager/dashboard' },
    { label: 'Create Order', icon: createOrderIcon, path: '/store-manager/create-order' },
    { label: 'My Orders', icon: ordersIcon, path: '/store-manager/my-orders' },
    { label: 'Track Delivery', icon: trackDeliveryIcon, path: '/store-manager/track-delivery' },
    { label: 'Confirm Receipt', icon: confirmReceiptIcon, path: '/store-manager/confirm-receipt' },
    { label: 'Report Issue', icon: reportIssueIcon, path: '/store-manager/report-issue' },
    { label: 'Order History', icon: orderHistoryIcon, path: '/store-manager/order-history' },
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
                <div className="sm-avatar">SP</div>
                <div className="sm-user-meta">
                  <span className="sm-user-name">Sarah Perera</span>
                  <span className="sm-user-role">Store Manager • Colombo 05</span>
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
                const isActive = activeItem === item.label
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`sm-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.path)}
                  >
                    <img src={item.icon} alt="" className="sm-nav-icon" aria-hidden="true" />
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
          {/* Brand */}
          <div className="sm-sidebar-brand" onClick={() => navigate('/store-manager/dashboard')}>
            <img src={logoImg} alt="WayFlow Logo" className="sm-sidebar-logo" />
            <span className="sm-sidebar-brand-name">WAYFLOW</span>
          </div>

          {/* User Card (Placed directly under Brand) */}
          <div className="sm-user-card" title="Store Manager Profile">
            <div className="sm-user-left">
              <div className="sm-avatar">SP</div>
              <div className="sm-user-meta">
                <span className="sm-user-name">Sarah Perera</span>
                <span className="sm-user-role">Store Manager • Colombo 05</span>
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
              const isActive = activeItem === item.label
              return (
                <button
                  key={item.label}
                  type="button"
                  className={`sm-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <img src={item.icon} alt="" className="sm-nav-icon" aria-hidden="true" />
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
            onClick={() => navigate('/login')}
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
