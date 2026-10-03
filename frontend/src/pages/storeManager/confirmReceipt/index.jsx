import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { orderService } from '../../../services/orderService'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import OrderPicker from '../../../components/storeManager/OrderPicker'
import DeliveryReceivedHeader from '../../../components/storeManager/confirmReceipt/DeliveryReceivedHeader'
import DeliverySummaryBoxes from '../../../components/storeManager/confirmReceipt/DeliverySummaryBoxes'
import DeliveredItemsTable from '../../../components/storeManager/confirmReceipt/DeliveredItemsTable'
import ReceiptSignOffCard from '../../../components/storeManager/confirmReceipt/ReceiptSignOffCard'
import ConfirmSuccessModal from '../../../components/storeManager/confirmReceipt/ConfirmSuccessModal'
import { dispatchStatusOf, formatShortDate, formatTime, formatTimestamp } from '../../../utils/orderFormat'
import { vehicleTypeLabel } from '../../../utils/tripFormat'
import './ConfirmReceipt.css'

const AWAITING = ['delivered', 'partial']
const CONFIRMED = ['received', 'disputed']

const toLines = (items) =>
  items.map((it) => ({
    id: it.item_id,
    name: it.product_name,
    sku: it.product_code,
    category: it.temp_requirement === 'chilled' ? 'chilled' : 'ambient',
    classLabel: it.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient',
    orderedQty: Number(it.quantity),
    deliveredQty: Number(it.quantity),
    unit: it.unit,
    condition: 'Good',
  }))

