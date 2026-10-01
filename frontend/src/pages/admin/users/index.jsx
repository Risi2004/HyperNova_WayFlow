import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import AddUserModal from '../../../components/admin/AddUserModal'
import EditUserModal from '../../../components/admin/EditUserModal'
import DeleteUserModal from '../../../components/admin/DeleteUserModal'
import { userService } from '../../../services/userService'
import {
  getStoredUsers,
  saveStoredUsers,
  getRoleColor,
  getStatusColor,
} from '../../../services/adminUserData'
import './AdminUsers.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [loading, setLoading] = useState(false)

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const dbUsers = await userService.getUsers()
      if (dbUsers && dbUsers.length > 0) {
        setUsers(dbUsers)
        saveStoredUsers(dbUsers)
      } else {
        const fallback = getStoredUsers()
        setUsers(fallback)
      }
    } catch (err) {
      console.warn('Backend users not available, using cached:', err.message)
      setUsers(getStoredUsers())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 4500)
  }

  // Add new user
  const handleAddUser = (newUser, emailDispatch) => {
    setUsers((prev) => [newUser, ...prev])
    setIsAddModalOpen(false)
    const emailNotice = emailDispatch?.mode === 'simulated'
      ? ` (Welcome email logged to server console)`
      : ` (Welcome email sent to ${newUser.email})`
    showToast(`✔ Successfully provisioned ${newUser.role} account for ${newUser.name}${emailNotice}`)
    fetchUsers()
  }

  // Update existing user
  const handleSaveEdit = async (updatedUser) => {
    try {
      await userService.updateUser(updatedUser.id, updatedUser)
    } catch (err) {
      console.warn('API update failed, updating local state:', err.message)
    }
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    setUsers(updated)
    saveStoredUsers(updated)
    setEditingUser(null)
    showToast(`Updated profile & role for ${updatedUser.name}`)
  }

  // Remove / Delete user
  const handleConfirmDelete = async (userId) => {
    const target = users.find((u) => u.id === userId)
    try {
      await userService.deleteUser(userId)
    } catch (err) {
      console.warn('API delete failed, updating local state:', err.message)
    }
    const updated = users.filter((u) => u.id !== userId)
    setUsers(updated)
    saveStoredUsers(updated)
    setDeletingUser(null)
    showToast(`User ${target?.name || 'account'} has been removed from the system`)
  }

  // Quick toggle status (Active <-> Inactive)
  const handleToggleStatus = async (userId) => {
    const target = users.find((u) => u.id === userId)
    const nextStatus = target?.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await userService.updateUser(userId, { status: nextStatus })
    } catch (err) {
      console.warn('API status toggle failed:', err.message)
    }
    const updated = users.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    setUsers(updated)
    saveStoredUsers(updated)
    showToast(`${target?.name} status updated to ${nextStatus}`)
  }

  // Filtering users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Role filter
      if (selectedRole !== 'All' && user.role !== selectedRole) {
        return false
      }
      // Status filter
      if (selectedStatus !== 'All' && user.status !== selectedStatus) {
        return false
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchName = user.name?.toLowerCase().includes(term)
        const matchEmail = user.email?.toLowerCase().includes(term)
        const matchFacility = user.facility?.toLowerCase().includes(term)
        const matchRole = user.role?.toLowerCase().includes(term)
        const matchPhone = user.phone?.toLowerCase().includes(term)
        return matchName || matchEmail || matchFacility || matchRole || matchPhone
      }
      return true
    })
  }, [users, selectedRole, selectedStatus, searchTerm])

  const rolesList = ['All', 'Dispatcher', 'Driver', 'Loader', 'Store Manager', 'Admin']

  return (
    <div className="admin-users-container">
      {/* Universal Admin Dark Sidebar */}
      <AdminSidebar activeTab="users" />

      {/* Main Content Area */}
      <main className="admin-users-content">
        {/* Header */}
        <header className="admin-users-header">
          <div>
            <h1 className="admin-users-title">
              User Directory & Roles
            </h1>
            <p className="admin-users-subtitle">
              Manage accounts, assign roles, and administer permissions across WayFlow operational nodes.
            </p>
          </div>

          <button onClick={() => setIsAddModalOpen(true)} className="admin-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New User
          </button>
        </header>

        {/* Action Toast Notification */}
        {toastMessage && (
          <div className="admin-toast-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#34d399',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Search & Filters Toolbar */}
        <div className="admin-users-toolbar">
          <div className="admin-search-row">
            {/* Search Input */}
            <div className="admin-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search users by name, corporate email, role, or facility depot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>

            {/* Status Dropdown Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-select-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Role Filter Pills */}
          <div className="admin-role-pills">
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>
              FILTER ROLE:
            </span>
            {rolesList.map((r) => {
              const count = r === 'All' ? users.length : users.filter((u) => u.role === r).length
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`role-pill-btn ${selectedRole === r ? 'active' : ''}`}
                >
                  <span>{r}</span>
                  <span className="role-pill-badge">{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-table-card">
          <div className="admin-table-responsive">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>User Identity</th>
                  <th>Operational Role</th>
                  <th>Assigned Facility / Depot</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </div>
                        <h3 style={{ margin: '0 0 6px', color: '#f1f5f9', fontSize: '1.1rem' }}>No users match your criteria</h3>
                        <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: '#64748b' }}>
                          Try adjusting your search query, clearing filters, or adding a new team member.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('')
                            setSelectedRole('All')
                            setSelectedStatus('All')
                          }}
                          className="admin-btn-secondary"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const roleColor = getRoleColor(user.role)
                    const statusColor = getStatusColor(user.status)

                    return (
                      <tr key={user.id}>
                        {/* User Identity */}
                        <td>
                          <div className="user-identity-cell">
                            <div
                              className="user-avatar-circle"
                              style={{
                                border: `2px solid ${roleColor.border}`,
                                color: roleColor.text,
                              }}
                            >
                              {user.avatar || 'US'}
                            </div>
                            <div>
                              <div className="user-name-text">{user.name}</div>
                              <div className="user-email-text">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td>
                          <span
                            className="role-table-badge"
                            style={{
                              backgroundColor: roleColor.bg,
                              color: roleColor.text,
                              border: `1px solid ${roleColor.border}`,
                            }}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Facility */}
                        <td>
                          <span style={{ color: '#e2e8f0', fontSize: '0.86rem' }}>
                            {user.facility || 'Unassigned Depot'}
                          </span>
                        </td>

                        {/* Contact */}
                        <td>
                          <span style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                            {user.phone || '+94 77 000 0000'}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className="status-table-pill"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            <span
                              className="status-dot"
                              style={{ backgroundColor: statusColor.dot }}
                            />
                            {user.status}
                          </span>
                        </td>

                        {/* Last Active */}
                        <td>
                          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                            {user.lastActive || 'Recently'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div className="user-actions-group" style={{ justifyContent: 'flex-end' }}>
                            {/* Toggle status */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(user.id)}
                              className="action-icon-btn"
                              title={user.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>

                            {/* Edit User */}
                            <button
                              type="button"
                              onClick={() => setEditingUser(user)}
                              className="action-icon-btn"
                              title="Edit User Profile & Role"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>

                            {/* Delete User */}
                            <button
                              type="button"
                              onClick={() => setDeletingUser(user)}
                              className="action-icon-btn danger"
                              title="Delete / Remove User"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="admin-table-footer">
            <div>
              Showing <strong style={{ color: '#f8fafc' }}>{filteredUsers.length}</strong> of{' '}
              <strong style={{ color: '#f8fafc' }}>{users.length}</strong> registered system users
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>WayFlow Enterprise RBAC Node</span>
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

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={Boolean(editingUser)}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSaveUser={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={Boolean(deletingUser)}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
