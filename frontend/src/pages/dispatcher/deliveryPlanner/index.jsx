import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import DeliveryPlannerHeader from '../../../components/dispatcher/deliveryPlanner/DeliveryPlannerHeader'
import PlannerStatCards from '../../../components/dispatcher/deliveryPlanner/PlannerStatCards'
import OrdersToPlanColumn from '../../../components/dispatcher/deliveryPlanner/OrdersToPlanColumn'
import TodaysPlanColumn from '../../../components/dispatcher/deliveryPlanner/TodaysPlanColumn'
import RouteDetailsColumn from '../../../components/dispatcher/deliveryPlanner/RouteDetailsColumn'
import UnscheduledOrdersSection from '../../../components/dispatcher/deliveryPlanner/UnscheduledOrdersSection'
import PlannerBottomBar from '../../../components/dispatcher/deliveryPlanner/PlannerBottomBar'
import DeferOrdersModal from '../../../components/dispatcher/orders/DeferOrdersModal'
import { planService } from '../../../services/planService'
import { colomboToday, formatDate } from '../../../utils/orderFormat'

import './DeliveryPlanner.css'

// Next Mon–Sat date after today (Colombo) — the run dispatchers usually plan.
function nextRunDate() {
  let d = new Date(Date.parse(`${colomboToday()}T00:00:00Z`) + 86400000)
  if (d.getUTCDay() === 0) d = new Date(d.getTime() + 86400000)
  return d.toISOString().slice(0, 10)
}

const canCarry = (vehicle, order) =>
  vehicle.depot === order.depot &&
  vehicle.available &&
  (order.temp !== 'chilled' || vehicle.temp === 'reefer') &&
  (order.parking !== 'van_only' || vehicle.type === 'van')

