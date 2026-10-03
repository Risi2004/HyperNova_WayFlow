import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import AddUserModal from '../../../components/admin/AddUserModal'
import { getRoleColor } from '../../../services/adminUserData'
import { userService } from '../../../services/userService'
import { apiRequest } from '../../../services/apiClient'
import { dispatchStatusOf, formatTimestamp } from '../../../utils/orderFormat'

const ROLE_ACCENTS = {
  Dispatcher: '#60a5fa',
  Driver: '#34d399',
  Loader: '#fbbf24',
  'Store Manager': '#c084fc',
  Admin: '#fb7185',
  System: '#94a3b8',
}

// "5 mins ago" style relative time for the activity feed.
function timeAgo(ts) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 60000))
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const f = formatTimestamp(ts)
  return `${f.date}, ${f.time}`
}
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [activity, setActivity] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Live user counts and activity from the database.
  useEffect(() => {
    let active = true
    userService
      .getUsers()
      .then((list) => active && setUsers(list || []))
      .catch(() => active && setUsers([]))
    apiRequest('/users/activity')
      .then((res) => active && setActivity(res.activity))
      .catch(() => active && setActivity([]))
    return () => {
      active = false
    }
  }, [reloadKey])

  const handleAddUser = () => {
    setIsAddModalOpen(false)
    setReloadKey((k) => k + 1)
  }

  // Calculate metrics
  const totalUsers = users.length
  const dispatchers = users.filter((u) => u.role === 'Dispatcher')
  const drivers = users.filter((u) => u.role === 'Driver')
  const loaders = users.filter((u) => u.role === 'Loader')
  const storeManagers = users.filter((u) => u.role === 'Store Manager')
  const admins = users.filter((u) => u.role === 'Admin')
  const activeUsers = users.filter((u) => u.status === 'Active').length

  const roleStats = [
    { role: 'Dispatcher', count: dispatchers.length, color: '#60a5fa', barColor: 'linear-gradient(90deg, #3b82f6, #60a5fa)' },
    { role: 'Driver', count: drivers.length, color: '#34d399', barColor: 'linear-gradient(90deg, #10b981, #34d399)' },
    { role: 'Loader', count: loaders.length, color: '#fbbf24', barColor: 'linear-gradient(90deg, #f59e0b, #fbbf24)' },
    { role: 'Store Manager', count: storeManagers.length, color: '#c084fc', barColor: 'linear-gradient(90deg, #a855f7, #c084fc)' },
    { role: 'Admin', count: admins.length, color: '#fb7185', barColor: 'linear-gradient(90deg, #f43f5e, #fb7185)' },
  ]

  return (
    <div className="admin-dashboard-container">
      {/* Universal Admin Dark Sidebar */}
      <AdminSidebar activeTab="dashboard" />

      {/* Main Admin Content */}
      <main className="admin-main-content">
        {/* Top Header */}
        <header className="admin-top-header">
          <div>
            <h1 className="admin-welcome-title">
              System Operations Hub
              <span className="admin-welcome-badge">Admin Tier</span>
            </h1>
            <p className="admin-subtitle">
              <span className="admin-pulse-dot" />
              Live Governance &bull; Enterprise WayFlow Fleet Network &bull; Colombo Central Node
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/admin/users" className="admin-btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              View All Users ({totalUsers})
            </Link>

            <button onClick={() => setIsAddModalOpen(true)} className="admin-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New User
            </button>
          </div>
        </header>

        {/* Top High-level Metric Cards */}
        <section className="admin-stats-grid">
          {/* Card 1: Total Users */}
          <div className="admin-stat-card" style={{ '--card-accent': '#3b82f6' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Provisioned</span>
              <div className="admin-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{totalUsers}</div>
            <div className="admin-stat-meta">
              <span className="admin-stat-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                {activeUsers} Active
              </span>
              <span>across 5 roles</span>
            </div>
          </div>

          {/* Card 2: Dispatchers */}
          <div className="admin-stat-card" style={{ '--card-accent': '#60a5fa' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Dispatchers</span>
              <div className="admin-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{dispatchers.length}</div>
            <div className="admin-stat-meta">
              <span style={{ color: '#94a3b8' }}>Route planning & fleet dispatch</span>
            </div>
          </div>

          {/* Card 3: Drivers */}
          <div className="admin-stat-card" style={{ '--card-accent': '#34d399' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Drivers</span>
              <div className="admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{drivers.length}</div>
            <div className="admin-stat-meta">
              <span className="admin-stat-pill" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                Active Telematics
              </span>
              <span>Refrigerated / Dry</span>
            </div>
          </div>

          {/* Card 4: Loaders */}
          <div className="admin-stat-card" style={{ '--card-accent': '#fbbf24' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Warehouse Loaders</span>
              <div className="admin-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{loaders.length}</div>
            <div className="admin-stat-meta">
              <span style={{ color: '#94a3b8' }}>Peliyagoda & Colombo Bays</span>
            </div>
          </div>

          {/* Card 5: Store Managers */}
          <div className="admin-stat-card" style={{ '--card-accent': '#c084fc' }}>
            <div className="admin-stat-top">
              <span className="admin-stat-label">Store Managers</span>
              <div className="admin-stat-icon-wrap" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
            </div>
            <div className="admin-stat-value">{storeManagers.length}</div>
            <div className="admin-stat-meta">
              <span style={{ color: '#94a3b8' }}>Receiving payload validation</span>
            </div>
          </div>
        </section>

        {/* Mid Section: Role Breakdown & System Health */}
        <div className="admin-content-grid">
          {/* Card 1: Role Distribution */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Role Distribution & Allocation
              </h2>
              <Link to="/admin/users" style={{ color: '#60a5fa', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}>
                Manage Role Matrix &rarr;
              </Link>
            </div>

            <div className="role-breakdown-list">
              {roleStats.map((item) => {
                const percentage = totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0
                const roleBadgeStyle = getRoleColor(item.role)
                return (
                  <div key={item.role} className="role-breakdown-item">
                    <div className="role-item-header">
                      <div className="role-item-name">
                        <span
                          className="role-badge-tag"
                          style={{
                            backgroundColor: roleBadgeStyle.bg,
                            color: roleBadgeStyle.text,
                            border: `1px solid ${roleBadgeStyle.border}`,
                          }}
                        >
                          {item.role}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                          {percentage}% of system
                        </span>
                      </div>
                      <div className="role-item-count">
                        {item.count} <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 400 }}>users</span>
                      </div>
                    </div>
                    <div className="role-progress-bar-bg">
                      <div
                        className="role-progress-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: item.barColor,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: System Health & Gateway Monitoring */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                Infrastructure & API Health
              </h2>
              <span className="admin-card-badge">99.98% Uptime</span>
            </div>

            <div>
              <div className="health-item">
                <div className="health-item-info">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div className="health-item-name">Central Operations Gateway</div>
                    <div className="health-item-desc">Core Telematics Node &bull; 24ms avg latency</div>
                  </div>
                </div>
                <span className="health-status-tag">Operational</span>
              </div>

              <div className="health-item">
                <div className="health-item-info">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div className="health-item-name">Role-Based Access Control (RBAC)</div>
                    <div className="health-item-desc">Secure Identity Engine &bull; Zero breach flags</div>
                  </div>
                </div>
                <span className="health-status-tag">Secured</span>
              </div>

              <div className="health-item">
                <div className="health-item-info">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div className="health-item-name">Fleet Telematics Sync Engine</div>
                    <div className="health-item-desc">GPS ping interval 1.5s &bull; Active route TR-024</div>
                  </div>
                </div>
                <span className="health-status-tag">Connected</span>
              </div>

              <div className="health-item">
                <div className="health-item-info">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div className="health-item-name">Barcode & Payload Auditing</div>
                    <div className="health-item-desc">Warehouse Bay camera streams connected</div>
                  </div>
                </div>
                <span className="health-status-tag">Syncing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Grid: Audit Activity & Administrative Shortcuts */}
        <div className="admin-content-grid">
          {/* Card 3: Security & Access Audit Log */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Security & Role Activity Audit
              </h2>
              <span className="admin-card-badge">Live Feed</span>
            </div>

            <div className="audit-list">
              {activity === null && <div className="audit-time">Loading activity…</div>}
              {activity?.length === 0 && <div className="audit-time">No activity recorded yet.</div>}
              {activity?.map((item, idx) => {
                const accent = ROLE_ACCENTS[item.actor_role] || ROLE_ACCENTS.System
                return (
                  <div key={idx} className="audit-item" style={{ borderLeftColor: accent }}>
                    <div className="audit-icon" style={{ background: `${accent}26`, color: accent }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {item.kind === 'account' ? (
                          <>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </>
                        ) : (
                          <>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </>
                        )}
                      </svg>
                    </div>
                    <div>
                      <div className="audit-desc">
                        {item.kind === 'account' ? (
                          <>
                            <strong>{item.actor_name}</strong> was provisioned as <em>{item.actor_role}</em>.
                          </>
                        ) : (
                          <>
                            <strong>{item.actor_name}</strong> moved <em>{item.order_id}</em> to{' '}
                            <em>{dispatchStatusOf(item.to_status).label}</em>.
                          </>
                        )}
                      </div>
                      <div className="audit-time">
                        {timeAgo(item.at)} &bull; {item.kind === 'account' ? item.note : item.actor_role}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  )
}
