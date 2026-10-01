import { useState, useEffect } from 'react'
import { userService } from '../../services/userService'
import CustomSelect from './CustomSelect'
import './AdminModal.css'

export default function AddUserModal({ isOpen, onClose, onAddUser }) {
  // Step 1: 3 Initial Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  // Reference data loaded from Master Registry
  const [dbOutlets, setDbOutlets] = useState([])
  const [dbVehicles, setDbVehicles] = useState([])
  const [loadingRefs, setLoadingRefs] = useState(false)

  // Step 2: Role-Specific State
  // Store Manager
  const [selectedOutletId, setSelectedOutletId] = useState('')
  const [selectedOutlet, setSelectedOutlet] = useState(null)

  // Dispatcher
  const [selectedHub, setSelectedHub] = useState('Peliyagoda Central Planning Hub')

  // Loader
  const [loaderDepot, setLoaderDepot] = useState('Peliyagoda DC')
  const [loaderBay, setLoaderBay] = useState('Bay 02 (Chilled / Reefer)')

  // Driver
  const [driverDepot, setDriverDepot] = useState('Peliyagoda')
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  // Admin
  const [adminFacility, setAdminFacility] = useState('Regional HQ - Colombo')

  // Step 3: Contact & Security
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('Active')
  const [tempPassword, setTempPassword] = useState(`WayFlow@${Math.floor(1000 + Math.random() * 9000)}`)
  const [showPassword, setShowPassword] = useState(true)
  const [isCustomPassword, setIsCustomPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoadingRefs(true)
      Promise.all([userService.getOutlets(), userService.getVehicles()])
        .then(([outlets, vehicles]) => {
          setDbOutlets(outlets || [])
          setDbVehicles(vehicles || [])
          if (outlets && outlets.length > 0) {
            setSelectedOutletId(outlets[0].outlet_id)
            setSelectedOutlet(outlets[0])
          }
          if (vehicles && vehicles.length > 0) {
            setSelectedVehicleId(vehicles[0].vehicle_id)
            setSelectedVehicle(vehicles[0])
          }
        })
        .catch((err) => console.error('Failed to load reference data:', err))
        .finally(() => setLoadingRefs(false))
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleRoleSelect = (newRole) => {
    setRole(newRole)
    setErrors((prev) => ({ ...prev, role: null }))

    // Default configuration upon selecting role
    if (newRole === 'Store Manager' && dbOutlets.length > 0 && !selectedOutletId) {
      setSelectedOutletId(dbOutlets[0].outlet_id)
      setSelectedOutlet(dbOutlets[0])
    }
    if (newRole === 'Driver' && dbVehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(dbVehicles[0].vehicle_id)
      setSelectedVehicle(dbVehicles[0])
    }
  }

  const handleOutletChange = (outletId) => {
    setSelectedOutletId(outletId)
    const found = dbOutlets.find((o) => o.outlet_id === outletId)
    setSelectedOutlet(found || null)
  }

  const handleVehicleChange = (vehId) => {
    setSelectedVehicleId(vehId)
    const found = dbVehicles.find((v) => v.vehicle_id === vehId)
    setSelectedVehicle(found || null)
  }

  const validate = () => {
    const err = {}
    if (!name.trim()) err.name = 'Full name is required'
    if (!email.trim()) {
      err.email = 'Corporate email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.email = 'Valid corporate email required'
    }
    if (!role) {
      err.role = 'Please select an operational role'
    }
    if (role === 'Store Manager' && !selectedOutletId) {
      err.outlet = 'Please select an assigned store outlet'
    }
    if (!tempPassword.trim()) {
      err.password = 'Initial temporary password is required'
    } else if (tempPassword.trim().length < 6) {
      err.password = 'Password must be at least 6 characters'
    }
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    // Compute facility description based on role
    let computedFacility = ''
    let computedOutletId = null
    let computedVehicleId = null

    if (role === 'Store Manager') {
      computedOutletId = selectedOutletId
      computedFacility = selectedOutlet
        ? `Store ${selectedOutlet.outlet_id} - ${selectedOutlet.district} (${selectedOutlet.brand})`
        : `Store ${selectedOutletId}`
    } else if (role === 'Dispatcher') {
      computedFacility = selectedHub
    } else if (role === 'Loader') {
      computedFacility = `${loaderDepot} - ${loaderBay}`
    } else if (role === 'Driver') {
      computedVehicleId = selectedVehicleId
      computedFacility = `${driverDepot} Fleet Hub (${selectedVehicleId || 'Standard Fleet'})`
    } else if (role === 'Admin') {
      computedFacility = adminFacility
    }

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      facility: computedFacility,
      outlet_id: computedOutletId,
      assigned_vehicle_id: computedVehicleId,
      phone: phone.trim() || '+94 77 123 4567',
      status,
      temporaryPassword: tempPassword.trim(),
    }

    try {
      const response = await userService.createUser(payload)
      setIsSubmitting(false)
      onAddUser(response.user || response, response.emailDispatch)
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      setErrors((prev) => ({ ...prev, api: err.message }))
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <span className="admin-modal-badge">SECURITY & ACCESS CONTROL</span>
            <h2 className="admin-modal-title">Provision New System User</h2>
            <p className="admin-modal-desc">
              Assign operational role, facility clearance, and authenticate credentials.
            </p>
          </div>
          <button type="button" className="btn-admin-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          {errors.api && <div className="admin-form-error" style={{ marginBottom: 12 }}>⚠️ {errors.api}</div>}

          {/* INITIAL 3 FIELDS */}
          <div className="admin-form-grid">
            {/* 1. Full Name */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                FULL NAME <span className="admin-required-star">*</span>
              </label>
              <input
                type="text"
                className={`admin-form-input ${errors.name ? 'has-error' : ''}`}
                placeholder="e.g. Kasun Silva"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                }}
              />
              {errors.name && <span className="admin-form-error">{errors.name}</span>}
            </div>

            {/* 2. Corporate Email */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                CORPORATE EMAIL <span className="admin-required-star">*</span>
              </label>
              <input
                type="email"
                className={`admin-form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="kasun.silva@wayflow.internal"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }))
                }}
              />
              {errors.email && <span className="admin-form-error">{errors.email}</span>}
            </div>

            {/* 3. Operational Role */}
            <div className="admin-form-group" style={{ gridColumn: role ? 'span 1' : 'span 2' }}>
              <label className="admin-form-label">
                OPERATIONAL ROLE <span className="admin-required-star">*</span>
              </label>
              <CustomSelect
                options={[
                  { value: 'Store Manager', label: 'Store Manager (Outlet & Orders)' },
                  { value: 'Dispatcher', label: 'Dispatcher (Fleet & Route Planner)' },
                  { value: 'Loader', label: 'Loader (Dock & Vehicle Staging)' },
                  { value: 'Driver', label: 'Driver (Fleet Navigation & Delivery)' },
                  { value: 'Admin', label: 'Super Administrator (Full System)' },
                ]}
                value={role}
                onChange={(val) => handleRoleSelect(val)}
                placeholder="-- Select Operational Role --"
                hasError={!!errors.role}
                searchable={false}
              />
              {errors.role && <span className="admin-form-error">{errors.role}</span>}
            </div>
          </div>

          {/* DYNAMIC ROLE-BASED QUESTIONS (SHOWN ONLY AFTER SELECTING ROLE) */}
          {role && (
            <div className="admin-dynamic-role-section">
              <div className="admin-role-section-header">
                <span className="admin-role-section-title">
                  Role Assignment & Clearance: {role}
                </span>
                <span className="admin-modal-badge" style={{ fontSize: '0.65rem', margin: 0 }}>
                  Verified Operations Registry
                </span>
              </div>

              {/* STORE MANAGER QUESTIONS */}
              {role === 'Store Manager' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      SELECT ASSIGNED OUTLET NUMBER <span className="admin-required-star">*</span>
                    </label>
                    <CustomSelect
                      options={dbOutlets.map((o) => ({
                        value: o.outlet_id,
                        label: `${o.outlet_id} — ${o.district} (${o.brand} • ${o.dock_type})`,
                      }))}
                      value={selectedOutletId}
                      onChange={(val) => handleOutletChange(val)}
                      disabled={loadingRefs}
                      searchable={true}
                    />
                  </div>

                  {/* AUTO-CONFIRMATION CARD FOR STORE MANAGER */}
                  {selectedOutlet && (
                    <div className="admin-confirm-card">
                      <div className="admin-confirm-grid">
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Confirmed City / District</span>
                          <span className="admin-confirm-value" style={{ color: '#38bdf8' }}>
                            📍 {selectedOutlet.district}
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Serving Distribution Hub</span>
                          <span className="admin-confirm-value">
                            🏢 {selectedOutlet.depot} Depot
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Retail Brand</span>
                          <span className="admin-confirm-value">
                            🏷️ Waypoint {selectedOutlet.brand}
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Dock & Access Clearance</span>
                          <span className="admin-confirm-value">
                            🚚 {selectedOutlet.dock_type} ({selectedOutlet.parking_constraint})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* DISPATCHER QUESTIONS */}
              {role === 'Dispatcher' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      ASSIGNED PLANNING HUB / DEPOT <span className="admin-required-star">*</span>
                    </label>
                    <CustomSelect
                      options={[
                        { value: 'Peliyagoda Central Planning Hub', label: 'Peliyagoda Central Planning Hub (West/South)' },
                        { value: 'Kandy Regional Planning Hub', label: 'Kandy Regional Planning Hub (Central/Hill Country)' },
                        { value: 'Central Network Control Center', label: 'Central Network Control Center (All Island)' },
                      ]}
                      value={selectedHub}
                      onChange={(val) => setSelectedHub(val)}
                      searchable={false}
                    />
                  </div>
                  <div className="admin-confirm-card">
                    <span className="admin-confirm-label">Controlled Coverage Area</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      {selectedHub.includes('Peliyagoda')
                        ? 'Covers 7 Outbound Districts: Colombo, Gampaha, Kalutara, Galle, Matara, Kurunegala, Puttalam.'
                        : selectedHub.includes('Kandy')
                        ? 'Covers 5 Central Districts: Kandy, Matale, Nuwara Eliya, Badulla, Kegalle.'
                        : 'Enterprise network dispatcher with global route visibility across all 12 districts.'}
                    </p>
                  </div>
                </>
              )}

              {/* LOADER QUESTIONS */}
              {role === 'Loader' && (
                <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">WAREHOUSE DEPOT</label>
                    <CustomSelect
                      options={[
                        { value: 'Peliyagoda DC', label: 'Peliyagoda Distribution Center' },
                        { value: 'Kandy Hub', label: 'Kandy Logistics Hub' },
                      ]}
                      value={loaderDepot}
                      onChange={(val) => setLoaderDepot(val)}
                      searchable={false}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">ASSIGNED LOADING BAY</label>
                    <CustomSelect
                      options={[
                        { value: 'Bay 01 (Ambient Dry-Box)', label: 'Bay 01 (Ambient Dry-Box)' },
                        { value: 'Bay 02 (Chilled / Reefer)', label: 'Bay 02 (Chilled / Reefer)' },
                        { value: 'Bay 03 (Heavy Freight & Tech)', label: 'Bay 03 (Heavy Freight & Tech)' },
                        { value: 'Bay 04 (Express Van Staging)', label: 'Bay 04 (Express Van Staging)' },
                      ]}
                      value={loaderBay}
                      onChange={(val) => setLoaderBay(val)}
                      searchable={false}
                    />
                  </div>
                </div>
              )}

              {/* DRIVER QUESTIONS */}
              {role === 'Driver' && (
                <>
                  <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">HOME FLEET DEPOT</label>
                      <CustomSelect
                        options={[
                          { value: 'Peliyagoda', label: 'Peliyagoda Depot Base' },
                          { value: 'Kandy', label: 'Kandy Depot Base' },
                        ]}
                        value={driverDepot}
                        onChange={(val) => {
                          setDriverDepot(val)
                          const filtered = dbVehicles.filter((v) => v.depot === val)
                          if (filtered.length > 0) {
                            setSelectedVehicleId(filtered[0].vehicle_id)
                            setSelectedVehicle(filtered[0])
                          }
                        }}
                        searchable={false}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">PRIMARY ASSIGNED VEHICLE</label>
                      <CustomSelect
                        options={dbVehicles
                          .filter((v) => !driverDepot || v.depot === driverDepot)
                          .map((v) => ({
                            value: v.vehicle_id,
                            label: `${v.vehicle_id} (${v.type.toUpperCase()} • ${v.temp.toUpperCase()})`,
                          }))}
                        value={selectedVehicleId}
                        onChange={(val) => handleVehicleChange(val)}
                        searchable={true}
                      />
                    </div>
                  </div>

                  {/* AUTO-CONFIRMATION CARD FOR DRIVER VEHICLE */}
                  {selectedVehicle && (
                    <div className="admin-confirm-card">
                      <div className="admin-confirm-grid">
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Vehicle Classification</span>
                          <span className="admin-confirm-value" style={{ color: '#34d399' }}>
                            🚛 {selectedVehicle.type.toUpperCase()} ({selectedVehicle.temp === 'reefer' ? 'Refrigerated Cold Chain' : 'Ambient Dry-Box'})
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Trip Payload Capacities</span>
                          <span className="admin-confirm-value">
                            ⚖️ {selectedVehicle.weight_cap_kg} kg • {selectedVehicle.volume_cap_m3} m³
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Fuel Allowance Profile</span>
                          <span className="admin-confirm-value">
                            ⛽ {selectedVehicle.weekly_fuel_quota_l} L / week ({selectedVehicle.km_per_l} km/L)
                          </span>
                        </div>
                        <div className="admin-confirm-item">
                          <span className="admin-confirm-label">Permitted Outlets</span>
                          <span className="admin-confirm-value">
                            {selectedVehicle.type === 'van' ? 'All stores (including van_only)' : 'Standard bay & street docks'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ADMIN QUESTIONS */}
              {role === 'Admin' && (
                <div className="admin-form-group">
                  <label className="admin-form-label">HEADQUARTERS / SECURITY CLEARANCE</label>
                  <CustomSelect
                    options={[
                      { value: 'Regional HQ - Colombo', label: 'Regional HQ - Colombo (Global Security Officer)' },
                      { value: 'Central Network Operations', label: 'Central Network Operations (Infrastructure Administrator)' },
                      { value: 'Enterprise Cloud Operations', label: 'Enterprise Cloud Operations (Platform Administrator)' },
                    ]}
                    value={adminFacility}
                    onChange={(val) => setAdminFacility(val)}
                    searchable={false}
                  />
                </div>
              )}

              {/* CONTACT PHONE & STATUS */}
              <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
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

                <div className="admin-form-group">
                  <label className="admin-form-label">ACCOUNT STATUS</label>
                  <CustomSelect
                    options={[
                      { value: 'Active', label: 'Active (Immediate Login Enabled)' },
                      { value: 'Inactive', label: 'Inactive (Pending Onboarding)' },
                      { value: 'Suspended', label: 'Suspended (Access Blocked)' },
                    ]}
                    value={status}
                    onChange={(val) => setStatus(val)}
                    searchable={false}
                  />
                </div>
              </div>

              {/* TEMPORARY PASSWORD BOX */}
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
                  ✉️ An email will be dispatched to <strong>{email || 'the user'}</strong> with their login ID and temporary password. The user will be required to update it upon first login.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="admin-modal-footer">
            <button type="button" className="btn-admin-modal-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-admin-modal-submit" disabled={isSubmitting}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{isSubmitting ? 'Provisioning User...' : 'Provision User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
