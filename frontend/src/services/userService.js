import { authService } from './authService'
import { API_BASE } from './apiConfig'

function getHeaders() {
  const token = authService.getToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export const userService = {
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users')
    return data.users || []
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to create user')
    return data
  },

  async updateUser(userId, userData) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to update user')
    return data
  },

  async deleteUser(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to delete user')
    return data
  },

  async getOutlets() {
    const res = await fetch(`${API_BASE}/reference/outlets`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch outlets')
    return data.outlets || []
  },

  async getVehicles() {
    const res = await fetch(`${API_BASE}/reference/vehicles`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch vehicles')
    return data.vehicles || []
  },
}
