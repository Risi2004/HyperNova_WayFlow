// Outbox: every driver action is stored on the device first, then sent in the order it happened.
//
// - Each event has a unique id sent as client_event_id; the server ignores repeats, so retrying
//   after a dropped connection can never record a delivery twice.
// - Timestamps are taken on the device when the driver acts, not when the record syncs.
// - Network failures leave events queued; a rejected event (4xx) is kept as 'failed' with the
//   server's reason so the driver can see it instead of losing it silently.

import { outboxAll, outboxDelete, outboxPut } from './db'
import { isOnline, onConnectivityChange } from './connectivity'
import { tripService } from '../tripService'

export const OUTBOX_EVENT = 'wayflow-outbox'
const LAST_SYNC_KEY = 'wayflow_last_sync'

let flushing = null
let seq = Date.now()

const notify = () => window.dispatchEvent(new Event(OUTBOX_EVENT))

function uuid() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function lastSyncAt() {
  try {
    return localStorage.getItem(LAST_SYNC_KEY)
  } catch {
    return null
  }
}

const SENDERS = {
  start: (e) => tripService.startTrip(e.tripId, e.at),
  arrive: (e) => tripService.arrive(e.tripId, e.orderId, e.at),
  deliver: (e) => tripService.deliver(e.tripId, e.orderId, { ...e.payload, client_event_id: e.id, recorded_offline: e.recordedOffline }),
  problem: (e) => tripService.reportProblem(e.tripId, { ...e.payload, client_event_id: e.id, occurred_at: e.at, recorded_offline: e.recordedOffline }),
}

// Records an action. Returns the stored event.
export async function enqueue(type, { tripId, orderId = null, payload = {} }) {
  const event = {
    id: uuid(),
    seq: seq++,
    type,
    tripId,
    orderId,
    payload,
    at: new Date().toISOString(),
    recordedOffline: !isOnline(),
    status: 'pending',
    attempts: 0,
    lastError: null,
  }
  await outboxPut(event)
  notify()
  return event
}

export async function pendingEvents() {
  return outboxAll()
}

// Sends queued events in order. Safe to call any time; concurrent calls share one run.
export function flush() {
  if (flushing) return flushing
  flushing = (async () => {
    let sent = 0
    try {
      for (const event of await outboxAll()) {
        if (!isOnline()) break
        if (event.status === 'failed') continue
        try {
          await SENDERS[event.type](event)
          await outboxDelete(event.id)
          sent++
        } catch (err) {
          if (!err.status || err.status >= 500) {
            await outboxPut({ ...event, attempts: event.attempts + 1, lastError: err.message })
            break // offline or server down: keep order, retry later
          }
          await outboxPut({ ...event, status: 'failed', attempts: event.attempts + 1, lastError: err.message })
        }
      }
      if (sent) {
        try {
          localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
        } catch {
          // ignore
        }
      }
    } finally {
      flushing = null
      notify()
    }
    return sent
  })()
  return flushing
}

export async function discardFailed(id) {
  await outboxDelete(id)
  notify()
}

// Background sync: when the connection returns, every 20 s, and when the tab regains focus.
let started = false
export function startBackgroundSync() {
  if (started) return
  started = true
  onConnectivityChange(() => isOnline() && flush())
  window.addEventListener('focus', () => isOnline() && flush())
  setInterval(() => isOnline() && flush(), 20000)
  if (isOnline()) flush()
}
