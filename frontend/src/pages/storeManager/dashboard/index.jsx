import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import StoreManagerMetricsCards from '../../../components/storeManager/StoreManagerMetricsCards'
import NextDeliveryHeroCard from '../../../components/storeManager/NextDeliveryHeroCard'
import CurrentOrdersTable from '../../../components/storeManager/CurrentOrdersTable'
import ScheduledDeliveriesCard from '../../../components/storeManager/ScheduledDeliveriesCard'
import DeferredOrdersCard from '../../../components/storeManager/DeferredOrdersCard'
import RecentlyReceivedCard from '../../../components/storeManager/RecentlyReceivedCard'
import QuickActionsCard from '../../../components/storeManager/QuickActionsCard'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { orderService } from '../../../services/orderService'
import {
  DEFERRAL_REASONS,
  colomboToday,
  formatCountdown,
  formatDate,
  formatShortDate,
  formatTime,
  formatTimestamp,
  formatWindow,
} from '../../../utils/orderFormat'
import './StoreManagerDashboard.css'

const ACTIVE = ['submitted', 'confirmed', 'planned', 'loading', 'loaded', 'shortfall', 'dispatched', 'deferred']
const ON_A_RUN = ['planned', 'loading', 'loaded', 'shortfall', 'dispatched']
const CURRENT_STATUS = {
  submitted: { status: 'Pending', statusType: 'pending' },
  confirmed: { status: 'Confirmed', statusType: 'confirmed' },
  planned: { status: 'Scheduled', statusType: 'confirmed' },
  loading: { status: 'Loading', statusType: 'confirmed' },
  loaded: { status: 'Loaded', statusType: 'confirmed' },
  shortfall: { status: 'Loading', statusType: 'confirmed' },
  dispatched: { status: 'In Delivery', statusType: 'in-delivery' },
  deferred: { status: 'Deferred', statusType: 'pending' },
}

const pad2 = (n) => String(n).padStart(2, '0')
const units = (n) => `${pad2(n)} Unit${n === 1 ? '' : 's'}`
const arrivalInstant = (o) => Date.parse(`${o.target_delivery_date}T${String(o.planned_arrival_time).slice(0, 5)}:00+05:30`)

function dayWord(date, today) {
  if (date === today) return 'TODAY'
  const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)
  return date === tomorrow ? 'TOMORROW' : formatShortDate(date).toUpperCase()
}

