export default function LoaderSettingsTabs({ activeTab, onTabSelect }) {
  const tabs = [
    {
      id: 'terminal',
      label: 'Bay & Terminal',
      description: 'Depot assignment, bays & unit systems',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'verification',
      label: 'Verification & Scanning',
      description: 'Barcode chime, LIFO sequence & checks',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5v4M3 5h4M21 5h-4M21 5v4M3 19v-4M3 19h4M21 19h-4M21 19v-4" />
          <line x1="7" y1="9" x2="7" y2="15" />
          <line x1="10" y1="9" x2="10" y2="15" />
          <line x1="14" y1="9" x2="14" y2="15" />
          <line x1="17" y1="9" x2="17" y2="15" />
        </svg>
      ),
    },
    {
      id: 'coldchain',
      label: 'Cold-Chain & Safety',
      description: 'Reefer temp limits & pre-cool guards',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      ),
    },
    {
      id: 'alerts',
      label: 'Notifications & Audio',
      description: 'Bay siren volume & dispatch alarms',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
