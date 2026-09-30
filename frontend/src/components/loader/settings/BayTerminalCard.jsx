export default function BayTerminalCard({ settings, onChange }) {
  return (
    <div className="loader-settings-card">
      <div className="settings-card-header">
        <h3 className="settings-card-title">Bay & Terminal Configuration</h3>
        <p className="settings-card-subtitle">
          Manage hardware terminal assignments, bay telemetry, and interface scaling.
        </p>
      </div>

      <div className="settings-form-grid">
        {/* Default Depot */}
        <div className="settings-field-item">
          <label className="settings-field-label">Assigned Distribution Center</label>
          <select
            className="settings-field-select"
            value={settings.depot}
            onChange={(e) => onChange('depot', e.target.value)}
          >
            <option value="Peliyagoda Central DC">Peliyagoda Central DC</option>
            <option value="Colombo North Depot">Colombo North Depot</option>
            <option value="Colombo South Depot">Colombo South Depot</option>
            <option value="Negombo Hub">Negombo Hub</option>
          </select>
          <span className="settings-field-hint">
            Primary logistics node for load manifests and vehicle dispatch staging.
          </span>
        </div>

        {/* Assigned Bay */}
        <div className="settings-field-item">
          <label className="settings-field-label">Active Loading Bay</label>
          <select
            className="settings-field-select"
            value={settings.bayId}
            onChange={(e) => onChange('bayId', e.target.value)}
          >
            <option value="BAY-04 (Chilled & Dry Multi-Bay)">BAY-04 (Chilled & Dry Multi-Bay)</option>
            <option value="BAY-01 (Heavy Freight Only)">BAY-01 (Heavy Freight Only)</option>
            <option value="BAY-02 (Cold-Chain Reefer Dedicated)">BAY-02 (Cold-Chain Reefer Dedicated)</option>
            <option value="BAY-03 (Express Vans)">BAY-03 (Express Vans)</option>
          </select>
          <span className="settings-field-hint">
            Terminal RFID docking slot where current vehicle staging takes place.
          </span>
        </div>

        {/* Unit System */}
        <div className="settings-field-item">
          <label className="settings-field-label">Measurement & Weight Units</label>
          <select
            className="settings-field-select"
            value={settings.unitSystem}
            onChange={(e) => onChange('unitSystem', e.target.value)}
          >
            <option value="Metric (kg, units, °C)">Metric (kg, units, °C)</option>
            <option value="Imperial (lbs, units, °F)">Imperial (lbs, units, °F)</option>
          </select>
          <span className="settings-field-hint">
            Standard unit formatting for cargo volume, payload mass, and cargo temperature.
          </span>
        </div>

        {/* Refresh Interval */}
        <div className="settings-field-item">
          <label className="settings-field-label">Queue Live Refresh Interval</label>
          <select
            className="settings-field-select"
            value={settings.refreshInterval}
            onChange={(e) => onChange('refreshInterval', e.target.value)}
          >
            <option value="10s">Every 10 seconds (Recommended)</option>
            <option value="15s">Every 15 seconds</option>
            <option value="30s">Every 30 seconds</option>
            <option value="manual">Manual Pull Only</option>
          </select>
          <span className="settings-field-hint">
            Frequency of manifest updates and sudden order amendments from dispatch.
          </span>
        </div>

        {/* Display Mode Toggle */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">High Contrast Warehouse Tablet Mode</span>
            <span className="toggle-sub">
              Increases typography weight, borders, and button tap zones for rugged warehouse tablets.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => onChange('highContrast', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Offline Cache Toggle */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Offline Checklist Fallback Storage</span>
            <span className="toggle-sub">
              Enables local IndexedDB buffer in case warehouse Wi-Fi fluctuates near rear loading docks.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.offlineMode}
              onChange={(e) => onChange('offlineMode', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </div>
  )
}
