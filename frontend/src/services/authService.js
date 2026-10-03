import { API_BASE } from './apiConfig'

const TOKEN_KEY = 'wayflow_auth_token'
const USER_KEY = 'wayflow_auth_user'

// Fired whenever the stored user profile changes in this tab (login, refresh, logout).
export const USER_UPDATED_EVENT = 'wayflow-user-updated'

function storeUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event(USER_UPDATED_EVENT))
}

export const authService = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    let data
    try {
      data = await res.json()
    } catch {
      throw new Error(`Server returned status ${res.status}. If Render is waking up from sleep, please wait ~30 seconds and try again.`)
    }

    if (!res.ok) {
      throw new Error(data.error || 'Failed to authenticate. Please check your credentials.')
    }

    localStorage.setItem(TOKEN_KEY, data.token)
    storeUser(data.user)
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
      storeUser(currentUser)
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
      window.dispatchEvent(new Event(USER_UPDATED_EVENT))
    } catch (e) {
      console.error('Error during logout:', e)
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Raw stored JSON (a stable string, so React can compare snapshots cheaply).
  getRawUser() {
    return localStorage.getItem(USER_KEY)
  },

  // Re-fetches the signed-in user's profile (name, outlet, vehicle) from the server.
  async refreshProfile() {
    const token = this.getToken()
    if (!token) return null
    const res = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return null
    const profile = await res.json()
    storeUser(profile)
    return profile
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
