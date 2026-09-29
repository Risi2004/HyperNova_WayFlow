import searchIcon from '../../assets/icons/search.svg'
import notificationsIcon from '../../assets/icons/notifications.svg'
import './Header.css'

export default function Header() {
  return (
    <header className="dispatcher-header">
      <div className="header-left">
        <h1 className="header-title">Dispatcher Dashboard</h1>
        <span className="header-date">Today, 26 Sep 2026</span>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="header-search-wrapper">
          <img src={searchIcon} alt="" className="header-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search orders, routes, vehicles..."
          />
          <kbd className="header-search-kbd">⌘ K</kbd>
        </div>

        {/* Notifications */}
        <button type="button" className="header-icon-btn" aria-label="Notifications (1 unread)">
          <img src={notificationsIcon} alt="" className="header-icon-img" aria-hidden="true" />
          <span className="header-badge-dot" />
        </button>

        {/* User Pill */}
        <div className="header-user-profile" title="Jordan Davis">
          <div className="header-user-avatar">JD</div>
          <div className="header-user-meta">
            <span className="header-user-name">Jordan Davis</span>
            <span className="header-user-role">Dispatcher</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </header>
  )
}