export default function StoreManagerDashboard() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    let active = true
    orderService
      .getMyOrders()
      .then((res) => active && setOrders(res.orders))
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const today = colomboToday()
  const view = useMemo(() => {
    const list = orders || []
    const active = list.filter((o) => ACTIVE.includes(o.status))
    const scheduled = list
      .filter((o) => ON_A_RUN.includes(o.status) && o.trip_id && o.target_delivery_date >= today)
      .sort((a, b) => arrivalInstant(a) - arrivalInstant(b))
    const deferred = list.filter((o) => o.status === 'deferred')
    const received = list
      .filter((o) => o.received_at)
      .sort((a, b) => String(b.received_at).localeCompare(String(a.received_at)))
    return { active, scheduled, deferred, received, next: scheduled[0] || null }
  }, [orders, today])

  const outletLabel = user?.outlet
    ? `Waypoint ${user.outlet.brand} – ${user.outlet.district} (${user.outlet_id})`
    : user?.facility || 'Your outlet'
  const next = view.next

  return (
    <div className="sm-dashboard-container">
      {/* Left Sidebar Navigation */}
      <StoreManagerSidebar activeItem="Dashboard" />

      {/* Main Store Manager Dashboard Content */}
      <main className="sm-dashboard-main">
        {loadError && <div className="sm-dashboard-state error">Unable to load your orders: {loadError}</div>}
        {!user?.outlet_id && user && (
          <div className="sm-dashboard-state error">
            Your account is not linked to an outlet yet. Ask an administrator to assign one before ordering.
          </div>
        )}

        {/* 4 Metric Summary Cards */}
        <StoreManagerMetricsCards
          activeOrders={orders ? pad2(view.active.length) : '--'}
          scheduledDeliveries={orders ? pad2(view.scheduled.length) : '--'}
          nextEta={next ? formatTime(next.planned_arrival_time) : '--:--'}
          nextEtaSub={next ? `${dayWord(next.target_delivery_date, today) === 'TODAY' ? 'Today' : formatDate(next.target_delivery_date)} • Trip ${next.trip_id}` : 'No delivery scheduled yet'}
          deferredOrders={orders ? pad2(view.deferred.length) : '--'}
        />

        {/* Next Delivery Hero Card */}
        {next ? (
          <NextDeliveryHeroCard
            tripId={next.trip_id}
            dispatchRun={`${next.depot} run • ${formatDate(next.target_delivery_date)}`}
            orderId={next.order_id}
            destination={outletLabel}
            windowTime={formatWindow(next.requested_window_open, next.requested_window_close)}
            vehicle={`${next.vehicle_temp === 'reefer' ? 'Refrigerated' : 'Dry'} ${next.vehicle_type || 'vehicle'} (${next.vehicle_id})`}
            driverName={next.driver_name || 'Driver to be assigned'}
            expectedArrival={formatTime(next.planned_arrival_time)}
            etaMinutes={formatCountdown(arrivalInstant(next))}
            currentLocation={next.status === 'dispatched' ? 'On the road' : `Departs ${next.depot} at ${formatTime(next.planned_departure_time)}`}
            onTrackGPS={() => navigate(`/store-manager/track-delivery/${next.trip_id}`)}
            onContactDispatch={() => showToast(`Contact the ${next.depot} dispatcher about ${next.order_id}.`)}
            onViewManifest={() => navigate('/store-manager/my-orders')}
          />
        ) : (
          <div className="sm-hero-empty-card">
            <h3>No delivery scheduled yet</h3>
            <p>
              {orders && view.active.length > 0
                ? 'Your orders are with the dispatcher. The arrival time appears here once they are planned onto a vehicle.'
                : 'Place an order before the 4:00 PM cutoff and it will appear here once it is scheduled.'}
            </p>
            <button type="button" onClick={() => navigate('/store-manager/create-order')}>
              Create Order
            </button>
          </div>
        )}

        {/* Current Orders Table */}
        <CurrentOrdersTable
          totalCount={view.active.length}
          orders={view.active
            .slice()
            .sort((a, b) => String(a.target_delivery_date).localeCompare(String(b.target_delivery_date)))
            .slice(0, 5)
            .map((o) => ({
              id: o.order_id,
              date: formatTimestamp(o.submitted_at || o.created_at).date,
              items: units(o.total_units),
              deliveryDate: o.status === 'deferred' && o.next_scheduled_date
                ? `${formatDate(o.next_scheduled_date)} (moved)`
                : o.target_delivery_date === today
                  ? `Today${o.planned_arrival_time ? ` (${formatTime(o.planned_arrival_time)})` : ''}`
                  : formatDate(o.target_delivery_date),
              ...CURRENT_STATUS[o.status],
              driverName: o.driver_name,
            }))}
          onViewOrder={() => navigate('/store-manager/my-orders')}
          onAssignDriver={(ord) =>
            showToast(ord.driverName ? `${ord.id} is assigned to ${ord.driverName}.` : `${ord.id} has not been assigned to a driver yet.`)}
        />

        {/* Lower Two-Column Section */}
        <div className="sm-lower-grid">
          {/* Left Column: Scheduled Deliveries + Recently Received */}
          <div className="sm-lower-col">
            <ScheduledDeliveriesCard
              deliveries={view.scheduled.slice(0, 4).map((o, i) => ({
                id: o.order_id,
                status: o.status === 'dispatched' ? 'In Transit' : 'Scheduled',
                statusType: o.status === 'dispatched' ? 'in-transit' : 'scheduled',
                location: o.district,
                items: units(o.total_units),
                trip: `Trip ${o.trip_id}`,
                timeText: `${dayWord(o.target_delivery_date, today)} ${formatTime(o.planned_arrival_time)}`,
                subtext: o.status === 'dispatched' ? `Arrival in ${formatCountdown(arrivalInstant(o))}` : `${o.vehicle_id} • ${o.depot}`,
                highlightTime: i === 0,
              }))}
            />
            <RecentlyReceivedCard
              recentDeliveries={view.received.slice(0, 3).map((o) => {
                const at = formatTimestamp(o.received_at)
                return {
                  id: o.order_id,
                  items: units(o.total_units),
                  receivedTime: `${at.date === formatDate(today) ? 'Received Today' : at.date} • ${at.time}`,
                }
              })}
            />
          </div>

          {/* Right Column: Deferred Orders + Quick Actions */}
          <div className="sm-lower-col">
            <DeferredOrdersCard
              deferredList={view.deferred.map((o) => ({
                id: o.order_id,
                items: units(o.total_units),
                origDate: formatShortDate(o.target_delivery_date),
                newDate: o.next_scheduled_date ? formatShortDate(o.next_scheduled_date) : 'To be confirmed',
                reason: DEFERRAL_REASONS[o.deferral_reason] || o.deferral_explanation || 'Delivery capacity constraint',
              }))}
            />
            <QuickActionsCard
              storeName={outletLabel}
              operatingHours={
                user?.outlet
                  ? `${user.outlet.district} District • Served from ${user.outlet.depot}${user.outlet.mall_window ? ` • Mall window ${user.outlet.mall_window}` : ''}`
                  : 'Outlet not assigned'
              }
              onCreateOrder={() => navigate('/store-manager/create-order')}
            />
          </div>
        </div>
      </main>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="sm-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-sm-toast-close" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
