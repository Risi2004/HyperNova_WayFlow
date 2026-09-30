export default function GeneralSettingsCard({ settings, onChange }) {
  return (
    <div className="settings-section-card">
      <div className="section-card-header">
        <div className="section-header-title-box">
          <h2 className="section-card-title">General & Depot Configuration</h2>
          <p className="section-card-subtitle">
            Configure primary dispatch hub defaults, operational boundaries, and localization parameters
          </p>
        </div>
        <span className="section-badge-pill">CORE SETTINGS</span>
      </div>

      <div className="settings-fields-grid">
        {/* Active Dispatch Hub */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="defaultDepot">
            Primary Dispatch Depot
          </label>
          <p className="field-helper">Default depot for auto-loading vehicle fleets and orders.</p>
          <select
            id="defaultDepot"
            className="settings-input-control"
            value={settings.defaultDepot}
            onChange={(e) => onChange('defaultDepot', e.target.value)}
          >
            <option value="Peliyagoda Central DC">Peliyagoda Central DC (West Province)</option>
            <option value="Kandy Regional Hub">Kandy Regional Hub (Central Province)</option>
            <option value="Galle Coastal Depot">Galle Coastal Depot (Southern Province)</option>
          </select>
        </div>

        {/* Operational Timezone */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="timezone">
            Operational Timezone
          </label>
          <p className="field-helper">Timezone for SLA calculation and live driver GPS synchronization.</p>
          <select
            id="timezone"
            className="settings-input-control"
            value={settings.timezone}
            onChange={(e) => onChange('timezone', e.target.value)}
          >
            <option value="Asia/Colombo">Asia/Colombo (UTC +05:30) â€” Standard</option>
            <option value="UTC">UTC (Coordinated Universal Time)</option>
          </select>
        </div>

        {/* Planning Cut-Off Time */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="cutoffTime">
            Daily Optimization Cut-Off
          </label>
          <p className="field-helper">Time when pending orders lock for automated route generation.</p>
          <input
            id="cutoffTime"
            type="time"
            className="settings-input-control"
            value={settings.cutoffTime}
            onChange={(e) => onChange('cutoffTime', e.target.value)}
          />
        </div>

        {/* Default Map Focus */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="mapFocus">
            Default Map View Center
          </label>
          <p className="field-helper">Initial geographic boundary for dispatch route visualizers.</p>
          <select
            id="mapFocus"
            className="settings-input-control"
            value={settings.mapFocus}
            onChange={(e) => onChange('mapFocus', e.target.value)}
          >
            <option value="Colombo Metropolitan">Colombo Metropolitan (6.9271Â° N, 79.8612Â° E)</option>
            <option value="Kandy Valley">Kandy Valley (7.2906Â° N, 80.6337Â° E)</option>
            <option value="Island Wide">Island-Wide Sri Lanka Macro View</option>
          </select>
        </div>

        {/* Measurement Units */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="unitSystem">
            Units & Currency Format
          </label>
          <p className="field-helper">Weight, volume, and financial representation across all manifests.</p>
          <select
            id="unitSystem"
            className="settings-input-control"
            value={settings.unitSystem}
            onChange={(e) => onChange('unitSystem', e.target.value)}
          >
            <option value="Metric-LKR">Metric (kg, mÂ³) Â· LKR (Sri Lankan Rupee)</option>
            <option value="Metric-USD">Metric (kg, mÂ³) Â· USD ($)</option>
          </select>
        </div>

        {/* Auto Refresh Interval */}
        <div className="settings-field-group">
          <label className="field-label" htmlFor="refreshInterval">
            Telemetry Live Polling Rate
          </label>
          <p className="field-helper">Frequency for polling active vehicle GPS positions & reefer sensors.</p>
          <select
            id="refreshInterval"
            className="settings-input-control"
            value={settings.refreshInterval}
            onChange={(e) => onChange('refreshInterval', e.target.value)}
          >
            <option value="15s">Every 15 seconds (High Precision)</option>
            <option value="30s">Every 30 seconds (Balanced)</option>
            <option value="60s">Every 60 seconds (Data Saver)</option>
          </select>
        </div>
      </div>
    </div>
  )
}
