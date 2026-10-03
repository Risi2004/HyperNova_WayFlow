import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import OrderPicker from '../../../components/storeManager/OrderPicker'
import TrackDeliveryHeroCard from '../../../components/storeManager/trackDelivery/TrackDeliveryHeroCard'
import LifecycleSequenceCard from '../../../components/storeManager/trackDelivery/LifecycleSequenceCard'
import RouteStopManifestCard from '../../../components/storeManager/trackDelivery/RouteStopManifestCard'
import DockGateActionsCard from '../../../components/storeManager/trackDelivery/DockGateActionsCard'
import AssignedDriverCard from '../../../components/storeManager/trackDelivery/AssignedDriverCard'
import DeliverySlaCard from '../../../components/storeManager/trackDelivery/DeliverySlaCard'
import PayloadBreakdownCard from '../../../components/storeManager/trackDelivery/PayloadBreakdownCard'
import ManifestModal from '../../../components/storeManager/trackDelivery/ManifestModal'
import { orderService } from '../../../services/orderService'
import { dispatchStatusOf } from '../../../utils/orderFormat'
import './TrackDelivery.css'

// Orders worth tracking, most urgent first: on the road, being loaded, planned, then awaiting sign-off.
const TRACK_ORDER = ['dispatched', 'loaded', 'shortfall', 'loading', 'planned', 'delivered', 'partial']
const REFRESH_MS = 60000

function pickOrder(orders, tripId) {
  if (tripId) return orders.find((o) => o.trip_id === tripId) || null
  return [...orders]
    .filter((o) => TRACK_ORDER.includes(o.status))
    .sort((a, b) => TRACK_ORDER.indexOf(a.status) - TRACK_ORDER.indexOf(b.status) || a.target_delivery_date.localeCompare(b.target_delivery_date))[0] || null
}

export default function TrackDelivery() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const requestedOrder = searchParams.get('orderId')

  const [orders, setOrders] = useState(null)
  const [detail, setDetail] = useState(null)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)
  const [isManifestOpen, setIsManifestOpen] = useState(false)

  // Re-read while the page is open so arrival and sign-off show without a reload.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let active = true
    orderService
      .getMyOrders()
      .then(async (res) => {
        const chosen = requestedOrder || pickOrder(res.orders, tripId)?.order_id
        const full = chosen ? await orderService.getOrder(chosen) : null
        if (!active) return
        setOrders(res.orders)
        setDetail(full)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [requestedOrder, tripId, tick])

  const order = detail?.order
  const plan = detail?.plan
  const others = (orders || []).filter((o) => TRACK_ORDER.includes(o.status) && o.order_id !== order?.order_id)

  let body
  if (error) {
    body = <p className="sm-page-state error">{error}</p>
  } else if (!orders) {
    body = <p className="sm-page-state">Loading deliveries…</p>
  } else if (!order) {
    body = (
      <OrderPicker
        title="Track Delivery"
        hint={tripId ? `None of your orders are on trip ${tripId}.` : 'Nothing is on the way to your store right now.'}
        orders={others}
        path="/store-manager/track-delivery"
        emptyText="Orders appear here once dispatch publishes the delivery plan."
      />
    )
  } else {
    const progress = detail.trip_progress
    const mine = progress.find((s) => s.is_this_order)
    const outletName = `Waypoint ${detail.outlet.brand} – ${detail.outlet.district}`
    body = (
      <>
        <div className="td-order-header-strip">
          <div className="td-order-header-left">
            <span>Order:</span>
            <span className="td-order-code-bold">{order.order_id}</span>
            <span>&bull; Destination:</span>
            <span className="td-dest-name-bold">{outletName}</span>
            <span className="td-dest-pill">{order.outlet_id}</span>
          </div>
          <div className="td-order-header-right">
            <span className="td-in-delivery-pill">
              <span className="td-status-indicator-dot" />
              <span>{dispatchStatusOf(order.status).label.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {!plan && (
          <p className="sm-page-state">
            {order.status === 'deferred'
              ? `Deferred: ${order.deferral_explanation || order.deferral_reason}. Next attempt ${order.next_scheduled_date || 'to be planned'}.`
              : 'This order is not on a published trip yet. Dispatch plans deliveries after the 4 PM cutoff.'}
          </p>
        )}

        {plan && (
          <>
            <TrackDeliveryHeroCard order={order} plan={plan} trip={detail.trip} progress={progress} mine={mine} delivery={detail.delivery} outletName={outletName} />
            <LifecycleSequenceCard events={detail.events} status={order.status} depot={order.depot} />
          </>
        )}

        <div className="td-main-cols-layout">
          <div className="td-left-col">
            {plan && <RouteStopManifestCard stops={progress} tripId={plan.trip_id} vehicleId={plan.vehicle_id} outletName={outletName} />}
            {others.length > 0 && (
              <OrderPicker title="Other deliveries" orders={others} path="/store-manager/track-delivery" emptyText="" />
            )}
          </div>

          <div className="td-right-col">
            <DockGateActionsCard
              order={order}
              outletName={outletName}
              driverPhone={plan?.driver_phone}
              onConfirmReceipt={() => navigate(`/store-manager/confirm-receipt?orderId=${encodeURIComponent(order.order_id)}`)}
              onViewManifest={() => setIsManifestOpen(true)}
              onReportIssue={() => navigate(`/store-manager/report-issue?orderId=${encodeURIComponent(order.order_id)}`)}
            />
            {plan && <AssignedDriverCard plan={plan} driverNotes={detail.delivery?.driver_notes} />}
            <DeliverySlaCard order={order} plan={plan} trip={detail.trip} delivery={detail.delivery} />
            <PayloadBreakdownCard items={detail.items} order={order} />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="sm-track-delivery-page">
      <StoreManagerSidebar activeItem="Track Delivery" />
      <main className="sm-track-delivery-main">{body}</main>
      {detail && (
        <ManifestModal isOpen={isManifestOpen} onClose={() => setIsManifestOpen(false)} order={order} plan={plan} items={detail.items} outletName={`Waypoint ${detail.outlet.brand} – ${detail.outlet.district}`} />
      )}
    </div>
  )
}
