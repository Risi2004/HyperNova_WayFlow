export default function DeliverySummaryBoxes({
  orderId = 'ORD-1042',
  storeName = 'Colombo 05 Store',
  storeId = 'OUT043 (Zone 2)',
  tripId = 'TR-024',
  vehicleId = 'WP-REF-007',
  deliveryTime = '10:52 AM (28 Sep 2026)',
  driverName = 'Marcus Vance (DRV-091)',
  temperature = '+3.8°C at arrival',
}) {
  return (
    <div className="cr-summary-section">
      {/* 4 Cards Grid */}
      <div className="cr-summary-grid">
        {/* Box 1: Order Reference */}
        <div className="cr-summary-box">
          <span className="cr-box-label">ORDER REFERENCE</span>
          <span className="cr-box-val">{orderId}</span>
          <span className="cr-box-sub">Scheduled Regular Stock Refill</span>
        </div>

        {/* Box 2: Outlet Destination */}
        <div className="cr-summary-box">
          <span className="cr-box-label">OUTLET DESTINATION</span>
          <span className="cr-box-val">{storeName}</span>
          <span className="cr-box-sub">Outlet ID: {storeId}</span>
        </div>

        {/* Box 3: Trip & Vehicle */}
        <div className="cr-summary-box">
          <span className="cr-box-label">TRIP &amp; VEHICLE</span>
          <span className="cr-box-val">
            {tripId} &bull; <strong className="val-blue">{vehicleId}</strong>
          </span>
          <span className="cr-box-sub">Refrigerated Truck - Isuzu 5T</span>
        </div>

        {/* Box 4: Delivery Time & Driver */}
        <div className="cr-summary-box">
          <span className="cr-box-label">DELIVERY TIME &amp; DRIVER</span>
          <span className="cr-box-val">{deliveryTime}</span>
          <span className="cr-box-sub">{driverName}</span>
        </div>
      </div>

      {/* Subtext info line */}
      <div className="cr-summary-subtext-bar">
        <div className="cr-temp-logging-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.4">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
          <span>Temperature Logging: Continuous Chill Active ({temperature})</span>
        </div>

        <div className="cr-manifest-status-right">
          <span className="cr-dot green" />
          <span>Manifest Status: Unloaded &amp; Staged for Verification</span>
        </div>
      </div>
    </div>
  )
}