export default function ConfirmReceipt() {
  const navigate = useNavigate()
  const user = useCurrentUser()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [detail, setDetail] = useState(null)
  const [candidates, setCandidates] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const [temperature, setTemperature] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let active = true
    const request = orderId ? orderService.getOrder(orderId) : orderService.getMyOrders()
    request
      .then((res) => {
        if (!active) return
        setLoadError(null)
        if (orderId) {
          setDetail(res)
          setItems(toLines(res.items))
        } else {
          setCandidates(res.orders.filter((o) => AWAITING.includes(o.status)))
        }
      })
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [orderId])

  const updateQty = (id, delta) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, deliveredQty: Math.min(it.orderedQty, Math.max(0, it.deliveredQty + delta)) } : it)))
  const updateCondition = (id, condition) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, condition, deliveredQty: condition === 'Missing' ? 0 : it.deliveredQty || it.orderedQty } : it)))
  const setAllGood = () => setItems((prev) => prev.map((it) => ({ ...it, condition: 'Good', deliveredQty: it.orderedQty })))

  const handleConfirmReceipt = async () => {
    if (!isConfirmed) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await orderService.confirmReceipt(orderId, {
        lines: items.map((it) => ({ item_id: it.id, delivered_qty: it.deliveredQty, condition: it.condition.toLowerCase() })),
        temp_check_celsius: temperature === '' ? null : Number(temperature),
        notes,
      })
      setResult(res)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const order = detail?.order
  const outlet = detail?.outlet
  const plan = detail?.plan
  const storeName = outlet ? `Waypoint ${outlet.brand} – ${outlet.district}` : user?.outlet ? `Waypoint ${user.outlet.brand} – ${user.outlet.district}` : 'your outlet'

  let body
  if (loadError) {
    body = <p className="sm-page-state error">{loadError}</p>
  } else if (!orderId) {
    body = candidates ? (
      <OrderPicker
        title="Confirm Receipt"
        hint="Choose a delivered order to count and sign off."
        orders={candidates}
        path="/store-manager/confirm-receipt"
        emptyText="No deliveries are waiting for your sign-off. Orders appear here once the driver records the delivery."
      />
    ) : (
      <p className="sm-page-state">Loading deliveries…</p>
    )
  } else if (!detail) {
    body = <p className="sm-page-state">Loading {orderId}…</p>
  } else if (CONFIRMED.includes(order.status) && detail.receipt) {
    const r = detail.receipt
    body = (
      <section className="sm-order-picker">
        <h2>{order.order_id} — receipt already confirmed</h2>
        <p className="sm-order-picker-hint">
          {r.confirmed_by || 'Store manager'} signed off on {formatTimestamp(r.confirmed_at).date} at {formatTimestamp(r.confirmed_at).time}:{' '}
          {r.received_cases} received, {r.damaged_cases} damaged, {r.missing_cases} missing
          {r.temp_check_celsius != null ? `, ${r.temp_check_celsius}°C at receipt` : ''}. Status: <strong>{dispatchStatusOf(order.status).label}</strong>.
        </p>
        {r.manager_notes && <p className="sm-order-picker-hint">Notes: {r.manager_notes}</p>}
        <p className="sm-order-picker-hint">
          <Link to={`/store-manager/report-issue?orderId=${encodeURIComponent(order.order_id)}`}>Report another issue</Link> •{' '}
          <Link to="/store-manager/confirm-receipt">Other deliveries</Link>
        </p>
      </section>
    )
  } else if (!AWAITING.includes(order.status)) {
    body = (
      <section className="sm-order-picker">
        <h2>{order.order_id} is not ready for receipt</h2>
        <p className="sm-order-picker-hint">
          Current status: <strong>{dispatchStatusOf(order.status).label}</strong>.{' '}
          {order.status === 'failed'
            ? 'The driver could not deliver this order — dispatch will reschedule it.'
            : 'You can confirm receipt after the driver records the delivery at your store.'}
        </p>
        {plan && (
          <p className="sm-order-picker-hint">
            <Link to={`/store-manager/track-delivery/${plan.trip_id}?orderId=${encodeURIComponent(order.order_id)}`}>Track this delivery</Link>
          </p>
        )}
      </section>
    )
  } else {
    const delivery = detail.delivery
    const delivered = `${delivery ? `${formatTime(delivery.actual_arrival_time)} • ` : ''}${formatShortDate(order.target_delivery_date)}`
    body = (
      <>
        <DeliveryReceivedHeader
          orderId={order.order_id}
          statusLabel={dispatchStatusOf(order.status).label}
          partial={order.status === 'partial'}
          receivedBy={delivery?.received_by_name}
          driverNotes={delivery?.driver_notes}
          loading={detail.loading}
          dockType={outlet?.dock_type}
        />

        <DeliverySummaryBoxes
          orderId={order.order_id}
          unitsLabel={`${order.total_units} units • ${order.sku_count} lines`}
          storeName={storeName}
          storeId={order.outlet_id}
          tripId={plan?.trip_id || '—'}
          vehicleId={plan?.vehicle_id || '—'}
          vehicleLabel={plan ? vehicleTypeLabel({ vehicle_type: plan.vehicle_type, vehicle_temp: plan.vehicle_temp }) : ''}
          deliveryTime={delivered}
          driverName={plan?.driver_name || 'Driver not recorded'}
          chilled={order.temp_requirement === 'chilled'}
          offline={delivery?.recorded_offline}
        />

        <DeliveredItemsTable items={items} onUpdateDeliveredQty={updateQty} onUpdateCondition={updateCondition} onSetAllGood={setAllGood} />

        <ReceiptSignOffCard
          notes={notes}
          onChangeNotes={setNotes}
          temperature={temperature}
          onChangeTemperature={setTemperature}
          chilled={order.temp_requirement === 'chilled'}
          storeName={storeName}
          managerName={user?.name}
          outletId={order.outlet_id}
          isConfirmed={isConfirmed}
          onToggleConfirm={() => setIsConfirmed((v) => !v)}
          onBack={() => navigate(plan ? `/store-manager/track-delivery/${plan.trip_id}?orderId=${encodeURIComponent(order.order_id)}` : '/store-manager/my-orders')}
          onReportIssue={() => navigate(`/store-manager/report-issue?orderId=${encodeURIComponent(order.order_id)}`)}
          onConfirmReceipt={handleConfirmReceipt}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      </>
    )
  }

  return (
    <div className="cr-page-wrapper">
      <StoreManagerSidebar activeItem="Confirm Receipt" />

      <main className="cr-main-content">{body}</main>

      {result && (
        <ConfirmSuccessModal
          orderId={orderId}
          storeName={storeName}
          managerName={user?.name}
          result={result}
          onClose={() => navigate(0)}
          onGoToDashboard={() => navigate('/store-manager/dashboard')}
          onViewOrderHistory={() => navigate('/store-manager/order-history')}
        />
      )}
    </div>
  )
}
