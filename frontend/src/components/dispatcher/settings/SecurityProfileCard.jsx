import { useEffect, useState } from 'react'
import { useCurrentUser, initialsOf } from '../../../hooks/useCurrentUser'
import { apiRequest } from '../../../services/apiClient'
import { dispatchStatusOf, formatTimestamp } from '../../../utils/orderFormat'

// The signed-in dispatcher's identity and their most recent order decisions.
export default function SecurityProfileCard({ settings, onChange }) {
  const user = useCurrentUser()
  const [auditLogs, setAuditLogs] = useState(null)

  useEffect(() => {
    let active = true
    apiRequest('/auth/activity')
      .then((res) => active && setAuditLogs(res.events))
      .catch(() => active && setAuditLogs([]))
    return () => {
      active = false
    }
  }, [])

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
        <div className="profile-avatar-large">{initialsOf(user?.name)}</div>
        <div className="profile-info-block">
          <div className="profile-name-row">
            <span className="profile-fullname bold">{user?.name}</span>
            <span className="profile-role-tag">{user?.role}</span>
          </div>
          <span className="profile-email">{user?.email}</span>
          <span className="profile-hub-location">Assigned: {user?.facility} · ID: {user?.id}</span>
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
        <span className="audit-trail-title bold">Your Recent Order Decisions</span>
        <div className="audit-list">
          {auditLogs === null && <span className="audit-meta">Loading activity…</span>}
          {auditLogs?.length === 0 && <span className="audit-meta">No order decisions recorded yet.</span>}
          {auditLogs?.map((log, idx) => {
            const ts = formatTimestamp(log.created_at)
            const action = log.from_status === log.to_status && log.to_status !== 'deferred'
              ? log.note || 'Order updated'
              : `${log.order_id} → ${dispatchStatusOf(log.to_status).label}`
            return (
              <div key={idx} className="audit-entry-row">
                <div className="audit-dot"></div>
                <div className="audit-content">
                  <span className="audit-action bold">{action}</span>
                  <span className="audit-meta">
                    {log.order_id} · {ts.date} at {ts.time}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
