export default function RoutingRulesCard({ settings, onChange }) {
  const optimizationStrategies = [
    {
      id: 'balanced',
      title: 'Balanced Cost & SLA (Recommended)',
      desc: 'Optimizes mileage and vehicle utilization while maintaining 95%+ on-time arrival margin.',
    },
    {
      id: 'fuel',
      title: 'Fuel & Mileage Minimization',
      desc: 'Aggressively consolidates drop-offs to reduce diesel consumption and fleet wear.',
    },
    {
      id: 'sla',
      title: 'Strict SLA Delivery Windows First',
      desc: 'Prioritizes tight outlet opening windows even if total corridor distance increases.',
    },
  ]

  return (
    <div className="settings-section-card">
      <div className="section-card-header">
        <div className="section-header-title-box">
          <h2 className="section-card-title">Routing & Optimization Engine</h2>
          <p className="section-card-subtitle">
            Tune algorithmic parameters for route synthesis, vehicle capacity limits, and cold-chain safety
          </p>
        </div>
        <span className="section-badge-pill green">AI ENGINE ACTIVE</span>
      </div>

      {/* Optimization Strategy Radio Cards */}
      <div className="settings-subgroup">
        <label className="field-label">Routing Optimization Objective</label>
        <div className="strategy-options-grid">
          {optimizationStrategies.map((opt) => {
            const isSelected = settings.optimizationStrategy === opt.id
            return (
              <div
                key={opt.id}
                className={`strategy-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onChange('optimizationStrategy', opt.id)}
              >
                <div className="strategy-radio-circle">
                  {isSelected && <div className="strategy-radio-inner" />}
                </div>
                <div className="strategy-meta">
                  <span className="strategy-title">{opt.title}</span>
                  <p className="strategy-desc">{opt.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="settings-divider" />

      {/* Constraints & Thresholds Sliders / Toggles */}
      <div className="settings-toggles-grid">
        {/* Cold-Chain Enforcement Toggle */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Strict Cold-Chain Reefer Lock</span>
            <p className="toggle-subtitle">
              Strictly block assignment of dairy, meat, and frozen products to non-refrigerated dry-box vehicles.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="coldChainEnforced">
            <input
              id="coldChainEnforced"
              type="checkbox"
              checked={settings.coldChainEnforced}
              onChange={(e) => onChange('coldChainEnforced', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Auto Deferral on Capacity Overflow */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Automated Capacity Deferral</span>
            <p className="toggle-subtitle">
              Automatically relegate overflow orders into the Deferred Orders queue if fleet utilization exceeds 98%.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="autoDeferOverflow">
            <input
              id="autoDeferOverflow"
              type="checkbox"
              checked={settings.autoDeferOverflow}
              onChange={(e) => onChange('autoDeferOverflow', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Dynamic Traffic Congestion Buffer */}
        <div className="setting-range-row">
          <div className="range-text-col">
            <div className="range-title-val-row">
              <span className="toggle-title">Dynamic Traffic Congestion Buffer</span>
              <span className="range-val-badge">+{settings.trafficBuffer}% travel time</span>
            </div>
            <p className="toggle-subtitle">
              Adds safety buffer to Colombo and Kandy urban corridors based on real-time peak hour congestion.
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="35"
            step="5"
            className="settings-range-slider"
            value={settings.trafficBuffer}
            onChange={(e) => onChange('trafficBuffer', Number(e.target.value))}
          />
        </div>

        {/* Maximum Shift Duration */}
        <div className="setting-range-row">
          <div className="range-text-col">
            <div className="range-title-val-row">
              <span className="toggle-title">Maximum Driver Shift Duration</span>
              <span className="range-val-badge">{settings.maxShiftHours} Hours Max</span>
            </div>
            <p className="toggle-subtitle">
              Legal driver duty ceiling per route run to prevent fatigue and guarantee Sri Lanka transport compliance.
            </p>
          </div>
          <input
            type="range"
            min="6"
            max="12"
            step="0.5"
            className="settings-range-slider"
            value={settings.maxShiftHours}
            onChange={(e) => onChange('maxShiftHours', Number(e.target.value))}
          />
        </div>

        {/* Geofence Detection Proximity */}
        <div className="setting-range-row">
          <div className="range-text-col">
            <div className="range-title-val-row">
              <span className="toggle-title">Geofence Proximity Arrival Trigger</span>
              <span className="range-val-badge">{settings.geofenceRadius} Meters</span>
            </div>
            <p className="toggle-subtitle">
              Distance from store loading bay at which automatic "Arrived at Destination" status is triggered.
            </p>
          </div>
          <input
            type="range"
            min="30"
            max="150"
            step="10"
            className="settings-range-slider"
            value={settings.geofenceRadius}
            onChange={(e) => onChange('geofenceRadius', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}
