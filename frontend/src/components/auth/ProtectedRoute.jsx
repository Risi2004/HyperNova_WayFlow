import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import ChangePasswordModal from './ChangePasswordModal'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const isAuth = authService.isAuthenticated()
  const user = authService.getCurrentUser()
  const [showPwdModal, setShowPwdModal] = useState(user?.requires_password_change || false)

  if (!isAuth || !user) {
    return <Navigate to="/login" replace />
  }

  // If specific roles are specified, check permissions (Admin always has access)
  if (allowedRoles.length > 0) {
    const userRole = user.role
    const hasPermission = userRole === 'Admin' || allowedRoles.includes(userRole)
    if (!hasPermission) {
      const redirectPath = authService.getRoleDashboardPath(userRole)
      return <Navigate to={redirectPath} replace />
    }
  }

  return (
    <>
      {showPwdModal && (
        <ChangePasswordModal
          isOpen={true}
          user={user}
          onSuccess={() => {
            setShowPwdModal(false)
            // Reload user state
            const updated = authService.getCurrentUser()
            if (updated) {
              updated.requires_password_change = false
              localStorage.setItem('wayflow_auth_user', JSON.stringify(updated))
            }
          }}
        />
      )}
      {children}
    </>
  )
}
