import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../../../components/dispatcher/layout/Sidebar'
import Header from '../../../../components/dispatcher/layout/Header'
import OrderHeader from '../../../../components/dispatcher/orderDetails/OrderHeader'
import OrderSummaryCard from '../../../../components/dispatcher/orderDetails/OrderSummaryCard'
import DeliveryDestinationCard from '../../../../components/dispatcher/orderDetails/DeliveryDestinationCard'
import DeliveryRequirementsCard from '../../../../components/dispatcher/orderDetails/DeliveryRequirementsCard'
import CapacityRequirementsCard from '../../../../components/dispatcher/orderDetails/CapacityRequirementsCard'
import DeliveryWindowCard from '../../../../components/dispatcher/orderDetails/DeliveryWindowCard'
import OrderItemsTable from '../../../../components/dispatcher/orderDetails/OrderItemsTable'
import PlanningStatusCard from '../../../../components/dispatcher/orderDetails/PlanningStatusCard'
import OrderActivityTimeline from '../../../../components/dispatcher/orderDetails/OrderActivityTimeline'
import OrderBottomBar from '../../../../components/dispatcher/orderDetails/OrderBottomBar'
import DeferOrdersModal from '../../../../components/dispatcher/orders/DeferOrdersModal'
import { orderService } from '../../../../services/orderService'
import {
  DEFERRAL_REASONS,
  dispatchStatusOf,
  formatCountdown,
  formatDate,
  formatShortDate,
  formatTime,
  formatTimestamp,
  formatWindow,
} from '../../../../utils/orderFormat'

import './OrderDetails.css'

const FINISHED = ['delivered', 'partial', 'received', 'disputed']
const PLAN_DONE = ['planned', 'loading', 'loaded', 'shortfall', 'dispatched', 'failed', ...FINISHED]

// Progress for a stepper: everything before `current` is completed.
function stepper(labels, current) {
  return labels.map((label, i) => ({
    label,
    state: i < current ? 'completed' : i === current ? 'current' : 'pending',
    subtext: i === current ? 'Current' : undefined,
  }))
}

function fulfillmentIndex(status) {
  if (FINISHED.includes(status)) return 5
  if (['dispatched', 'failed'].includes(status)) return 3
  if (PLAN_DONE.includes(status)) return 2
  if (status === 'cancelled') return 0
  return 1
}

function planningIndex(status) {
  if (FINISHED.includes(status)) return 6
  if (['dispatched', 'failed'].includes(status)) return 4
  if (PLAN_DONE.includes(status)) return 3
  return 1
}

// Window countdown, status badge and footnote for the Delivery Window card.
function windowState(order, plan) {
  // A deferred order is now due on its next scheduled run, not its original date.
  const day = order.status === 'deferred' && order.next_scheduled_date ? order.next_scheduled_date : order.target_delivery_date
  const start = Date.parse(`${day}T${order.requested_window_open.slice(0, 5)}:00+05:30`)
  const end = Date.parse(`${day}T${order.requested_window_close.slice(0, 5)}:00+05:30`)
  const now = Date.now()

  let countdown = 'Delivery window has closed'
  if (FINISHED.includes(order.status)) countdown = 'Delivered'
  else if (now < start) countdown = `${formatCountdown(start, now)} until delivery window`
  else if (now <= end) countdown = 'Delivery window is open now'

  if (FINISHED.includes(order.status)) {
    return { countdown, status: 'Completed', tone: 'on-track', footnote: 'Delivery recorded for this order.' }
  }
  if (order.status === 'deferred') {
    return {
      countdown,
      status: 'Deferred',
      tone: 'at-risk',
      footnote: `Deferred to ${formatDate(order.next_scheduled_date)}: ${DEFERRAL_REASONS[order.deferral_reason] || 'capacity'}.`,
    }
  }
  if (plan) {
    const late = plan.planned_arrival_time && plan.planned_arrival_time > order.requested_window_close
    return {
      countdown,
      status: late ? 'Planned Late' : 'On Track',
      tone: late ? 'at-risk' : 'on-track',
      footnote: `Planned arrival ${formatTime(plan.planned_arrival_time)} on ${plan.trip_id} (${plan.vehicle_id}).`,
    }
  }
  const soon = start - now < 24 * 3600000
  return {
    countdown,
    status: soon ? 'At Risk' : 'Awaiting Plan',
    tone: soon ? 'at-risk' : 'neutral',
    footnote: 'This order has not yet been assigned to a delivery plan.',
  }
}

function bottomMessage(order) {
  switch (order.status) {
    case 'submitted':
      return `Awaiting the order cutoff (${formatShortDate(order.target_delivery_date)} run). Close intake on the Orders page to plan it now.`
    case 'confirmed':
      return 'Ready to begin planning? Add this order to a delivery plan.'
    case 'deferred':
      return `Deferred ${order.consecutive_deferral_count || 1}× — include it in the ${formatShortDate(order.next_scheduled_date)} plan.`
    case 'cancelled':
      return 'This order was cancelled.'
    default:
      return `Current stage: ${dispatchStatusOf(order.status).label}.`
  }
}

const STATUS_TONES = { pending: 'amber', planned: 'green', loading: 'blue', deferred: 'amber', exception: 'red' }

