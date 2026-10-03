import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSubheader from '../../../components/driver/DriverSubheader'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import TodayTripCard from '../../../components/driver/TodayTripCard'
import DeliveryProgressCard from '../../../components/driver/DeliveryProgressCard'
import CurrentStopHeroCard from '../../../components/driver/CurrentStopHeroCard'
import ImportantWarningsCard from '../../../components/driver/ImportantWarningsCard'
import LiveRouteUpdatesCard from '../../../components/driver/LiveRouteUpdatesCard'
import QuickDriverActionsCard from '../../../components/driver/QuickDriverActionsCard'
import TodayStopsTimelineCard from '../../../components/driver/TodayStopsTimelineCard'
import CallDispatchModal from '../../../components/driver/CallDispatchModal'
import { useConnectivity } from '../../../hooks/useConnectivity'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { driverActions, getMyTrips } from '../../../services/driverData'
import { OUTBOX_EVENT } from '../../../services/offline/outbox'
import { formatDate, formatTime, formatTimestamp } from '../../../utils/orderFormat'
import { driverStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './DriverDashboard.css'

const ACTIVE_ORDER = ['dispatched', 'in_progress', 'loaded', 'loading', 'planned']

// The trip the driver should be working on: on the road first, then ready, then the next one.
function pickTrip(trips, today) {
  const open = trips.filter((t) => t.status !== 'completed' && t.delivery_date >= today)
  const yesterday = new Date(Date.parse(`${today}T00:00:00Z`) - 86400000).toISOString().slice(0, 10)
  // A trip left open from an earlier day is history, not the current job.
  const onRoad = trips.find((t) => ['dispatched', 'in_progress'].includes(t.status) && t.delivery_date >= yesterday)
  if (onRoad) return onRoad
  // Ready to depart beats still loading beats not yet loaded; then the earliest run.
  return open.sort((a, b) => ACTIVE_ORDER.indexOf(a.status) - ACTIVE_ORDER.indexOf(b.status) || a.delivery_date.localeCompare(b.delivery_date) || a.trip_number - b.trip_number)[0] || null
}

export default function DriverDashboard() {
  const navigate = useNavigate()
  const { online, simulated, setNoSignal } = useConnectivity()
  const [mine, setMine] = useState(null)
  const [mineError, setMineError] = useState(null)
  const [toastMessage, setToastMessage] = useState('')
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    window.addEventListener(OUTBOX_EVENT, bump)
    window.addEventListener('online', bump)
    return () => {
      window.removeEventListener(OUTBOX_EVENT, bump)
      window.removeEventListener('online', bump)
    }
  }, [])

  useEffect(() => {
    let active = true
    getMyTrips()
      .then((res) => active && setMine(res))
      .catch((err) => active && setMineError(err.message))
    return () => {
      active = false
    }
  }, [version, online])

  const tripSummary = mine ? pickTrip(mine.trips, mine.today) : null
  const { data, error } = useDriverTrip(tripSummary?.trip_id)

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4500)
  }

  const trip = data?.trip
  const stops = data?.stops || []
  const current = currentStopOf(stops)
  const done = stops.filter((s) => DONE.includes(s.stop_status)).length
  const onRoad = trip && ['dispatched', 'in_progress'].includes(trip.status)

  const handleStart = async () => {
    setBusy(true)
    try {
      const res = await driverActions.startTrip(trip.trip_id)
      triggerToast(res.synced ? 'Trip started. Safe driving!' : 'Trip start saved on this device — it will sync when signal returns.')
    } catch (err) {
      triggerToast(err.message)
    } finally {
      setBusy(false)
    }
  }

  const stopLink = (s) => `/driver/my-trips/${trip.trip_id}/delivery-stop?order=${s.order_id}`

  const warnings = []
  if (trip) {
    const chilled = stops.filter((s) => s.temp_requirement === 'chilled' && !DONE.includes(s.stop_status)).length
    const shorts = stops.filter((s) => s.shortfall_flag).length
    const tight = stops.filter((s) => !DONE.includes(s.stop_status) && String(s.planned_arrival_time) >= String(s.requested_window_close).slice(0, 5)).length
    if (shorts) warnings.push({ id: 'short', type: 'amber', text: `${shorts} order${shorts === 1 ? ' was' : 's were'} loaded short — the store knows; record a part delivery.` })
    if (chilled) warnings.push({ id: 'cold', type: 'blue', text: `${chilled} chilled stop${chilled === 1 ? '' : 's'} — keep the reefer closed between stops.` })
    if (tight) warnings.push({ id: 'tight', type: 'amber', text: `${tight} stop${tight === 1 ? ' is' : 's are'} planned close to the window closing time.` })
    if (!warnings.length) warnings.push({ id: 'ok', type: 'blue', text: 'No special handling on this trip.' })
  }

  const updates = [
    ...(data?.pending || []).slice(-2).map((e) => ({ id: e.id, color: 'orange', text: `${e.type === 'deliver' ? 'Delivery' : e.type === 'problem' ? 'Problem report' : e.type === 'start' ? 'Trip start' : 'Arrival'} for ${e.orderId || e.tripId} waiting to sync` })),
    ...(data?.trip?.dispatched_at ? [{ id: 'dep', color: 'blue', text: `Departed ${formatTimestamp(data.trip.dispatched_at).time}` }] : []),
    { id: 'sig', color: online ? 'green' : 'orange', text: online ? 'Connected — records sync immediately' : 'No signal — records are kept on this device' },
  ]

  return (
    <div className="driver-dashboard-container">
      {/* Top Navbar */}
      <DriverNavbar activeTab="Dashboard" />

      {/* Main Content Area */}
      <main className="driver-dashboard-main">
        {/* Subheader: Greeting, Online Badge, Notification Bell */}
        <DriverSubheader isOnline={online} onNotificationClick={() => triggerToast(online ? 'No new messages from dispatch.' : 'No signal — messages arrive when you reconnect.')} />

        <DriverSyncBanner cachedAt={data?.fromCache ? data.cachedAt : null} />

        {toastMessage && (
          <div className="driver-toast-banner" role="status">
            <span>{toastMessage}</span>
          </div>
        )}

        {(mineError || error) && <p className="driver-page-state error">{mineError || error}</p>}
        {mine && !tripSummary && <p className="driver-page-state">No trips assigned to you yet. Published trips for your vehicle appear here.</p>}

        {trip && (
          <>
            {['planned', 'loading', 'loaded'].includes(trip.status) && (
              <div className="driver-start-card">
                <p>
                  {trip.status === 'loaded'
                    ? `Loading is complete for ${trip.vehicle_id}. Start the trip when you leave the depot.`
                    : `${trip.vehicle_id} is ${trip.status === 'loading' ? 'being loaded' : 'waiting for the loader'} — departure ${formatTime(trip.planned_departure_time)} on ${formatDate(trip.delivery_date)}.`}
                </p>
                <button type="button" className="driver-primary-btn" disabled={busy || trip.status !== 'loaded'} onClick={handleStart}>
                  Start Trip
                </button>
              </div>
            )}

            {/* Two-Column Grid */}
            <div className="driver-dashboard-grid">
              <div className="driver-left-column">
                <div className="driver-top-two-cards">
                  <TodayTripCard
                    tripId={trip.trip_id}
                    vehicle={`${trip.vehicle_id} (${vehicleTypeLabel(trip)})`}
                    route={`${trip.depot} → ${trip.district}`}
                    departureTime={formatTime(trip.planned_departure_time)}
                    status={driverStatusOf(trip)}
                    onContinueTrip={() => navigate(`/driver/my-trips/${trip.trip_id}`)}
                  />
                  <DeliveryProgressCard
                    completedStops={done}
                    totalStops={stops.length}
                    currentStopNumber={current ? String(current.stop_sequence).padStart(2, '0') : '—'}
                  />
                </div>

                {current ? (
                  <CurrentStopHeroCard
                    stopNumber={String(current.stop_sequence).padStart(2, '0')}
                    totalStops={String(stops.length).padStart(2, '0')}
                    storeName={`Waypoint ${current.brand} — ${current.district}`}
                    orderId={`${current.outlet_id} • ${current.order_id}`}
                    address={`${current.district} District • ${current.dock_type.replace('_', ' ')} unloading${current.parking_constraint === 'van_only' ? ' • van access only' : ''}`}
                    deliveryWindow={`${formatTime(current.requested_window_open)} - ${formatTime(current.requested_window_close)}`}
                    expectedArrival={`${formatTime(current.planned_arrival_time)} (planned)`}
                    instructions={current.order_notes || `Ask for ${current.manager_name || 'the store manager'} on arrival${current.temp_requirement === 'chilled' ? '; chilled goods go straight to cold storage' : ''}.`}
                    onStartChecklist={() => (onRoad ? navigate(stopLink(current)) : triggerToast('Start the trip first.'))}
                    onViewRouteMap={() => navigate(`/driver/my-trips/${trip.trip_id}`)}
                    onNextStop={() => {
                      const next = stops.find((s) => s.stop_sequence > current.stop_sequence && !DONE.includes(s.stop_status))
                      triggerToast(next ? `After this: stop ${next.stop_sequence}, ${next.outlet_id} (${next.district}) at ${formatTime(next.planned_arrival_time)}.` : 'This is the last stop on the trip.')
                    }}
                  />
                ) : (
                  <p className="driver-page-state">All stops on {trip.trip_id} are recorded. Head back to the {trip.depot} depot.</p>
                )}

                <ImportantWarningsCard warnings={warnings} />

                <div className="driver-bottom-two-cards">
                  <LiveRouteUpdatesCard updates={updates} />
                  <QuickDriverActionsCard
                    onReportProblem={() => navigate(`/driver/my-trips/${trip.trip_id}/report-problem${current ? `?order=${current.order_id}` : ''}`)}
                    onCallDispatch={() => setShowDispatchModal(true)}
                    onViewHistory={() => navigate('/driver/my-trips')}
                    onToggleOffline={() => setNoSignal(!simulated)}
                    isOffline={!online}
                  />
                </div>
              </div>

              <div className="driver-right-column">
                <TodayStopsTimelineCard
                  stops={stops.map((s) => ({
                    id: s.order_id,
                    stopNumber: String(s.stop_sequence).padStart(2, '0'),
                    name: `${s.outlet_id} • Waypoint ${s.brand}`,
                    location: s.district,
                    time: formatTime(s.planned_arrival_time),
                    status: DONE.includes(s.stop_status) ? 'completed' : current?.order_id === s.order_id ? 'current' : 'upcoming',
                  }))}
                  onSelectStop={(s) => onRoad && navigate(stopLink(stops.find((x) => x.order_id === s.id)))}
                />
              </div>
            </div>
          </>
        )}
      </main>

      <CallDispatchModal isOpen={showDispatchModal} onClose={() => setShowDispatchModal(false)} depot={trip?.depot} />
    </div>
  )
}