export default function DeliveryPlanner() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const date = searchParams.get('date') || nextRunDate()
  const [depot, setDepot] = useState('all')

  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((k) => k + 1)

  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState('1')
  const [focusedOrderId, setFocusedOrderId] = useState(location.state?.orderIds?.[0] || null)
  const [dropCheck, setDropCheck] = useState(null)
  const [deferOrderId, setDeferOrderId] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'info') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 5500)
  }

  useEffect(() => {
    let active = true
    planService
      .getPlan(date)
      .then((res) => {
        if (!active) return
        setData(res)
        setLoadError(null)
      })
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [date, reloadKey])

  const isPublished = data?.plan.status === 'published'
  const vehicles = useMemo(
    () => (data?.vehicles || []).filter((v) => depot === 'all' || v.depot === depot),
    [data, depot]
  )
  const routes = vehicles.filter((v) => v.trips.length > 0)
  const idleVehicles = vehicles.filter((v) => v.available && v.trips.length === 0)
  const unscheduled = (data?.unscheduled || []).filter((o) => depot === 'all' || o.depot === depot)
  const selectedVehicle = vehicles.find((v) => v.vehicle_id === selectedVehicleId) || routes[0] || null
  const tripKey = selectedVehicle && selectedVehicle.trips.length === 0 ? 'new' : selectedTrip
  const selectedTripData = selectedVehicle?.trips.find((t) => String(t.trip_number) === String(tripKey)) || null
  const focusedOrder = unscheduled.find((o) => o.order_id === focusedOrderId) || null

  // Live drop-zone check: would the focused order fit the selected trip?
  useEffect(() => {
    if (!focusedOrder || !selectedVehicle || isPublished) return
    let active = true
    planService
      .checkAssign(date, focusedOrder.order_id, selectedVehicle.vehicle_id, tripKey)
      .then((res) => active && setDropCheck({ key: `${focusedOrder.order_id}|${selectedVehicle.vehicle_id}|${tripKey}`, ...res }))
      .catch((err) => active && setDropCheck({ key: `${focusedOrder.order_id}|${selectedVehicle.vehicle_id}|${tripKey}`, ok: false, failures: [{ message: err.message }] }))
    return () => {
      active = false
    }
  }, [date, focusedOrder, selectedVehicle, tripKey, isPublished])

  const currentCheck =
    focusedOrder && selectedVehicle && dropCheck?.key === `${focusedOrder.order_id}|${selectedVehicle.vehicle_id}|${tripKey}` ? dropCheck : null

  const run = async (action, { after } = {}) => {
    setIsBusy(true)
    try {
      const res = await action()
      if (res?.message) showToast(res.message, 'success')
      after?.(res)
      reload()
      return res
    } catch (err) {
      showToast(err.message, 'error')
      return null
    } finally {
      setIsBusy(false)
    }
  }

  const handleSelectVehicle = (vehicleId) => {
    const v = vehicles.find((x) => x.vehicle_id === vehicleId)
    setSelectedVehicleId(vehicleId)
    setSelectedTrip(v && v.trips.length ? '1' : 'new')
  }

  const assignTo = (orderId, vehicleId, trip) =>
    run(() => planService.assign(date, orderId, vehicleId, trip), {
      after: () => {
        if (orderId === focusedOrderId) setFocusedOrderId(null)
        setSelectedVehicleId(vehicleId)
        if (trip === 'new') {
          const v = vehicles.find((x) => x.vehicle_id === vehicleId)
          setSelectedTrip(String((v?.trips.length || 0) + 1))
        }
      },
    })

  // Tries every vehicle that could carry the order (existing compatible trips first).
  const handleFindAlternative = async (order) => {
    setFocusedOrderId(order.order_id)
    const options = []
    for (const v of data.vehicles.filter((x) => canCarry(x, order))) {
      for (const t of v.trips) if (t.brand === order.brand && t.district === order.district) options.push([v, String(t.trip_number)])
      if (v.trips.length < 2) options.push([v, 'new'])
    }
    setIsBusy(true)
    try {
      for (const [v, trip] of options) {
        const res = await planService.checkAssign(date, order.order_id, v.vehicle_id, trip)
        if (res.ok) {
          if (depot !== 'all' && v.depot !== depot) setDepot('all')
          setSelectedVehicleId(v.vehicle_id)
          setSelectedTrip(trip)
          showToast(`${v.vehicle_id} ${trip === 'new' ? 'can run a new trip' : `trip ${trip} has room`} for ${order.order_id}. Review it and press Add.`, 'success')
          return
        }
      }
      showToast(`No vehicle can take ${order.order_id} without breaking a constraint. Record a deferral reason instead.`, 'error')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setIsBusy(false)
    }
  }

  const handlePublish = () => {
    const s = data.stats
    const ok = window.confirm(
      `Publish the plan for ${formatDate(date)}?\n\n${s.planned} orders on ${s.routes} trips go to the loaders and drivers.\n${s.unscheduled} unscheduled order(s) will be deferred to the next run with their recorded reasons, and store managers will see why.`
    )
    if (ok) run(() => planService.publish(date))
  }

  const handleLoadScenario = () => {
    const ok = window.confirm(
      `Load the peak-day demo scenario for ${formatDate(date)}?\n\nThis creates festival-week orders for all outlets, puts 10 vehicles in the workshop for that date, and replaces any earlier scenario and draft plan for the date.`
    )
    if (ok) run(() => planService.loadScenario(date))
  }

  const handleRebuild = () => {
    if (window.confirm('Rebuild the whole plan from scratch? Your manual route changes for this date will be replaced.')) {
      run(() => planService.suggest(date, false))
    }
  }

  const hasDraft = (data?.vehicles || []).some((v) => v.trips.some((t) => t.status === 'draft'))

  return (
    <div className="planner-page-container">
      {/* Sidebar with Delivery Planner Active */}
      <Sidebar activeItem="Delivery Planner" />

      {/* Main Content Area */}
      <div className="planner-main-wrapper">
        <Header />

        <main className="planner-content">
          {/* Header Row & Advisory Banner */}
          <DeliveryPlannerHeader
            date={date}
            onDateChange={(d) => {
              setSearchParams({ date: d })
              setSelectedVehicleId(null)
              setFocusedOrderId(null)
            }}
            depot={depot}
            onDepotChange={setDepot}
            plan={data?.plan}
            awaitingCutoff={data?.awaiting_cutoff || 0}
            isBusy={isBusy}
            onSuggest={() => run(() => planService.suggest(date, hasDraft))}
            onRebuild={hasDraft ? handleRebuild : null}
            onSaveDraft={() => showToast('Draft saved — every change is stored as you plan.', 'success')}
            onPublish={handlePublish}
            onLoadScenario={handleLoadScenario}
          />

          {loadError && <div className="planner-load-error">Unable to load the plan: {loadError}</div>}

          {/* 6 Summary Stat Cards */}
          <PlannerStatCards stats={data?.stats} />

          {/* 3-Column Core Planning Workspace */}
          <div className="planner-three-col-workspace">
            {/* Left: Orders to Plan */}
            <OrdersToPlanColumn
              orders={unscheduled}
              focusedOrderId={focusedOrderId}
              onFocus={(id) => setFocusedOrderId(id === focusedOrderId ? null : id)}
              onAddToRoute={(order) => (selectedVehicle ? assignTo(order.order_id, selectedVehicle.vehicle_id, tripKey) : handleFindAlternative(order))}
              onFindAlternative={handleFindAlternative}
              onDefer={(order) => setDeferOrderId(order.order_id)}
              targetLabel={selectedVehicle ? `${selectedVehicle.vehicle_id} • ${tripKey === 'new' ? 'new trip' : `Trip ${tripKey}`}` : null}
              isPublished={isPublished}
              isLoading={!data && !loadError}
            />

            {/* Center: Delivery Plan Main Stage */}
            <TodaysPlanColumn
              date={date}
              routes={routes}
              idleVehicles={idleVehicles}
              vehicle={selectedVehicle}
              tripKey={tripKey}
              trip={selectedTripData}
              focusedOrder={focusedOrder}
              dropCheck={currentCheck}
              isPublished={isPublished}
              isBusy={isBusy}
              constraintErrors={data?.stats.constraint_errors || 0}
              onSelectVehicle={handleSelectVehicle}
              onSelectTrip={setSelectedTrip}
              onAddFocused={() => focusedOrder && assignTo(focusedOrder.order_id, selectedVehicle.vehicle_id, tripKey)}
              onDropOrder={(orderId) => assignTo(orderId, selectedVehicle.vehicle_id, tripKey)}
              onRemoveStop={(orderId) => run(() => planService.unassign(date, [orderId]))}
              onMoveStop={(orderId, toTrip) => assignTo(orderId, selectedVehicle.vehicle_id, toTrip)}
            />

            {/* Right: Route Details */}
            <RouteDetailsColumn
              vehicle={selectedVehicle}
              trip={selectedTripData}
              isPublished={isPublished}
              isBusy={isBusy}
              onRemoveRoute={(vehicleId) => {
                if (window.confirm(`Remove every trip on ${vehicleId}? Its orders go back to Orders to Plan.`)) {
                  run(() => planService.removeRoute(date, vehicleId))
                }
              }}
            />
          </div>

          {/* Unscheduled Orders Section */}
          <UnscheduledOrdersSection
            orders={unscheduled.filter((o) => o.reason !== 'not_planned')}
            isPublished={isPublished}
            onFocus={setFocusedOrderId}
            onFindAlternative={handleFindAlternative}
            onDefer={(order) => setDeferOrderId(order.order_id)}
          />

          {/* Sticky Bottom Action Bar */}
          <PlannerBottomBar
            stats={data?.stats}
            plan={data?.plan}
            isBusy={isBusy}
            onReviewDeferrals={() => document.getElementById('planner-unscheduled')?.scrollIntoView({ behavior: 'smooth' })}
            onSaveDraft={() => showToast('Draft saved — every change is stored as you plan.', 'success')}
            onPublish={handlePublish}
          />

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>All times in Asia/Colombo (UTC+05:30)</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>

      <DeferOrdersModal
        isOpen={Boolean(deferOrderId)}
        orderIds={deferOrderId ? [deferOrderId] : []}
        isBusy={isBusy}
        onClose={() => setDeferOrderId(null)}
        onConfirm={async (reason, explanation) => {
          const res = await run(() => planService.setReason(date, deferOrderId, reason, explanation))
          if (res) setDeferOrderId(null)
        }}
      />

      {toast && (
        <div className={`planner-toast tone-${toast.tone}`} role="status">
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>
      )}
    </div>
  )
}
