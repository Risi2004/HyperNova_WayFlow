import { useState, useEffect } from 'react'
import './AdminModal.css'

export default function EditUserModal({ isOpen, onClose, user, onUpdateUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Dispatcher')
  const [facility, setFacility] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Active')
  const [errors, setErrors] = useState({})

  const roleFacilities = {
    Dispatcher: ['Central Planning Hub', 'Peliyagoda DC', 'Kandy Logistics Hub', 'Galle Regional Hub'],
    'Store Manager': ['Colombo 05 Store', 'Kandy Central Outlet', 'Galle Fort Outlet', 'Negombo Superstore', 'Jaffna City Center'],
    Loader: ['Peliyagoda DC - Bay 02', 'Colombo Central DC', 'Kandy Sorting Facility', 'Galle Transfer Depot'],
    Driver: ['West Hub Fleet (Heavy Refrigerated)', 'Colombo Logistics Fleet (14T Dry)', 'South Coastal Hub (Frozen)', 'Central Express Delivery'],
    Admin: ['Regional HQ - Colombo', 'Global Logistics Operations', 'Enterprise Cloud Admin'],
  }

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'Dispatcher')
      setFacility(user.facility || '')
      setPhone(user.phone || '')
      setStatus(user.status || 'Active')
      setErrors({})
    }
  }, [user])

  if (!isOpen || !user) return null

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
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      facility,
      phone: phone.trim() || user.phone,
      status,
    }

    onUpdateUser(updatedUser)
    onClose()
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <span className="admin-modal-badge edit">PROFILE & ROLE RECONFIGURATION</span>
            <h2 className="admin-modal-title">Edit User — {user.id}</h2>
            <p className="admin-modal-desc">Modify access credentials, change assigned role, or update clearance facility.</p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="admin-form-error">{errors.email}</span>}
            </div>

            {/* Operational Role */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                ASSIGNED OPERATIONAL ROLE <span className="admin-required-star">*</span>
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

            {/* Facility */}
            <div className="admin-form-group">
              <label className="admin-form-label">ASSIGNED FACILITY / OUTLET</label>
              <select
                className="admin-form-select"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
              >
                {(roleFacilities[role] || [facility]).map((fac) => (
                  <option key={fac} value={fac}>
                    {fac}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Phone */}
            <div className="admin-form-group">
              <label className="admin-form-label">PHONE NUMBER</label>
              <input
                type="tel"
                className="admin-form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* Account Status */}
            <div className="admin-form-group">
              <label className="admin-form-label">ACCOUNT STATUS</label>
              <select
                className="admin-form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active (Granted Console Access)</option>
                <option value="Inactive">Inactive (Dormant Account)</option>
                <option value="Suspended">Suspended (Security Lockout)</option>
              </select>
            </div>
          </div>

          {/* User metadata notice */}
          <div className="admin-user-info-strip">
            <span className="admin-strip-item">
              <strong>User ID:</strong> {user.id}
            </span>
            <span className="admin-strip-sep">•</span>
            <span className="admin-strip-item">
              <strong>Joined:</strong> {user.joinedDate}
            </span>
            <span className="admin-strip-sep">•</span>
            <span className="admin-strip-item">
              <strong>Last Active:</strong> {user.lastActive}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="admin-modal-footer">
            <button type="button" className="btn-admin-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-modal-submit edit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
