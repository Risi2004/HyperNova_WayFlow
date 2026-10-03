export default function DeliverySummaryBoxes({
  orderId,
  unitsLabel,
  storeName,
  storeId,
  tripId,
  vehicleId,
  vehicleLabel,
  deliveryTime,
  driverName,
  chilled,
  offline,
}) {
  return (
    <div className="cr-summary-section">
      <div className="cr-summary-grid">
        <div className="cr-summary-box">
          <span className="cr-box-label">ORDER REFERENCE</span>
          <span className="cr-box-val">{orderId}</span>
          <span className="cr-box-sub">{unitsLabel}</span>
        </div>

        <div className="cr-summary-box">
          <span className="cr-box-label">OUTLET</span>
          <span className="cr-box-val">{storeName}</span>
          <span className="cr-box-sub">Outlet ID: {storeId}</span>
        </div>

        <div className="cr-summary-box">
          <span className="cr-box-label">TRIP &amp; VEHICLE</span>
          <span className="cr-box-val">
            {tripId} &bull; <strong className="val-blue">{vehicleId}</strong>
          </span>
          <span className="cr-box-sub">{vehicleLabel}</span>
        </div>

        <div className="cr-summary-box">
          <span className="cr-box-label">DELIVERED &amp; DRIVER</span>
          <span className="cr-box-val">{deliveryTime}</span>
          <span className="cr-box-sub">{driverName}</span>
        </div>
      </div>

      <div className="cr-summary-subtext-bar">
        <div className="cr-temp-logging-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.4">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
          <span>{chilled ? 'Chilled order — check the product temperature before signing off.' : 'Ambient order — no temperature check required.'}</span>
        </div>

        <div className="cr-manifest-status-right">
          <span className={`cr-dot ${offline ? 'amber' : 'green'}`} />
          <span>{offline ? 'Driver recorded this without signal; synced later' : 'Proof of delivery recorded by the driver'}</span>
        </div>
      </div>
    </div>
  )
}
