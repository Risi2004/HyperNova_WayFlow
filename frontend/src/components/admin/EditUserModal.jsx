import { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import './AdminModal.css'

// Same facility choices as Add User. Store managers are linked to an outlet and drivers to a
// vehicle from the master data, because ordering and trip assignment depend on those links.
const LOADER_BAYS = ['Bay 01 (Ambient Dry-Box)', 'Bay 02 (Chilled / Reefer)', 'Bay 03 (Heavy Freight & Tech)', 'Bay 04 (Express Van Staging)']
const HUB_FACILITIES = {
  Dispatcher: ['Peliyagoda Central Planning Hub', 'Kandy Regional Planning Hub', 'Central Network Control Center'],
  Loader: ['Peliyagoda DC', 'Kandy Hub'].flatMap((depot) => LOADER_BAYS.map((bay) => `${depot} - ${bay}`)),
  Admin: ['Regional HQ - Colombo', 'Central Network Operations', 'Enterprise Cloud Operations'],
}

export default function EditUserModal({ isOpen, onClose, user, onUpdateUser }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Dispatcher')
  const [facility, setFacility] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Active')
  const [outletId, setOutletId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [errors, setErrors] = useState({})
  const [dbOutlets, setDbOutlets] = useState([])
  const [dbVehicles, setDbVehicles] = useState([])

  useEffect(() => {
    if (!isOpen) return
    let active = true
    Promise.all([userService.getOutlets(), userService.getVehicles()])
      .then(([outlets, vehicles]) => {
        if (!active) return
        setDbOutlets(outlets || [])
        setDbVehicles(vehicles || [])
      })
      .catch((err) => console.error('Failed to load outlets / vehicles:', err))
    return () => {
      active = false
    }
  }, [isOpen])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setRole(user.role || 'Dispatcher')
      setFacility(user.facility || '')
      setOutletId(user.outlet_id || '')
      setVehicleId(user.assigned_vehicle_id || '')
      setPhone(user.phone || '')
      setStatus(user.status || 'Active')
      setErrors({})
    }
  }, [user])

  if (!isOpen || !user) return null

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (HUB_FACILITIES[newRole]) setFacility(HUB_FACILITIES[newRole][0])
    if (newRole === 'Store Manager' && !outletId && dbOutlets[0]) setOutletId(dbOutlets[0].outlet_id)
    if (newRole === 'Driver' && !vehicleId && dbVehicles[0]) setVehicleId(dbVehicles[0].vehicle_id)
  }

  // Keep the user's current facility selectable even if it is not one of the standard labels.
  const hubOptions = HUB_FACILITIES[role]
    ? [...new Set([...(HUB_FACILITIES[role].includes(facility) || !facility ? [] : [facility]), ...HUB_FACILITIES[role]])]
    : []

  const validate = () => {
    const err = {}
    if (!name.trim()) err.name = 'Full name is required'
    if (role === 'Store Manager' && !outletId) err.facility = 'Select the outlet this store manager runs'
    if (role === 'Driver' && !vehicleId) err.facility = 'Select the vehicle this driver is assigned to'
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

    // Facility label and outlet / vehicle links follow the same format as Add User.
    let finalFacility = facility
    let finalOutletId = null
    let finalVehicleId = null
    if (role === 'Store Manager') {
      const outlet = dbOutlets.find((o) => o.outlet_id === outletId)
      finalOutletId = outletId
      finalFacility = outlet ? `Store ${outlet.outlet_id} - ${outlet.district} (${outlet.brand})` : `Store ${outletId}`
    } else if (role === 'Driver') {
      const vehicle = dbVehicles.find((v) => v.vehicle_id === vehicleId)
      finalVehicleId = vehicleId
      finalFacility = `${vehicle?.depot || 'Peliyagoda'} Fleet Hub (${vehicleId})`
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      facility: finalFacility,
      outlet_id: finalOutletId,
      assigned_vehicle_id: finalVehicleId,
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
              <label className="admin-form-label">
                {role === 'Store Manager' ? 'ASSIGNED OUTLET' : role === 'Driver' ? 'ASSIGNED VEHICLE' : 'ASSIGNED FACILITY'}
              </label>
              {role === 'Store Manager' ? (
                <select className="admin-form-select" value={outletId} onChange={(e) => setOutletId(e.target.value)}>
                  {!outletId && <option value="">Select an outlet…</option>}
                  {dbOutlets.map((o) => (
                    <option key={o.outlet_id} value={o.outlet_id}>
                      {o.outlet_id} — {o.district} ({o.brand} • {o.dock_type})
                    </option>
                  ))}
                </select>
              ) : role === 'Driver' ? (
                <select className="admin-form-select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                  {!vehicleId && <option value="">Select a vehicle…</option>}
                  {dbVehicles.map((v) => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>
                      {v.vehicle_id} ({v.type.toUpperCase()} • {v.temp.toUpperCase()}) — {v.depot}
                    </option>
                  ))}
                </select>
              ) : (
                <select className="admin-form-select" value={facility} onChange={(e) => setFacility(e.target.value)}>
                  {hubOptions.map((fac) => (
                    <option key={fac} value={fac}>
                      {fac}
                    </option>
                  ))}
                </select>
              )}
              {errors.facility && <span className="admin-form-error">{errors.facility}</span>}
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
