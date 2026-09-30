export default function ColdChainSafetyCard({ settings, onChange }) {
  return (
    <div className="loader-settings-card">
      <div className="settings-card-header">
        <h3 className="settings-card-title">Cold-Chain & Safety Standards</h3>
        <p className="settings-card-subtitle">
          Thresholds for refrigerated reefers, frozen compartments, and thermal pre-cool validation.
        </p>
      </div>

      <div className="settings-form-grid">
        {/* Chilled Upper Limit */}
        <div className="settings-field-item">
          <label className="settings-field-label">Chilled Cargo Temperature Upper Limit (°C)</label>
          <input
            type="number"
            step="0.5"
            className="settings-field-input"
            value={settings.chilledLimit}
            onChange={(e) => onChange('chilledLimit', e.target.value)}
          />
          <span className="settings-field-hint">
            Dairy, eggs, and fresh perishables maximum allowable loading ambient temperature.
          </span>
        </div>

        {/* Frozen Upper Limit */}
        <div className="settings-field-item">
          <label className="settings-field-label">Frozen Cargo Temperature Upper Limit (°C)</label>
          <input
            type="number"
            step="1"
            className="settings-field-input"
            value={settings.frozenLimit}
            onChange={(e) => onChange('frozenLimit', e.target.value)}
          />
          <span className="settings-field-hint">
            Deep-frozen poultry, seafood, and ice cream maximum staging threshold.
          </span>
        </div>

        {/* Cross-Loading Warning */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Cross-Loading Temperature Zone Guard</span>
            <span className="toggle-sub">
              Triggers visual alert if chilled packages are staged near ambient dry goods in mixed-zone vehicles.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.crossLoadGuard}
              onChange={(e) => onChange('crossLoadGuard', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Mandatory Pre-Cool Handshake */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Mandatory Reefer Pre-Cool Sign-Off Before Departure</span>
            <span className="toggle-sub">
              Locks vehicle release button until truck refrigeration unit confirms steady operating temperature.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.reeferPreCoolCheck}
              onChange={(e) => onChange('reeferPreCoolCheck', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </div>
    </div>
  )
}
