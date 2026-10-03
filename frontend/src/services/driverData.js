// Driver data that keeps working without signal.
//
// Reads go to the network when possible and are cached on the device; without a connection the
// cached copy is used. Actions are written to the outbox first (see offline/outbox.js) and the
// pending ones are overlaid on the cached trip, so the screen always shows what the driver did.

import { tripService } from './tripService'
import { kvGet, kvSet } from './offline/db'
import { discardFailed, enqueue, flush, pendingEvents } from './offline/outbox'
import { isOnline } from './offline/connectivity'

const MINE_KEY = 'trips:mine'
const tripKey = (id) => `trip:${id}`
const FAILED_CATEGORIES = ['closed', 'refused']

// Applies queued (not yet synced) actions to a trip detail.
function overlay(detail, events) {
  if (!detail) return detail
  const mine = events.filter((e) => e.tripId === detail.trip.trip_id && e.status !== 'failed')
  if (!mine.length) return { ...detail, pending: [] }
  const stops = detail.stops.map((s) => ({ ...s }))
  const trip = { ...detail.trip }
  for (const e of mine) {
    const stop = stops.find((s) => s.order_id === e.orderId)
    if (e.type === 'start' && ['loaded', 'planned', 'loading'].includes(trip.status)) trip.status = 'dispatched'
    if (e.type === 'arrive' && stop && !stop.actual_arrival_time) stop.actual_arrival_time = e.at
    if (e.type === 'deliver' && stop) {
      stop.stop_status = e.payload.outcome === 'success' ? 'delivered' : e.payload.outcome
      stop.received_by_name = e.payload.received_by_name
      stop.pending_sync = true
    }
    if (e.type === 'problem' && stop && FAILED_CATEGORIES.includes(e.payload.category)) {
      stop.stop_status = 'failed'
      stop.pending_sync = true
    }
  }
  if (stops.every((s) => ['delivered', 'partial', 'failed'].includes(s.stop_status))) trip.status = 'completed'
  return { ...detail, trip, stops, pending: mine }
}

async function cached(key) {
  const entry = await kvGet(key)
  return entry ? { data: entry.data, cachedAt: entry.cachedAt } : null
}

const store = (key, data) => kvSet(key, { data, cachedAt: new Date().toISOString() })

// Trips that matter on the road: not finished, from yesterday onwards.
const isActive = (t, today) => t.status !== 'completed' && t.delivery_date >= new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10)

export async function getMyTrips() {
  if (isOnline()) {
    try {
      const data = await tripService.myTrips()
      await store(MINE_KEY, data)
      // Keep today's trips on the device so they open without signal later (in the background).
      Promise.all(
        data.trips.filter((t) => isActive(t, data.today)).slice(0, 6).map(async (t) => {
          try {
            await store(tripKey(t.trip_id), await tripService.getTrip(t.trip_id))
          } catch {
            // best effort
          }
        })
      )
      return { ...data, fromCache: false }
    } catch (err) {
      if (err.status) throw err
    }
  }
  const hit = await cached(MINE_KEY)
  if (!hit) throw new Error('No signal and no trips saved on this device yet. Open My Trips once while connected.')
  return { ...hit.data, fromCache: true, cachedAt: hit.cachedAt }
}

export async function getTrip(tripId) {
  const events = await pendingEvents()
  if (isOnline()) {
    try {
      const data = await tripService.getTrip(tripId)
      await store(tripKey(tripId), data)
      return { ...overlay(data, events), fromCache: false }
    } catch (err) {
      if (err.status) throw err
    }
  }
  const hit = await cached(tripKey(tripId))
  if (!hit) throw new Error(`No signal and ${tripId} is not saved on this device. Open it once while connected.`)
  return { ...overlay(hit.data, events), fromCache: true, cachedAt: hit.cachedAt }
}

// Records the action on the device and tries to send it straight away.
async function act(type, args) {
  const event = await enqueue(type, args)
  if (isOnline()) await flush()
  const stillQueued = (await pendingEvents()).find((e) => e.id === event.id)
  if (stillQueued?.status === 'failed') {
    // Rejected straight away while online: the driver sees the reason and can correct it.
    await discardFailed(stillQueued.id)
    const err = new Error(stillQueued.lastError || 'The server rejected this record.')
    err.status = 400
    throw err
  }
  return { synced: !stillQueued, event }
}

export const driverActions = {
  startTrip: (tripId) => act('start', { tripId }),
  arrive: (tripId, orderId) => act('arrive', { tripId, orderId }),
  deliver: (tripId, orderId, payload) =>
    act('deliver', { tripId, orderId, payload: { ...payload, arrived_at: payload.arrived_at, completed_at: new Date().toISOString() } }),
  reportProblem: (tripId, payload) => act('problem', { tripId, orderId: payload.order_id, payload }),
}
