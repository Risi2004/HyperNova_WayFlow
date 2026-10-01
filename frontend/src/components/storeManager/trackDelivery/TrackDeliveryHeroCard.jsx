export default function TrackDeliveryHeroCard({
  tripId = 'TR-024',
  orderId = 'ORD-1042',
  simState = 'in_delivery',
}) {
  // Dynamic values depending on simulation state
  const isDelayed = simState === 'delayed'
  const isOffline = simState === 'offline'
  const isDelivered = simState === 'delivered'
  const isArrivingSoon = simState === 'arriving_soon'

  const etaTime = isDelayed ? '11:20 AM' : isArrivingSoon ? '10:42 AM' : isDelivered ? '10:40 AM' : '10:45 AM'
  const windowStatus = isDelayed ? 'Exceeds window (Delay: +35m traffic)' : 'Within scheduled window (10:30 – 11:00 AM)'

  return (
    <div className="td-hero-card">
      <div className="td-hero-top-row">
        {/* Left Side: ETA & Scheduled Window */}
        <div className="td-hero-eta-section">
          <div className="td-hero-eta-header">
            <span className="td-hero-eta-label">ESTIMATED ARRIVAL (ETA)</span>
            {isOffline ? (
              <span className="td-gps-status-badge offline">
                <span className="gps-dot gray" />
                <span>Offline (8m ago)</span>
              </span>
            ) : (
              <span className="td-gps-status-badge live">
                <span className="gps-dot green" />
                <span>Live GPS</span>
              </span>
            )}
          </div>

          <div className={`td-hero-eta-big ${isDelayed ? 'delayed' : ''}`}>
            {etaTime}
          </div>

          <div className={`td-hero-window-banner ${isDelayed ? 'delayed' : isDelivered ? 'delivered' : 'on-time'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{isDelivered ? 'Arrived at Dock Bay 02 — Intake Pending' : windowStatus}</span>
          </div>

          <div className="td-hero-trip-enroute">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            <span>Trip {tripId} &bull; {isDelivered ? 'Docked at Bay 02' : 'En Route to Colombo 05 Store'}</span>
          </div>
        </div>

        {/* Right Side: 4 Telemetry Metrics */}
        <div className="td-hero-metrics-grid">
          {/* Box 1: Sequence */}
          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">SEQUENCE</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="td-box-val-main">Stop 4 of 8</div>
            <span className="td-box-sub-blue">Next Stop: Your Store</span>
          </div>

          {/* Box 2: Cold-Chain */}
          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">COLD-CHAIN</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            </div>
            <div className="td-box-val-row">
              <span className="td-box-val-main">+3.8°C</span>
              <span className="td-box-status-tag optimal">Optimal</span>
            </div>
            <span className="td-box-sub-gray">Target: 2°C – +4°C</span>
          </div>

          {/* Box 3: Payload Units */}
          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">PAYLOAD UNITS</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="td-box-val-main">107 Units</div>
            <span className="td-box-sub-gray">4 Lines &bull; ~640 kg</span>
          </div>

          {/* Box 4: Assigned Driver */}
          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">ASSIGNED DRIVER</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="td-box-val-main">Marcus Vance</div>
            <span className="td-box-sub-gray">WP-REF-007 (15T)</span>
          </div>
        </div>
      </div>

      {/* Bottom Progress Track */}
      <div className="td-hero-progress-section">
        <div className="td-progress-label-row">
          <span className="td-progress-label">
            Trip Route Progress &mdash; Peliyagoda DC to Metro Central Corridor
          </span>
          <span className="td-progress-count">4 of 8 Stops (50%)</span>
        </div>

        <div className="td-progress-bar-bg">
          <div className="td-progress-bar-fill" style={{ width: '50%' }} />
        </div>

        <div className="td-progress-legend-row">
          <div className="td-legend-left">
            <div className="td-legend-item">
              <span className="legend-dot green" />
              <span>3 Stops Signed</span>
            </div>
            <div className="td-legend-item">
              <span className="legend-dot blue" />
              <span>Stop 4 In Transit (Your Outlet)</span>
            </div>
            <div className="td-legend-item">
              <span className="legend-dot gray" />
              <span>4 Remaining</span>
            </div>
          </div>
          <span className="td-legend-ping">Live GPS Ping: 30s</span>
        </div>
      </div>
    </div>
  )
}
