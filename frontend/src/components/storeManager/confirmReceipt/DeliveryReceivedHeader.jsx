export default function DeliveryReceivedHeader({
  orderId = 'ORD-1042',
  dockName = 'Bay 02 Unloading Ramp',
  verificationMinutes = 28,
}) {
  return (
    <div className="cr-header-container">
      {/* Top Banner: Breadcrumb & Title */}
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
              <span>Delivered</span>
            </span>
            <span className="cr-order-code-pill">{orderId}</span>
          </div>

          <p className="cr-page-subtitle">
            Confirm that your outlet has received and physically inspected the delivered order goods.
          </p>
        </div>

        {/* Top Right: Unloading Dock Badge */}
        <div className="cr-dock-badge-card">
          <div className="cr-dock-text-col">
            <span className="cr-dock-label">UNLOADING DOCK</span>
            <span className="cr-dock-name">{dockName}</span>
          </div>
          <div className="cr-dock-icon-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>
      </div>

      {/* Delivery Received Green Banner */}
      <div className="cr-received-banner">
        <div className="cr-received-left">
          <div className="cr-received-check-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="cr-received-text-col">
            <h3 className="cr-received-title">Delivery Received</h3>
            <span className="cr-received-sub">Delivery completed &amp; staged at dock</span>
          </div>
        </div>

        <div className="cr-verification-window-pill">
          <span className="cr-window-label">VERIFICATION WINDOW:</span>
          <span className="cr-window-status">Active Inspection ({verificationMinutes}m remaining)</span>
        </div>
      </div>
    </div>
  )
}
