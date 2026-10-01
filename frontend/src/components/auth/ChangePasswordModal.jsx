import { useState } from 'react'
import { authService } from '../../services/authService'
import './ChangePasswordModal.css'

export default function ChangePasswordModal({ isOpen, user, onSuccess }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    setLoading(true)
    try {
      await authService.changePassword(null, newPassword)
      setLoading(false)
      onSuccess()
    } catch (err) {
      setLoading(false)
      setError(err.message || 'Failed to update password.')
    }
  }

  return (
    <div className="pwd-modal-overlay">
      <div className="pwd-modal-card">
        <div className="pwd-modal-badge">SECURITY REQUIREMENT</div>
        <h2 className="pwd-modal-title">First Login Password Update</h2>
        <p className="pwd-modal-subtitle">
          Hello <strong>{user?.name || user?.email}</strong>. Because this is your initial sign-in with temporary credentials, please choose a permanent, secure password to continue.
        </p>

        {error && <div className="pwd-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="pwd-modal-form">
          <div className="pwd-form-group">
            <label className="pwd-form-label">NEW PASSWORD</label>
            <div className="pwd-input-wrap">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className="pwd-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pwd-form-group">
            <label className="pwd-form-label">CONFIRM NEW PASSWORD</label>
            <div className="pwd-input-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="pwd-input"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirmed password' : 'Show confirmed password'}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="pwd-submit-btn" disabled={loading}>
            {loading ? 'Securing Account...' : 'Set Permanent Password & Continue →'}
          </button>
        </form>
      </div>
    </div>
  )
}
