export default function SecurityProfileCard({ settings, onChange }) {
  const auditLogs = [
    {
      action: 'Updated Routing Engine Max Shift to 8.5 Hours',
      user: 'Jordan Davis',
      ip: '192.168.10.45 (West Hub LAN)',
      time: 'Today at 07:15 AM',
    },
    {
      action: 'Authorized Emergency Driver Override for TR-024',
      user: 'Jordan Davis',
      ip: '192.168.10.45 (West Hub LAN)',
      time: 'Today at 06:40 AM',
    },
    {
      action: 'Rotated Telematics GPS Stream API Token',
      user: 'System Admin',
      ip: '10.0.4.12 (Peliyagoda Server)',
      time: 'Yesterday at 22:30 PM',
    },
  ]

  return (
    <div className="settings-section-card">
      <div className="section-card-header">
        <div className="section-header-title-box">
          <h2 className="section-card-title">Dispatcher Profile & Security Safeguards</h2>
          <p className="section-card-subtitle">
            Manage logged-in session credentials, two-factor authentication, and supervisory audit trails
          </p>
        </div>
        <span className="section-badge-pill green">SESSION SECURED</span>
      </div>

      {/* User Identity Card */}
      <div className="profile-identity-strip">
        <div className="profile-avatar-large">JD</div>
        <div className="profile-info-block">
          <div className="profile-name-row">
            <span className="profile-fullname bold">Jordan Davis</span>
            <span className="profile-role-tag">Senior Operations Dispatcher</span>
          </div>
          <span className="profile-email">jordan.davis@waypoint.lk</span>
          <span className="profile-hub-location">Assigned: Peliyagoda West DC Â· ID: DISP-0042</span>
        </div>
      </div>

      <div className="settings-divider" />

      {/* Security Policies Grid */}
      <div className="settings-toggles-grid">
        {/* Two-Factor Authentication */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Two-Factor Authentication (2FA)</span>
            <p className="toggle-subtitle">
              Require FIDO2 security key or authenticator app verification upon every dispatcher terminal login.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="twoFactorAuth">
            <input
              id="twoFactorAuth"
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => onChange('twoFactorAuth', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* Auto Session Inactivity Timeout */}
        <div className="setting-toggle-row">
          <div className="toggle-text-col">
            <span className="toggle-title">Inactivity Auto-Lock (30 Minutes)</span>
            <p className="toggle-subtitle">
              Automatically lock the dispatch console and require re-authentication if mouse or keyboard is idle.
            </p>
          </div>
          <label className="switch-toggle" htmlFor="autoLockSession">
            <input
              id="autoLockSession"
              type="checkbox"
              checked={settings.autoLockSession}
              onChange={(e) => onChange('autoLockSession', e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="settings-divider" />

      {/* Security Audit Trail */}
      <div className="audit-trail-container">
        <span className="audit-trail-title bold">Recent Dispatcher Audit Trail</span>
        <div className="audit-list">
          {auditLogs.map((log, idx) => (
            <div key={idx} className="audit-entry-row">
              <div className="audit-dot"></div>
              <div className="audit-content">
                <span className="audit-action bold">{log.action}</span>
                <span className="audit-meta">
                  By {log.user} Â· {log.ip} Â· {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
