import { API_BASE } from './apiConfig'

const TOKEN_KEY = 'wayflow_auth_token'
const USER_KEY = 'wayflow_auth_user'

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to authenticate. Please check your credentials.')
    }

    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data
  },

  async changePassword(oldPassword, newPassword) {
    const token = this.getToken()
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password.')
    }

    // Update stored user requires_password_change flag
    const currentUser = this.getCurrentUser()
    if (currentUser) {
      currentUser.requires_password_change = false
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
    }

    return data
  },

  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      sessionStorage.clear()
      // Dispatch custom event so any active listeners or auth states reset immediately
      window.dispatchEvent(new Event('wayflow-logout'))
    } catch (e) {
      console.error('Error during logout:', e)
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  getRoleDashboardPath(role) {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard'
      case 'Dispatcher':
        return '/dispatcher/dashboard'
      case 'Store Manager':
        return '/store-manager/dashboard'
      case 'Loader':
        return '/loader/dashboard'
      case 'Driver':
        return '/driver/dashboard'
      default:
        return '/'
    }
  },
}
