import { API_BASE } from './apiConfig'
import { authService } from './authService'
import { isSimulatedOffline } from './offline/connectivity'

// Error carrying the HTTP status and any extra fields the API returned
// (e.g. next_available_date when an order misses the cutoff).
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.status = status
    this.data = data || {}
  }
}

// Authenticated JSON request against the WayFlow API.
export async function apiRequest(path, { method = 'GET', body, query } = {}) {
  const params = new URLSearchParams()
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value)
  })
  const url = `${API_BASE}${path}${params.toString() ? `?${params}` : ''}`

  // "No signal" mode behaves exactly like a lost connection.
  if (isSimulatedOffline()) {
    throw new ApiError('No signal — working offline. Changes are saved on this device and sync when you reconnect.', 0)
  }

  let res
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Cannot reach the WayFlow server. Check your connection and try again.', 0)
  }

  const data = await res.json().catch(() => ({}))

  if (res.status === 401) {
    authService.logout()
    window.location.assign('/login')
    throw new ApiError(data.error || 'Your session has expired. Please sign in again.', 401, data)
  }
  if (!res.ok) {
    throw new ApiError(data.error || `Request failed (${res.status}).`, res.status, data)
  }
  return data
}
