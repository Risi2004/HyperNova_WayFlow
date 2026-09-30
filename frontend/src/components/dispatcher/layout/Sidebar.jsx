import { NavLink, useNavigate } from 'react-router-dom'
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
import './Sidebar.css'

export default function Sidebar({ activeItem = 'Dashboard' }) {
  const navigate = useNavigate()

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

  return (
    <aside className="dispatcher-sidebar">
      <div className="sidebar-top">
        {/* Brand */}
        <div className="sidebar-brand">
          <img src={logoImg} alt="WayFlow Logo" className="sidebar-logo" />
          <span className="sidebar-brand-name">WAYFLOW</span>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card" title="Switch dispatcher profile">
          <div className="sidebar-user-left">
            <div className="sidebar-avatar">JD</div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">Jordan Davis</span>
              <span className="sidebar-user-role">Dispatcher â€¢ West Hub</span>
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
          onClick={() => navigate('/login')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
        <span className="sidebar-version-footer">Waypoint DMS â€¢ v4.8</span>
      </div>
    </aside>
  )
}
