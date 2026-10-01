export default function AssignedOutletCard() {
  return (
    <div className="co-card co-outlet-card">
      {/* Top Title Bar */}
      <div className="co-card-header">
        <div className="co-card-title-group">
          <div className="co-card-icon-wrap blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="co-card-title">Assigned Outlet</h2>
        </div>
        <div className="co-outlet-status-pill">
          <span className="co-status-dot green" />
          <span className="co-status-text">Active Store Account</span>
        </div>
      </div>

      {/* Outlet Basic Info */}
      <div className="co-outlet-main-info">
        <div className="co-outlet-heading-block">
          <h3 className="co-outlet-name">Colombo 05 Store</h3>
          <span className="co-outlet-sub">Store ID: OUT043 • Tier 1 Supermarket</span>
        </div>
        <div className="co-outlet-manager-tag">
          <span className="co-manager-label">Manager:</span>
          <span className="co-manager-name">Sarah Perera</span>
        </div>
      </div>

      {/* 4 Details Grid (2x2) */}
      <div className="co-outlet-meta-grid">
        {/* Cell 1: Delivery Address */}
        <div className="co-meta-cell">
          <div className="co-meta-icon-col">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="co-meta-text-col">
            <span className="co-meta-label">DELIVERY ADDRESS</span>
            <span className="co-meta-value">142 Galle Road, Colombo 05</span>
            <span className="co-meta-sub">Colombo District, Western Province</span>
          </div>
        </div>

        {/* Cell 2: Assigned Fulfillment Hub */}
        <div className="co-meta-cell">
          <div className="co-meta-icon-col">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="co-meta-text-col">
            <span className="co-meta-label">ASSIGNED FULFILLMENT HUB</span>
            <span className="co-meta-value link-blue">Peliyagoda Distribution Center</span>
            <span className="co-meta-sub">Central Multi-Temperature Cold Hub</span>
          </div>
        </div>

        {/* Cell 3: Standard Window */}
        <div className="co-meta-cell">
          <div className="co-meta-icon-col">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="co-meta-text-col">
            <span className="co-meta-label">STANDARD WINDOW</span>
            <span className="co-meta-value">10:30 AM – 11:00 AM</span>
            <span className="co-meta-sub">Bay 2 Ramp Unloading Allocated</span>
          </div>
        </div>

        {/* Cell 4: Consolidation Cutoff */}
        <div className="co-meta-cell">
          <div className="co-meta-icon-col">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="co-meta-text-col">
            <span className="co-meta-label">CONSOLIDATION CUTOFF</span>
            <span className="co-meta-value">18:00 PM Daily</span>
            <span className="co-meta-sub">For guaranteed next-morning departure</span>
          </div>
        </div>
      </div>

      {/* Bottom Info Callout Strip */}
      <div className="co-outlet-notice-strip">
        <div className="co-notice-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <p className="co-notice-text">
          Orders submitted in this session are automatically routed to Peliyagoda DC logistics bay for multi-zone load assembly.
        </p>
      </div>
    </div>
  )
}
