const DOCK_LABEL = { street: 'Street-side', loading_bay: 'Loading bay', mall_bay: 'Shared mall bay', rear_dock: 'Rear dock' }

export default function DeliveryReceivedHeader({ orderId, statusLabel, partial, receivedBy, driverNotes, loading, dockType }) {
  return (
    <div className="cr-header-container">
      <div className="cr-top-title-row">
        <div>
          <div className="cr-breadcrumb">
            <span className="cr-bc-link">Track Delivery</span>
            <span className="cr-bc-sep">/</span>
            <span className="cr-bc-curr">Confirm Receipt</span>
          </div>

          <div className="cr-title-badges-row">
            <h1 className="cr-page-title">Confirm Receipt</h1>
            <span className="cr-status-delivered-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{statusLabel}</span>
            </span>
            <span className="cr-order-code-pill">{orderId}</span>
          </div>

          <p className="cr-page-subtitle">
            Count what arrived and record its condition. Shortages or damage are sent to dispatch automatically.
          </p>
        </div>

        {dockType && (
          <div className="cr-dock-badge-card">
            <div className="cr-dock-text-col">
              <span className="cr-dock-label">UNLOADING</span>
              <span className="cr-dock-name">{DOCK_LABEL[dockType] || dockType.replace('_', ' ')}</span>
            </div>
            <div className="cr-dock-icon-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="cr-received-banner">
        <div className="cr-received-left">
          <div className="cr-received-check-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="cr-received-text-col">
            <h3 className="cr-received-title">{partial ? 'Delivered in part' : 'Delivery recorded by the driver'}</h3>
            <span className="cr-received-sub">
              {receivedBy ? `Handed over to ${receivedBy}.` : 'Handed over at your store.'}
              {driverNotes ? ` Driver: “${driverNotes}”` : ''}
            </span>
          </div>
        </div>

        {loading?.shortfall_flag && (
          <div className="cr-verification-window-pill">
            <span className="cr-window-label">LOADED SHORT:</span>
            <span className="cr-window-status">
              {loading.item_name ? `${loading.item_name} — ` : ''}
              {loading.shortfall_units ? `${loading.shortfall_units} units` : loading.issue_type || 'see notes'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
