import { useEffect, useSyncExternalStore } from 'react'
import { authService, USER_UPDATED_EVENT } from '../services/authService'

// Re-read whenever the stored profile changes in this tab (refresh, logout) or another tab.
function subscribe(callback) {
  window.addEventListener(USER_UPDATED_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(USER_UPDATED_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

let refreshPromise = null

// The signed-in user's profile. Starts from the session stored at login, then refreshes once per
// page load from /auth/me so admin changes (outlet, vehicle, name) show without signing in again.
export function useCurrentUser() {
  const raw = useSyncExternalStore(subscribe, authService.getRawUser, () => null)

  useEffect(() => {
    if (!refreshPromise && authService.isAuthenticated()) {
      refreshPromise = authService.refreshProfile().catch(() => null)
    }
  }, [])

  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?'
}

export const firstNameOf = (name = '') => name.trim().split(/\s+/)[0] || ''

// Short location label for a user's role line, e.g. "OUT101 • Matale" or "VEH053 • Peliyagoda".
export function workplaceOf(user) {
  if (!user) return ''
  if (user.outlet) return `${user.outlet.outlet_id} • ${user.outlet.district}`
  if (user.vehicle) return `${user.vehicle.vehicle_id} • ${user.vehicle.depot}`
  return user.facility || ''
}

export function greetingFor(date = new Date()) {
  const hour = Number(date.toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', hour12: false }))
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// e.g. "Saturday, 03 October 2026" in Colombo time
export function longDateLabel(date = new Date()) {
  return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

// e.g. "Today, 03 Oct 2026" in Colombo time
export function todayLabel(date = new Date()) {
  return `Today, ${date.toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo', day: '2-digit', month: 'short', year: 'numeric' })}`
}
