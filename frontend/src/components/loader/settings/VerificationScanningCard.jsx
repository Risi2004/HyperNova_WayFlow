export default function VerificationScanningCard({ settings, onChange }) {
  return (
    <div className="loader-settings-card">
      <div className="settings-card-header">
        <h3 className="settings-card-title">Verification & Barcode Scanning</h3>
        <p className="settings-card-subtitle">
          Configure handheld scanner integration, automated item validation, and LIFO sequence guards.
        </p>
      </div>

      <div className="settings-form-grid">
        {/* Toggle 1: Scanner Audio Feedback */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Acoustic Audio Beep on Valid Scan</span>
            <span className="toggle-sub">
              Emits a high-pitch positive chime on verified items and distinct buzzer on misallocated items.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.scannerBeep}
              onChange={(e) => onChange('scannerBeep', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 2: Auto Advance Checklist */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Auto-Advance Checklist Cursor</span>
            <span className="toggle-sub">
              Automatically scrolls viewport and selects the next expected carton after barcode verification.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.autoAdvance}
              onChange={(e) => onChange('autoAdvance', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 3: Strict LIFO Sequence Lock */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Strict Reverse-LIFO Sequence Enforcement</span>
            <span className="toggle-sub">
              Prevents scanning of early stops (e.g. Stop 01) until deepest route items (Stop 05) are packed.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.strictLifo}
              onChange={(e) => onChange('strictLifo', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Toggle 4: Double Confirmation on High-Value Items */}
        <div className="settings-toggle-row">
          <div className="toggle-text-wrap">
            <span className="toggle-label">Secondary Confirmation on High-Value / Fragile Cargo</span>
            <span className="toggle-sub">
              Requires loader to confirm item condition before completing check-in for electronics & premium lines.
            </span>
          </div>
          <label className="custom-switch">
            <input
              type="checkbox"
              checked={settings.secondaryCheck}
              onChange={(e) => onChange('secondaryCheck', e.target.checked)}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {/* Discrepancy Threshold Select */}
        <div className="settings-field-item">
          <label className="settings-field-label">Discrepancy Auto-Reporting Tolerance</label>
          <select
            className="settings-field-select"
            value={settings.discrepancyThreshold}
            onChange={(e) => onChange('discrepancyThreshold', e.target.value)}
          >
            <option value="1">Strict Zero Tolerance (Flag any difference &gt;= 1 unit)</option>
            <option value="3">Tolerance &gt;= 3 units</option>
            <option value="5">Tolerance &gt;= 5 units</option>
          </select>
          <span className="settings-field-hint">
            Triggers mandatory loading issue reporting modal when entered quantity differs from planned.
          </span>
        </div>
      </div>
    </div>
  )
}
