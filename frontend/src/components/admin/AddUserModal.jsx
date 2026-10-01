import { useState } from 'react'
import './AdminModal.css'

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Dispatcher')
  const [facility, setFacility] = useState('Central Planning Hub')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Active')
  const [tempPassword, setTempPassword] = useState('WayFlow@2026')
  const [showPassword, setShowPassword] = useState(true)
  const [isCustomPassword, setIsCustomPassword] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const roleFacilities = {
    Dispatcher: ['Central Planning Hub', 'Peliyagoda DC', 'Kandy Logistics Hub', 'Galle Regional Hub'],
    'Store Manager': ['Colombo 05 Store', 'Kandy Central Outlet', 'Galle Fort Outlet', 'Negombo Superstore', 'Jaffna City Center'],
    Loader: ['Peliyagoda DC - Bay 02', 'Colombo Central DC', 'Kandy Sorting Facility', 'Galle Transfer Depot'],
    Driver: ['West Hub Fleet (Heavy Refrigerated)', 'Colombo Logistics Fleet (14T Dry)', 'South Coastal Hub (Frozen)', 'Central Express Delivery'],
    Admin: ['Regional HQ - Colombo', 'Global Logistics Operations', 'Enterprise Cloud Admin'],
  }

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (roleFacilities[newRole] && roleFacilities[newRole][0]) {
      setFacility(roleFacilities[newRole][0])
    }
  }

  const validate = () => {
    const err = {}
    if (!name.trim()) err.name = 'Full name is required'
    if (!email.trim()) {
      err.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Valid corporate email required'
    }
    if (!tempPassword.trim()) {
      err.password = 'Initial password is required'
    } else if (tempPassword.trim().length < 6) {
      err.password = 'Password must be at least 6 characters'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      facility,
      phone: phone.trim() || '+94 77 000 0000',
      status,
      lastActive: 'Just registered',
      avatar: initials || 'WF',
      joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }

    onAddUser(newUser)
    onClose()
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <span className="admin-modal-badge">SECURITY & ACCESS CONTROL</span>
            <h2 className="admin-modal-title">Provision New System User</h2>
            <p className="admin-modal-desc">Assign operational role, facility clearance, and authenticate credentials.</p>
          </div>
          <button type="button" className="btn-admin-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-grid">
            {/* Full Name */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                FULL NAME <span className="admin-required-star">*</span>
              </label>
              <input
                type="text"
                className={`admin-form-input ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Kasun Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className="admin-form-error">{errors.name}</span>}
            </div>

            {/* Email Address */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                CORPORATE EMAIL <span className="admin-required-star">*</span>
              </label>
              <input
                type="email"
                className={`admin-form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="kasun.silva@wayflow.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="admin-form-error">{errors.email}</span>}
            </div>

            {/* Role Selection */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                OPERATIONAL ROLE <span className="admin-required-star">*</span>
              </label>
              <select
                className="admin-form-select"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="Dispatcher">Dispatcher (Fleet & Route Planner)</option>
                <option value="Store Manager">Store Manager (Outlet & Orders)</option>
                <option value="Loader">Loader (Dock & Vehicle Staging)</option>
                <option value="Driver">Driver (Fleet Navigation & Delivery)</option>
                <option value="Admin">Super Administrator (Full System)</option>
              </select>
            </div>

            {/* Facility / Location */}
            <div className="admin-form-group">
              <label className="admin-form-label">ASSIGNED FACILITY / OUTLET</label>
              <select
                className="admin-form-select"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
              >
                {(roleFacilities[role] || []).map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Phone */}
            <div className="admin-form-group">
              <label className="admin-form-label">CONTACT PHONE</label>
              <input
                type="tel"
                className="admin-form-input"
                placeholder="+94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Initial Status */}
            <div className="admin-form-group">
              <label className="admin-form-label">ACCOUNT STATUS</label>
              <select
                className="admin-form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active (Immediate Login Enabled)</option>
                <option value="Inactive">Inactive (Pending Onboarding)</option>
                <option value="Suspended">Suspended (Access Blocked)</option>
              </select>
            </div>
          </div>

          {/* Password Box */}
          <div className="admin-temp-password-box">
            <div className="admin-temp-pass-header">
              <span className="admin-temp-pass-title">
                Initial Account Password <span className="admin-required-star">*</span>
              </span>
              <span
                className="admin-temp-pass-badge"
                style={{
                  color: isCustomPassword ? '#c084fc' : '#34d399',
                  background: isCustomPassword ? 'rgba(168, 85, 247, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: isCustomPassword ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {isCustomPassword ? 'Custom Password' : 'Auto-Generated'}
              </span>
            </div>
            <div className="admin-temp-pass-row">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`admin-temp-pass-input ${errors.password ? 'has-error' : ''}`}
                value={tempPassword}
                placeholder="Enter password (min 6 characters)..."
                onChange={(e) => {
                  setTempPassword(e.target.value)
                  setIsCustomPassword(true)
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }))
                  }
                }}
              />
              <button
                type="button"
                className="btn-admin-pass-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
              <button
                type="button"
                className="btn-admin-temp-regen"
                onClick={() => {
                  setTempPassword(`WayFlow@${Math.floor(1000 + Math.random() * 9000)}`)
                  setIsCustomPassword(false)
                  setShowPassword(true)
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }))
                  }
                }}
                title="Generate secure random password"
              >
                Regenerate
              </button>
            </div>
            {errors.password && <span className="admin-form-error">{errors.password}</span>}
            <p className="admin-temp-pass-note">
              You can type a custom password or click Regenerate for an auto-generated one. User can update it upon first login.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="admin-modal-footer">
            <button type="button" className="btn-admin-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-modal-submit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Provision User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
