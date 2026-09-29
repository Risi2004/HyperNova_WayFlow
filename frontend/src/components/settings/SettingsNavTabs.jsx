export default function SettingsNavTabs({ activeTab, onTabSelect }) {
  const tabs = [
    {
      id: 'general',
      label: 'General & Depots',
      description: 'Depot origins, timezone, operational cut-offs',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'routing',
      label: 'Routing & Optimization',
      description: 'SLA weights, cold-chain enforcement, shifts',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="19" r="3" />
          <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          <circle cx="18" cy="5" r="3" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Alerts & Notifications',
      description: 'SLA delay threshold, SMS dispatch triggers',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      id: 'telematics',
      label: 'Telematics & APIs',
      description: 'Live GPS stream, ERP connectors, webhooks',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      ),
    },
    {
      id: 'security',
      label: 'Security & Profile',
      description: 'Dispatcher access, 2FA, session timeout',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="settings-nav-tabs-bar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`settings-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onTabSelect(tab.id)}
          >
            <span className="tab-icon-wrap">{tab.icon}</span>
            <div className="tab-label-group">
              <span className="tab-main-label">{tab.label}</span>
              <span className="tab-sub-description">{tab.description}</span>
            </div>
            {isActive && <span className="tab-active-indicator" />}
          </button>
        )
      })}
    </div>
  )
}
