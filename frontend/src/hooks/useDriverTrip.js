import { useEffect, useState } from 'react'
import { getTrip } from '../services/driverData'
import { OUTBOX_EVENT } from '../services/offline/outbox'
import { CONNECTIVITY_EVENT } from '../services/offline/connectivity'

// A driver's trip (network or on-device copy), refreshed whenever the outbox or signal changes.
export function useDriverTrip(tripId) {
  const [state, setState] = useState({ data: null, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    window.addEventListener(OUTBOX_EVENT, bump)
    window.addEventListener(CONNECTIVITY_EVENT, bump)
    window.addEventListener('online', bump)
    return () => {
      window.removeEventListener(OUTBOX_EVENT, bump)
      window.removeEventListener(CONNECTIVITY_EVENT, bump)
      window.removeEventListener('online', bump)
    }
  }, [])

  useEffect(() => {
    if (!tripId) return
    let active = true
    getTrip(tripId)
      .then((data) => active && setState({ data, error: null }))
      .catch((err) => active && setState((s) => ({ data: s.data, error: err.message })))
    return () => {
      active = false
    }
  }, [tripId, version])

  return { ...state, reload: () => setVersion((v) => v + 1) }
}

export const DONE = ['delivered', 'partial', 'failed']
export const currentStopOf = (stops = []) => stops.find((s) => !DONE.includes(s.stop_status)) || null
