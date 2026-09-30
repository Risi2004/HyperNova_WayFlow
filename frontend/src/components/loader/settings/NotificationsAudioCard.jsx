export default function NotificationsAudioCard({ settings, onChange }) {
  return (
    <div className="loader-settings-card">
      <div className="settings-card-header">
        <h3 className="settings-card-title">Terminal Notifications & Audio Alerts</h3>
        <p className="settings-card-subtitle">
          Audible warnings, bay sirens, and dispatch emergency broadcast relays.
        </p>
      </div>

      <div className="settings-form-grid">
        {/* Toggle 1: Departure Countdown */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Departure Countdown Warning Alarm</span>
            <span className="toggle-sub">
              Plays acoustic alert when less than 30 minutes remain before scheduled vehicle gate departure.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.departureAlarm}
              onChange={(e) => onChange('departureAlarm', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 2: Dispatch Broadcast Flashes */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">High-Priority Dispatch Broadcast Flash</span>
            <span className="toggle-sub">
              Flashes terminal screen in yellow or amber when dispatch controller modifies route orders or stops.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.dispatchBroadcasts}
              onChange={(e) => onChange('dispatchBroadcasts', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 3: Missing Item Instant Escalation */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Automatic Missing-Carton Telegram / SMS Escalation</span>
            <span className="toggle-sub">
              Sends automated ping to Warehouse Inventory Lead whenever an issue with missing stock is filed.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.autoEscalateIssue}
              onChange={(e) => onChange('autoEscalateIssue', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Audio Volume Setting */}
        <div className="settings-field-item">
          <label className="settings-field-label">Terminal Audio Siren Volume</label>
          <select
            className="settings-field-select"
            value={settings.audioVolume}
            onChange={(e) => onChange('audioVolume', e.target.value)}
          >
            <option value="high">High (85 dB — Active Factory / Bay Floor)</option>
            <option value="medium">Medium (65 dB — Enclosed Supervisor Desk)</option>
            <option value="low">Low (45 dB)</option>
            <option value="mute">Muted / Visual Beacon Only</option>
          </select>
          <span className="settings-field-hint">
            Volume calibration for rugged barcode scanning beeps and gate departure alarms.
          </span>
        </div>
      </div>
    </div>
  )
}
