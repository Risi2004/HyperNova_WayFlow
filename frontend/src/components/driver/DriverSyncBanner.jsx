import { useConnectivity } from '../../hooks/useConnectivity'
import { formatTimestamp } from '../../utils/orderFormat'
import { discardFailed } from '../../services/offline/outbox'
import './DriverSyncBanner.css'

const LABELS = { start: 'Trip start', arrive: 'Arrival', deliver: 'Delivery', problem: 'Problem report' }

// Degradation screen for drivers: shows when there is no signal, what is waiting to sync,
// and anything the server rejected — so nothing recorded on the road is lost silently.
export default function DriverSyncBanner({ compact = false, cachedAt = null }) {
  const { online, simulated, pending, failed, syncedAt, setNoSignal, syncNow } = useConnectivity()

  const tone = !online ? 'offline' : failed.length ? 'failed' : pending.length ? 'pending' : 'online'
  if (compact && tone === 'online') return null

  const last = syncedAt ? formatTimestamp(syncedAt) : null
  const cached = cachedAt ? formatTimestamp(cachedAt) : null

  return (
    <section className={`driver-sync-banner tone-${tone}`} aria-live="polite">
      <div className="sync-banner-main">
        <span className="sync-dot" aria-hidden="true" />
        <div className="sync-text">
          <strong>
            {tone === 'offline' && (simulated ? 'No signal mode — working on this device' : 'No signal — working on this device')}
            {tone === 'pending' && `Syncing ${pending.length} record${pending.length === 1 ? '' : 's'}…`}
            {tone === 'failed' && `${failed.length} record${failed.length === 1 ? '' : 's'} need attention`}
            {tone === 'online' && 'Online — everything is synced'}
          </strong>
          <span>
            {tone === 'offline'
              ? `${pending.length} record${pending.length === 1 ? '' : 's'} saved on the device will send automatically when signal returns.${cached ? ` Trip data from ${cached.time}.` : ''}`
              : last
                ? `Last synced ${last.time}, ${last.date}`
                : 'Deliveries, photos and problems are saved on the device first, then synced.'}
          </span>
        </div>
      </div>

      <div className="sync-banner-actions">
        {online && pending.length > 0 && (
          <button type="button" className="sync-btn" onClick={syncNow}>
            Sync now
          </button>
        )}
        <label className="sync-toggle">
          <input type="checkbox" checked={simulated} onChange={(e) => setNoSignal(e.target.checked)} />
          <span>No signal mode</span>
        </label>
      </div>

      {!compact && pending.length > 0 && (
        <ul className="sync-queue">
          {pending.map((e) => (
            <li key={e.id}>
              {LABELS[e.type]} • {e.orderId || e.tripId} • {formatTimestamp(e.at).time}
              {e.lastError ? ` • retrying (${e.lastError})` : ''}
            </li>
          ))}
        </ul>
      )}
      {failed.length > 0 && (
        <ul className="sync-queue sync-failed">
          {failed.map((e) => (
            <li key={e.id}>
              {LABELS[e.type]} for {e.orderId || e.tripId} was rejected: {e.lastError}{' '}
              <button type="button" className="sync-link" onClick={() => discardFailed(e.id)}>
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
