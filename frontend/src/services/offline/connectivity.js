// Connectivity as the app sees it: the browser's network state, or a simulated loss of signal
// (drivers can switch to "No signal" to work from the device only, and judges can demo it).

export const CONNECTIVITY_EVENT = 'wayflow-connectivity'
const SIMULATE_KEY = 'wayflow_simulate_offline'

export function isSimulatedOffline() {
  try {
    return localStorage.getItem(SIMULATE_KEY) === '1'
  } catch {
    return false
  }
}

export function setSimulatedOffline(on) {
  try {
    if (on) localStorage.setItem(SIMULATE_KEY, '1')
    else localStorage.removeItem(SIMULATE_KEY)
  } catch {
    // storage unavailable: nothing to persist
  }
  window.dispatchEvent(new Event(CONNECTIVITY_EVENT))
}

export const isOnline = () => (typeof navigator === 'undefined' || navigator.onLine) && !isSimulatedOffline()

export function onConnectivityChange(callback) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  window.addEventListener(CONNECTIVITY_EVENT, callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
    window.removeEventListener(CONNECTIVITY_EVENT, callback)
  }
}
