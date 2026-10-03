const AWAITING = ['delivered', 'partial']

export default function DockGateActionsCard({ order, outletName, driverPhone, onConfirmReceipt, onViewManifest, onReportIssue }) {
  const ready = AWAITING.includes(order.status)
  const signed = ['received', 'disputed'].includes(order.status)

  return (
    <div className="td-dock-actions-card">
      <div className="td-dock-header">
        <div className="td-dock-title-group">
          <h3 className="td-dock-title">STORE ACTIONS</h3>
        </div>
      </div>

      <p className="td-dock-subtitle">Receive the goods at {outletName}, or tell dispatch about a problem.</p>

      <button type="button" className={`btn-dock-confirm ${ready ? 'unlocked' : 'locked'}`} onClick={onConfirmReceipt} disabled={!ready && !signed}>
        <span>{signed ? 'View Receipt' : ready ? 'Confirm Receipt' : 'Confirm Receipt (after delivery)'}</span>
      </button>

      <div className="td-dock-sensor-note">
        <p>
          {signed
            ? `Receipt already confirmed${order.status === 'disputed' ? ' with a discrepancy — dispatch is following up' : ''}.`
            : ready
              ? 'The driver has recorded the delivery. Count the goods and sign off.'
              : 'Unlocks when the driver records the delivery at your store.'}
        </p>
      </div>

      <button type="button" className="btn-dock-view-manifest" onClick={onViewManifest}>
        <span>View Order Manifest ({order.order_id})</span>
      </button>

      <div className="td-dock-secondary-actions">
        <button type="button" className="btn-dock-sub-action report" onClick={onReportIssue}>
          <span>Report Issue</span>
        </button>
        {driverPhone ? (
          <a className="btn-dock-sub-action contact" href={`tel:${driverPhone.replace(/\s+/g, '')}`}>
            <span>Call Driver</span>
          </a>
        ) : (
          <button type="button" className="btn-dock-sub-action contact" disabled title="No phone number on the driver's profile">
            <span>Call Driver</span>
          </button>
        )}
      </div>
    </div>
  )
}
