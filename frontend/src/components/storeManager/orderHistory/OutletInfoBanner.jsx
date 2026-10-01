export default function OutletInfoBanner({
  outletName = 'Colombo 05 Store',
  outletId = '# OUT043',
  totalHistorical = '128 Total',
  stagingDock = 'Bay 02 Dock Ramp',
  syncStatus = 'Synced with WayFlow Dispatch',
}) {
  return (
    <div className="oh-outlet-banner">
      <div className="oh-outlet-stats-left">
        {/* Outlet Name */}
        <div className="oh-outlet-stat-item">
          <div className="oh-stat-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="oh-stat-text-col">
            <span className="oh-stat-label">OUTLET</span>
            <span className="oh-stat-val">{outletName}</span>
          </div>
        </div>

        {/* Outlet ID */}
        <div className="oh-outlet-stat-item">
          <div className="oh-stat-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
              <line x1="4" y1="9" x2="20" y2="9" />
              <line x1="4" y1="15" x2="20" y2="15" />
              <line x1="10" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="14" y2="21" />
            </svg>
          </div>
          <div className="oh-stat-text-col">
            <span className="oh-stat-label">OUTLET ID</span>
            <span className="oh-stat-val">{outletId}</span>
          </div>
        </div>

        {/* Historical Orders */}
        <div className="oh-outlet-stat-item">
          <div className="oh-stat-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="oh-stat-text-col">
            <span className="oh-stat-label">HISTORICAL ORDERS</span>
            <span className="oh-stat-val">{totalHistorical}</span>
          </div>
        </div>

        {/* Staging Dock */}
        <div className="oh-outlet-stat-item">
          <div className="oh-stat-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="oh-stat-text-col">
            <span className="oh-stat-label">STAGING DOCK</span>
            <span className="oh-stat-val">{stagingDock}</span>
          </div>
        </div>
      </div>

      {/* Sync Status Badge */}
      <div className="oh-sync-badge">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        <span>{syncStatus}</span>
      </div>
    </div>
  )
}
