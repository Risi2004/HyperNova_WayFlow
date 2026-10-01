export default function DockGateActionsCard({
  orderId = 'ORD-1042',
  simState = 'in_delivery',
  onConfirmReceipt,
  onViewManifest,
  onReportIssue,
  onContactDriver,
}) {
  const isDelivered = simState === 'delivered'

  return (
    <div className="td-dock-actions-card">
      <div className="td-dock-header">
        <div className="td-dock-title-group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <h3 className="td-dock-title">STORE DOCK GATE ACTIONS</h3>
        </div>
        <button
          type="button"
          className="btn-dock-help"
          title="Gate protocols and docking sensor documentation"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>

      <p className="td-dock-subtitle">
        Execute physical intake handover at Colombo 05 Store Bay 02 or report route exceptions.
      </p>

      {/* Main Confirm Action Button */}
      {isDelivered ? (
        <button
          type="button"
          className="btn-dock-confirm unlocked"
          onClick={onConfirmReceipt}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>Confirm Receipt (Dock Bay 02 Ready)</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn-dock-confirm locked"
          onClick={onConfirmReceipt}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span>Confirm Receipt (Dock Locked)</span>
        </button>
      )}

      {/* Amber Lock Explanation Box */}
      <div className="td-dock-sensor-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          {isDelivered
            ? 'Dock sensor verified: WP-REF-007 reversed into Bay 02. Seal intact.'
            : 'Intake confirmation unlocks automatically when dock sensors confirm Bay 02 docking.'}
        </p>
      </div>

      {/* View Order Manifest */}
      <button
        type="button"
        className="btn-dock-view-manifest"
        onClick={onViewManifest}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>View Order Manifest ({orderId})</span>
      </button>

      {/* Bottom Actions: Report Issue & Contact Driver */}
      <div className="td-dock-secondary-actions">
        <button
          type="button"
          className="btn-dock-sub-action report"
          onClick={onReportIssue}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Report Issue</span>
        </button>

        <button
          type="button"
          className="btn-dock-sub-action contact"
          onClick={onContactDriver}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Contact Driver</span>
        </button>
      </div>
    </div>
  )
}
