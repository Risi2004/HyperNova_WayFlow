import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import StopHeaderBanner from '../../../components/driver/deliveryStop/StopHeaderBanner'
import StopOrderInfoCard from '../../../components/driver/deliveryStop/StopOrderInfoCard'
import StopInstructionsCard from '../../../components/driver/deliveryStop/StopInstructionsCard'
import StopPreChecklistCard from '../../../components/driver/deliveryStop/StopPreChecklistCard'
import OutletDetailsCard from '../../../components/driver/deliveryStop/OutletDetailsCard'
import DeliveryWindowCard from '../../../components/driver/deliveryStop/DeliveryWindowCard'
import TripContextCard from '../../../components/driver/deliveryStop/TripContextCard'
import ProofOfDeliveryCard from '../../../components/driver/deliveryStop/ProofOfDeliveryCard'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { driverActions } from '../../../services/driverData'
import { formatCountdown, formatTime, formatTimestamp } from '../../../utils/orderFormat'
import './DeliveryStop.css'

const CHECKS = [
  { id: 1, label: 'Correct outlet verified' },
  { id: 2, label: 'Delivery window checked' },
  { id: 3, label: 'Order items counted against the manifest' },
  { id: 4, label: 'Delivery instructions reviewed' },
]

export default function DeliveryStop() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data, error } = useDriverTrip(tripId)
  const [checked, setChecked] = useState([])
  const [toastMessage, setToastMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [nowMs, setNowMs] = useState(() => Date.now())

  // Ticks the window countdown.
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4500)
  }

  const trip = data?.trip
  const stops = data?.stops || []
  const stop = stops.find((s) => s.order_id === searchParams.get('order')) || currentStopOf(stops)
  const done = stops.filter((s) => DONE.includes(s.stop_status)).length
  const recorded = stop && DONE.includes(stop.stop_status)
  const onRoad = trip && ['dispatched', 'in_progress', 'completed'].includes(trip.status)
  const q = stop ? `?order=${stop.order_id}` : ''

  const handleArrive = async () => {
    setBusy(true)
    try {
      const res = await driverActions.arrive(tripId, stop.order_id)
      showToast(res.synced ? 'Arrival recorded.' : 'Arrival saved on this device — it will sync when signal returns.')
    } catch (err) {
      showToast(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleRecordDelivery = () => {
    if (!onRoad) {
      showToast('Start the trip from your dashboard first.')
      return
    }
    if (checked.length < CHECKS.length) {
      showToast('⚠️ Confirm every checklist item before recording the delivery.')
      return
    }
    navigate(`/driver/my-trips/${tripId}/record-delivery${q}`)
  }

  const windowOpen = stop && Date.parse(`${trip.delivery_date}T${String(stop.requested_window_open).slice(0, 5)}:00+05:30`)
  const windowClose = stop && Date.parse(`${trip.delivery_date}T${String(stop.requested_window_close).slice(0, 5)}:00+05:30`)
  const windowStatus = !stop
    ? ''
    : nowMs < windowOpen
      ? `Opens in ${formatCountdown(windowOpen, nowMs)}`
      : nowMs <= windowClose
        ? `Open now — closes in ${formatCountdown(windowClose, nowMs)}`
        : 'Window has closed — deliver and note the delay'

  return (
    <div className="delivery-stop-page-container">
      {/* Top Navigation */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Stop Content */}
      <main className="delivery-stop-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />
        {error && !trip && <p className="driver-page-state error">{error}</p>}
        {!trip && !error && <p className="driver-page-state">Loading stop…</p>}
        {trip && !stop && <p className="driver-page-state">Every stop on {tripId} is recorded.</p>}

        {trip && stop && (
          <>
            {/* Banner with Breadcrumb & Hero Card */}
            <StopHeaderBanner
              tripId={tripId}
              stopNumber={String(stop.stop_sequence).padStart(2, '0')}
              totalStops={String(stops.length).padStart(2, '0')}
              storeName={`Waypoint ${stop.brand} (${stop.outlet_id})`}
              deliveryWindow={`${formatTime(stop.requested_window_open)} - ${formatTime(stop.requested_window_close)}`}
              status={recorded ? `Recorded: ${stop.stop_status}${stop.pending_sync ? ' (waiting to sync)' : ''}` : stop.actual_arrival_time ? 'Arrived' : 'Pending Delivery'}
            />

            {onRoad && !recorded && !stop.actual_arrival_time && (
              <div className="driver-start-card">
                <p>At {stop.outlet_id}? Record your arrival time — it is used for lateness and service-time records.</p>
                <button type="button" className="driver-primary-btn" onClick={handleArrive} disabled={busy}>
                  I've Arrived
                </button>
              </div>
            )}

            {/* 2-Column Grid Layout */}
            <div className="delivery-stop-grid">
              {/* Left Column (Main Stop Data) */}
              <div className="stop-left-column">
                <StopOrderInfoCard
                  orderCode={stop.order_id}
                  items={stop.items.map((i) => ({ name: i.product_name, quantity: `${i.quantity} × ${i.unit}` }))}
                  totalUnits={`${stop.total_units} units • ${Math.round(stop.total_weight_kg)} kg`}
                  isRefrigerated={stop.temp_requirement === 'chilled'}
                />
                <StopInstructionsCard
                  instructions={[
                    stop.order_notes,
                    stop.shortfall_flag ? `Loaded short: ${stop.shortfall_reason}. Record a part delivery and get the store to sign for what arrived.` : null,
                    stop.parking_constraint === 'van_only' ? 'Van-only access: park in the outlet lane, not on the main road.' : null,
                    stop.mall_window ? `Mall delivery bay window ${stop.mall_window}.` : null,
                  ].filter(Boolean).join(' ') || 'Ask for the store manager before unloading.'}
                />
                {!recorded && (
                  <StopPreChecklistCard
                    checks={CHECKS.map((c) => ({ ...c, checked: checked.includes(c.id) }))}
                    onToggleCheck={(id) => setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
                  />
                )}

                {/* Bottom Actions Row */}
                <div className="stop-bottom-actions-row">
                  <button
                    type="button"
                    className="btn-record-delivery-primary"
                    onClick={handleRecordDelivery}
                    disabled={recorded}
                  >
                    {recorded ? 'Delivery Recorded ✓' : 'Record Delivery'}
                  </button>
                  {!recorded && (
                    <button
                      type="button"
                      className="btn-report-stop-problem"
                      onClick={() => navigate(`/driver/my-trips/${tripId}/report-problem${q}`)}
                    >
                      <span>Report Problem</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column (Sidebar Cards) */}
              <aside className="stop-right-column">
                <OutletDetailsCard
                  storeName={`Waypoint ${stop.brand}`}
                  storeCode={`Code: ${stop.outlet_id}`}
                  district={stop.district}
                  address={`${stop.district} District • ${stop.dock_type.replace('_', ' ')}`}
                  contactPerson={stop.manager_name || 'Store manager'}
                  role="Receiving contact"
                  phone={stop.manager_phone || '—'}
                  onOpenNavigation={() => showToast(`Navigate to ${stop.outlet_id} in ${stop.district}. Planned arrival ${formatTime(stop.planned_arrival_time)}.`)}
                />
                <DeliveryWindowCard
                  windowTime={`${formatTime(stop.requested_window_open)} - ${formatTime(stop.requested_window_close)}`}
                  statusText={stop.actual_arrival_time ? `Arrived ${String(stop.actual_arrival_time).includes('T') ? formatTimestamp(stop.actual_arrival_time).time : formatTime(stop.actual_arrival_time)} • ${windowStatus}` : windowStatus}
                />
                <TripContextCard
                  tripId={tripId}
                  route={`${trip.depot} → ${trip.district}`}
                  vehicle={trip.vehicle_id}
                  progressText={`${done} / ${stops.length} stops completed`}
                />
                {!recorded && <ProofOfDeliveryCard onContinueProof={handleRecordDelivery} />}
              </aside>
            </div>
          </>
        )}
      </main>

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="stop-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
