export default function OrderContextCard({
  orderId,
  store,
  arrivalTime,
  arrivalLabel = 'Arrival',
  receivedBy,
  tripId,
  driverName,
  status,
}) {
  return (
    <div className="ri-side-card">
      <div className="ri-side-card-header">
        <div className="ri-side-card-title-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <h3 className="ri-side-card-title">Order Context</h3>
        </div>
        <span className="ri-badge-completed">
          <span className="ri-dot green" />
          <span>{status}</span>
        </span>
      </div>

      <div className="ri-context-grid">
        <div className="ri-context-cell">
          <span className="ri-context-label">Order ID</span>
          <span className="ri-context-val">{orderId}</span>
        </div>

        <div className="ri-context-cell">
          <span className="ri-context-label">Store</span>
          <span className="ri-context-val">{store}</span>
        </div>

        <div className="ri-context-cell">
          <span className="ri-context-label">{arrivalLabel}</span>
          <span className="ri-context-val">{arrivalTime}</span>
        </div>

        <div className="ri-context-cell">
          <span className="ri-context-label">Received By</span>
          <span className="ri-context-val">{receivedBy}</span>
        </div>
      </div>

      <div className="ri-context-driver-row">
        <span className="ri-context-label">Trip &amp; Driver</span>
        <span className="ri-context-val">
          {tripId} &bull; {driverName}
        </span>
      </div>
    </div>
  )
}
