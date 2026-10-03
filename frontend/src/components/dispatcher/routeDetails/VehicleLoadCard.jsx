export default function VehicleLoadCard() {
  return (
    <div className="route-card vehicle-load-card">
      <div className="route-card-header">
        <h2 className="route-card-title">Vehicle & Load</h2>
        <p className="route-card-subtitle">Assigned vehicle capacity and remaining quota</p>
      </div>

      {/* Assigned Vehicle Highlight Banner */}
      <div className="assigned-vehicle-banner">
        <div className="vehicle-banner-icon-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <div className="vehicle-banner-meta">
          <div className="vehicle-reg-number">WP-CB-4521</div>
          <div className="vehicle-sub-desc">Refrigerated Truck · Driver: K. Perera</div>
        </div>
      </div>

      {/* Sub Specs Grid */}
      <div className="vehicle-specs-two-col">
        <div className="spec-col-item">
          <span className="spec-label">Temperature Capability</span>
          <span className="spec-value">Chilled / Frozen / Ambient</span>
        </div>
        <div className="spec-col-item">
          <span className="spec-label">Trip</span>
          <span className="spec-value">1 of 2</span>
        </div>
      </div>

      {/* Utilization Bars */}
      <div className="utilization-bars-group">
        {/* Weight */}
        <div className="utilization-bar-item">
          <div className="util-bar-labels">
            <span className="util-metric-name">Weight utilization</span>
            <span className="util-metric-values">3,050 / 5,000 kg</span>
          </div>
          <div className="util-progress-track">
            <div className="util-progress-fill fill-blue" style={{ width: '61%' }}></div>
          </div>
          <span className="util-remaining-note text-green">1,950 kg remaining · within capacity</span>
        </div>

        {/* Volume */}
        <div className="utilization-bar-item">
          <div className="util-bar-labels">
            <span className="util-metric-name">Volume utilization</span>
            <span className="util-metric-values">21.4 / 28 m³</span>
          </div>
          <div className="util-progress-track">
            <div className="util-progress-fill fill-blue" style={{ width: '76.4%' }}></div>
          </div>
          <span className="util-remaining-note text-green">6.6 m³ remaining · within capacity</span>
        </div>

        {/* Fuel Quota */}
        <div className="utilization-bar-item">
          <div className="util-bar-labels">
            <span className="util-metric-name">Fuel quota</span>
            <span className="util-metric-values">66% weekly quota remaining</span>
          </div>
          <div className="util-progress-track">
            <div className="util-progress-fill fill-green" style={{ width: '66%' }}></div>
          </div>
          <span className="util-remaining-note text-green">Route is within available weekly quota</span>
        </div>
      </div>
    </div>
  )
}
