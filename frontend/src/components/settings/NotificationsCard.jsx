export default function NotificationsCard({ settings, onChange }) {
  return (
    <div className="settings-section-card">
      <div className="section-card-header">
        <div className="section-header-title-box">
          <h2 className="section-card-title">Alerts & Dispatch Notifications</h2>
          <p className="section-card-subtitle">
            Manage operational escalation thresholds, automated driver SMS alerts, and supervisor summaries
          </p>
        </div>
        <span className="section-badge-pill">DISPATCH ALERTS</span>
      </div>

      <div className="settings-toggles-grid">
        {/* SLA Breach Alert */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Projected SLA Delay Alarm</span>
            <p className="toggle-subtitle">
              Trigger urgent audio chime and red banner on dispatcher dashboard when any truck is projected &gt;15 mins late.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="slaAlarm">
            <input
              id="slaAlarm"
              type="checkbox"
              checked={settings.slaAlarm}
              onChange={(e) => onChange('slaAlarm', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Driver Manifest SMS / WhatsApp */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Automated Driver Trip Push via SMS / WhatsApp</span>
            <p className="toggle-subtitle">
              Send turn-by-turn route link and manifest overview to driver mobile upon dispatcher route confirmation.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="driverSms">
            <input
              id="driverSms"
              type="checkbox"
              checked={settings.driverSms}
              onChange={(e) => onChange('driverSms', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Customer Outlet Arrival Notice */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Store Receiving Pre-Arrival Ping</span>
            <p className="toggle-subtitle">
              Notify store receiving manager 10 minutes prior to delivery vehicle crossing destination geofence.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="customerPreAlert">
            <input
              id="customerPreAlert"
              type="checkbox"
              checked={settings.customerPreAlert}
              onChange={(e) => onChange('customerPreAlert', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Route Deviation / Detour Notice */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Vehicle Route Detour / Tamper Alert</span>
            <p className="toggle-subtitle">
              Instantly alert dispatcher if any vehicle strays greater than 800m outside authorized road corridor.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="detourAlert">
            <input
              id="detourAlert"
              type="checkbox"
              checked={settings.detourAlert}
              onChange={(e) => onChange('detourAlert', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Reefer Temperature Excursion Emergency */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Cold-Chain Temperature Excursion Siren</span>
            <p className="toggle-subtitle">
              Emergency priority alert if reefer truck internal sensor rises above 6.0°C for longer than 4 minutes.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="temperatureAlarm">
            <input
              id="temperatureAlarm"
              type="checkbox"
              checked={settings.temperatureAlarm}
              onChange={(e) => onChange('temperatureAlarm', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Nightly Reconciliation Summary Email */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Daily EOD Reconciliation Email Digest</span>
            <p className="toggle-subtitle">
              Deliver comprehensive PDF breakdown of completed orders, fuel spent, and exceptions to management.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="nightlyEmailDigest">
            <input
              id="nightlyEmailDigest"
              type="checkbox"
              checked={settings.nightlyEmailDigest}
              onChange={(e) => onChange('nightlyEmailDigest', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  )
}