export default function OrderDetails() {
  const { orderId, order_code } = useParams()
  const currentOrderId = orderId || order_code

  const [detail, setDetail] = useState(null)
  const [error, setError] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [isDeferOpen, setIsDeferOpen] = useState(false)
  const [notice, setNotice] = useState(null)

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    orderService
      .getOrder(currentOrderId)
      .then((res) => {
        if (!active) return
        setDetail(res)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [currentOrderId, reloadKey])

  const run = async (action) => {
    setIsBusy(true)
    try {
      const res = await action()
      setNotice({ tone: 'success', message: res.message })
      setReloadKey((k) => k + 1)
      return true
    } catch (err) {
      setNotice({ tone: 'error', message: err.message })
      return false
    } finally {
      setIsBusy(false)
    }
  }

  if (error || !detail) {
    return (
      <div className="order-details-page-container">
        <Sidebar activeItem="Orders" />
        <div className="order-details-main-wrapper">
          <Header />
          <main className="order-details-content">
            <OrderHeader orderId={currentOrderId} status={error ? 'Unavailable' : 'Loading…'} />
            <div className={`order-details-notice ${error ? 'tone-error' : ''}`}>
              {error ? `Unable to load ${currentOrderId}: ${error}` : 'Loading order…'}
            </div>
          </main>
        </div>
      </div>
    )
  }

  const { order, outlet, items, events, plan, created_by: createdBy, related_orders: related } = detail
  const status = dispatchStatusOf(order.status)
  const isUrgent = order.priority === 'urgent'
  const canPlan = ['confirmed', 'deferred'].includes(order.status)
  const canDefer = ['confirmed', 'deferred', 'failed'].includes(order.status) && !plan
  const canCancel = ['confirmed', 'deferred'].includes(order.status)
  const windowInfo = windowState(order, plan)
  const created = formatTimestamp(order.submitted_at || order.created_at)

  const actions = {
    isUrgent,
    isBusy,
    canPlan,
    canDefer,
    canCancel,
    onMarkPriority: () => run(() => orderService.setPriority([order.order_id], isUrgent ? 'normal' : 'urgent')),
    onDefer: () => setIsDeferOpen(true),
    onCancel: () => {
      const reason = window.prompt(`Why is ${order.order_id} being cancelled? The store manager will see this reason.`)
      if (reason && reason.trim()) run(() => orderService.cancelOrder(order.order_id, reason.trim()))
    },
  }

  return (
    <div className="order-details-page-container">
      {/* Sidebar with Orders active */}
      <Sidebar activeItem="Orders" />

      {/* Main Content Area */}
      <div className="order-details-main-wrapper">
        <Header />

        <main className="order-details-content">
          {/* Header row with back link and actions */}
          <OrderHeader
            orderId={order.order_id}
            status={status.label}
            statusTone={STATUS_TONES[status.type] || 'amber'}
            {...actions}
          />

          {notice && (
            <div className={`order-details-notice tone-${notice.tone}`} role="status">
              <span>{notice.message}</span>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss">✕</button>
            </div>
          )}

          {related.length > 0 && (
            <div className="order-details-notice">
              Placed together with {related.map((r) => `${r.order_id} (${r.temp_requirement}, ${dispatchStatusOf(r.status).label})`).join(', ')} —
              the store's chilled and ambient goods were split so each can go on a suitable vehicle.
            </div>
          )}

          {/* Order Summary & Fulfillment Progress */}
          <OrderSummaryCard
            order={order}
            statusLabel={status.label}
            createdBy={createdBy}
            createdAt={`${created.date}, ${created.time}`}
            steps={stepper(['Order Created', 'Planning', 'Loading', 'In Transit', 'Delivered'], fulfillmentIndex(order.status))}
          />

          {/* Delivery Destination & Requirements */}
          <div className="order-details-two-col">
            <DeliveryDestinationCard order={order} outlet={outlet} />
            <DeliveryRequirementsCard order={order} />
          </div>

          {/* Capacity Requirements & Delivery Window */}
          <div className="order-details-two-col">
            <CapacityRequirementsCard
              weightKg={order.total_weight_kg}
              volumeM3={order.total_volume_m3}
              weightCapKg={plan?.weight_cap_kg}
              volumeCapM3={plan?.volume_cap_m3}
              capLabel={plan ? plan.vehicle_id : null}
            />
            <DeliveryWindowCard
              date={formatDate(order.target_delivery_date)}
              window={formatWindow(order.requested_window_open, order.requested_window_close)}
              countdown={windowInfo.countdown}
              status={windowInfo.status}
              tone={windowInfo.tone}
              footnote={windowInfo.footnote}
            />
          </div>

          {/* Order Items Table */}
          <OrderItemsTable items={items} />

          {/* Planning Status & Order Activity Timeline */}
          <div className="order-details-two-col">
            <PlanningStatusCard
              statusLabel={status.label}
              actionRequired={canPlan || status.type === 'exception'}
              plan={plan}
              steps={stepper(
                ['Order Received', 'Planning', 'Vehicle Assigned', 'Loading', 'In Transit', 'Delivered'],
                planningIndex(order.status)
              )}
            />
            <OrderActivityTimeline events={events} />
          </div>

          {/* Bottom Action Bar */}
          <OrderBottomBar orderId={order.order_id} message={bottomMessage(order)} {...actions} />

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>Order data loaded at {formatTimestamp(new Date().toISOString()).time} • Asia/Colombo</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>

      <DeferOrdersModal
        isOpen={isDeferOpen}
        orderIds={[order.order_id]}
        isBusy={isBusy}
        onClose={() => setIsDeferOpen(false)}
        onConfirm={async (reason, explanation) => {
          if (await run(() => orderService.deferOrders([order.order_id], reason, explanation))) setIsDeferOpen(false)
        }}
      />
    </div>
  )
}
