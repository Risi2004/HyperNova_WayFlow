import { useEffect, useState } from 'react'
import { isOnline, isSimulatedOffline, onConnectivityChange, setSimulatedOffline } from '../services/offline/connectivity'
import { OUTBOX_EVENT, flush, lastSyncAt, pendingEvents, startBackgroundSync } from '../services/offline/outbox'

// Live connectivity + sync state for the driver screens.
export function useConnectivity() {
  const [online, setOnline] = useState(isOnline())
  const [simulated, setSimulated] = useState(isSimulatedOffline())
  const [events, setEvents] = useState([])
  const [syncedAt, setSyncedAt] = useState(lastSyncAt())

  useEffect(() => {
    startBackgroundSync()
    let active = true
    const refresh = () => {
      setOnline(isOnline())
      setSimulated(isSimulatedOffline())
      setSyncedAt(lastSyncAt())
      pendingEvents().then((list) => active && setEvents(list))
    }
    refresh()
    const offConn = onConnectivityChange(refresh)
    window.addEventListener(OUTBOX_EVENT, refresh)
    return () => {
      active = false
      offConn()
      window.removeEventListener(OUTBOX_EVENT, refresh)
    }
  }, [])

  return {
    online,
    simulated,
    pending: events.filter((e) => e.status !== 'failed'),
    failed: events.filter((e) => e.status === 'failed'),
    syncedAt,
    setNoSignal: (on) => {
      setSimulatedOffline(on)
      if (!on) flush()
    },
    syncNow: () => flush(),
  }
}
