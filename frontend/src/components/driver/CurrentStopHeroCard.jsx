export default function CurrentStopHeroCard({
  stopNumber = '05',
  totalStops = '08',
  storeName = 'Waypoint Fresh — Colombo 04',
  orderId = 'OUT-042',
  address = 'No. 125, Galle Road, Colombo 04',
  deliveryWindow = '10:30 AM - 11:00 AM',
  expectedArrival = '10:52 AM (In Window)',
  instructions = 'Use the rear entrance. Receiving area is available from 10:00 AM. Contact manager if gate is locked.',
  onStartChecklist,
  onViewRouteMap,
  onNextStop,
}) {
  return (
    <div className="driver-card current-stop-hero-card">
      {/* Top Banner Tag & Next Stop button */}
      <div className="current-stop-top-bar">
        <div className="current-stop-tag">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          <span>CURRENT STOP - {stopNumber} OF {totalStops}</span>
        </div>

        <button
          type="button"
          className="btn-next-stop-outline"
          onClick={onNextStop}
        >
          + Next Stop
        </button>
      </div>

      {/* Main Stop Title & Order ID */}
      <div className="current-stop-title-group">
        <h2 className="current-stop-name">{storeName}</h2>
        <span className="current-stop-order-id">ORDER ID: {orderId}</span>
      </div>

      {/* Address */}
      <div className="current-stop-address-row">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{address}</span>
      </div>

      {/* Delivery Window & Expected Arrival */}
      <div className="current-stop-timing-grid">
        <div className="timing-col">
          <span className="timing-label">DELIVERY WINDOW</span>
          <span className="timing-val">{deliveryWindow}</span>
        </div>

        <div className="timing-col">
          <span className="timing-label">EXPECTED ARRIVAL</span>
          <span className="timing-val arrival-highlight">{expectedArrival}</span>
        </div>
      </div>

      {/* Delivery Instructions Callout Box */}
      <div className="delivery-instructions-callout">
        <div className="instructions-header">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span className="instructions-label">DELIVERY INSTRUCTIONS</span>
        </div>
        <p className="instructions-text">{instructions}</p>
      </div>

      {/* Bottom Action Buttons */}
      <div className="current-stop-actions-row">
        <button
          type="button"
          className="btn-start-checklist"
          onClick={onStartChecklist}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          <span>View Stop & Start Checklist</span>
        </button>

        <button
          type="button"
          className="btn-view-map-secondary"
          onClick={onViewRouteMap}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          <span>View Trip Route Map</span>
        </button>
      </div>
    </div>
  )
}
