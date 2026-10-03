import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoadDetailHeader from '../../../components/loader/todayOrders/LoadDetailHeader'
import LoadHeroCard from '../../../components/loader/todayOrders/LoadHeroCard'
import PlannedStopSequenceCard from '../../../components/loader/todayOrders/PlannedStopSequenceCard'
import ManifestContentsTable from '../../../components/loader/todayOrders/ManifestContentsTable'
import VehicleInfoCard from '../../../components/loader/todayOrders/VehicleInfoCard'
import LoadProgressSummaryCard from '../../../components/loader/todayOrders/LoadProgressSummaryCard'
import LoadAttentionBanner from '../../../components/loader/todayOrders/LoadAttentionBanner'
import LoadBottomBar from '../../../components/loader/todayOrders/LoadBottomBar'
import { tripService } from '../../../services/tripService'
import { formatDate, formatTime, productCategory } from '../../../utils/orderFormat'
import { loadStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './TodayOrders.css'

export default function TodayOrders() {
  const { orderId, loadId } = useParams()
  const tripId = orderId || loadId
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [busyOrderId, setBusyOrderId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'info') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 4500)
  }

  useEffect(() => {
    if (!tripId) return
    let active = true
    tripService
      .getTrip(tripId)
      .then((res) => {
        if (!active) return
        setData(res)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [tripId, reloadKey])

  if (!tripId) return <Navigate to="/loader/today-loads" replace />

  if (error || !data) {
    return (
      <div className="today-orders-layout-container">
        <LoaderSidebar activeItem="Today's Loads" />
        <div className="today-orders-main-wrapper">
          <main className="today-orders-content">
            <LoadDetailHeader loadId={tripId} />
            <p className="load-page-state">{error ? `Unable to open ${tripId}: ${error}` : 'Loading load details…'}</p>
          </main>
        </div>
      </div>
    )
  }

  const { trip, stops, issues } = data
  const canEdit = ['planned', 'loading'].includes(trip.status)
  const checked = stops.filter((s) => s.verified_at).length
  const shorts = stops.filter((s) => s.shortfall_flag).length
  const pending = stops.length - checked
  const percent = stops.length ? Math.round((checked / stops.length) * 100) : 0
  const status = loadStatusOf({ ...trip, verified: checked, shortfalls: shorts })
  const hub = trip.depot === 'Kandy' ? 'Kandy Regional Hub' : 'Peliyagoda Distribution Center'

  const action = canEdit
    ? pending === 0
      ? { label: 'Complete Loading', disabled: false }
      : { label: trip.status === 'planned' ? 'Start Loading' : 'Continue Loading', disabled: false }
    : null

  const runAction = async (fn) => {
    try {
      const res = await fn()
      showToast(res.message, 'success')
      setReloadKey((k) => k + 1)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleLoaded = async (id) => {
    setBusyOrderId(id)
    await runAction(() => tripService.verifyOrder(trip.trip_id, { order_id: id, result: 'loaded' }))
    setBusyOrderId(null)
  }

  const handleShort = (id) => navigate(`/loader/today-loads/${trip.trip_id}/report-issue?order=${id}`)

  const handlePrimary = () => {
    if (pending === 0) {
      if (window.confirm(`Complete loading for ${trip.vehicle_id}? ${shorts ? `${shorts} order(s) are flagged short and will travel short. ` : ''}The driver can then start the trip.`)) {
        runAction(() => tripService.completeLoading(trip.trip_id))
      }
    } else {
      document.querySelector('.manifest-contents-card')?.scrollIntoView({ behavior: 'smooth' })
      showToast(`Check each order in the manifest: ${pending} still to load, starting with load #1.`)
    }
  }

  // Load in reverse delivery order: the last stop goes in first so the first stop comes off first.
  const loadingOrder = [...stops].sort((a, b) => a.loading_sequence - b.loading_sequence)
  const manifest = loadingOrder.flatMap((s) =>
    (s.items.length ? s.items : [{ item_id: 'none', product_name: 'Order lines', quantity: s.total_units, unit: 'units', temp_requirement: s.temp_requirement }]).map((it, i) => {
      const category = productCategory(it)
      return {
        key: `${s.order_id}-${it.item_id}`,
        firstOfOrder: i === 0,
        checked: Boolean(s.verified_at),
        outlet: `#${s.loading_sequence} ${s.outlet_id} • ${s.district}`,
        orderId: s.order_id,
        product: it.product_name,
        quantity: `${it.quantity} × ${it.unit}`,
        temp: category.type.toUpperCase(),
        tempType: category.type,
        status: s.shortfall_flag ? 'SHORT' : s.verified_at ? 'LOADED' : 'PENDING',
        statusType: s.shortfall_flag ? 'issue' : s.verified_at ? 'loaded' : 'pending',
      }
    })
  )

  const shortStop = stops.find((s) => s.shortfall_flag)
  const chilled = stops.filter((s) => s.temp_requirement === 'chilled').length

  return (
    <div className="today-orders-layout-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="today-orders-main-wrapper">
        <main className="today-orders-content">
          {/* Header with Breadcrumb */}
          <LoadDetailHeader loadId={trip.trip_id} hub={hub} />

          {/* Hero Card */}
          <LoadHeroCard
            load={{
              id: trip.trip_id,
              status: status.status,
              statusType: status.statusType,
              vehicleId: trip.vehicle_id,
              vehicleType: vehicleTypeLabel(trip),
              routeProfile: `${trip.depot} → ${trip.district}`,
              routeStopsDistance: `${stops.length} Stops · ${Number(trip.total_planned_distance_km)} km · ${trip.brand}`,
              departureTime: formatTime(trip.planned_departure_time),
              departureSub: formatDate(trip.delivery_date),
              progressPercent: percent,
              progressSub: `${checked} of ${stops.length} orders checked${shorts ? ` • ${shorts} short` : ''}`,
              actionLabel: action?.label,
              actionDisabled: action?.disabled,
              canEdit,
            }}
            onReportIssue={() => handleShort(stops.find((s) => !s.verified_at)?.order_id || stops[0]?.order_id)}
            onContinueLoading={handlePrimary}
          />

          {/* Two Column Grid */}
          <div className="load-detail-two-col">
            {/* Left Column: Sequence + Manifest */}
            <div className="load-detail-left-col">
              <PlannedStopSequenceCard
                stops={loadingOrder.map((s) => ({
                  step: s.loading_sequence,
                  name: `Load #${s.loading_sequence} → Stop ${s.stop_sequence}: Waypoint ${s.brand} — ${s.district}`,
                  outletInfo: `Outlet ID: ${s.outlet_id} · ${s.order_id} · ${Math.round(s.total_weight_kg)} kg / ${Number(s.total_volume_m3)} m³${s.temp_requirement === 'chilled' ? ' · CHILLED' : ''}`,
                  timeWindow: `Arrive ${formatTime(s.planned_arrival_time)}`,
                  completed: Boolean(s.verified_at),
                }))}
              />
              <ManifestContentsTable
                items={manifest}
                canEdit={canEdit}
                busyOrderId={busyOrderId}
                onLoaded={handleLoaded}
                onShort={handleShort}
              />
            </div>

            {/* Right Column: Vehicle Info + Loading Progress + Attention Alert */}
            <div className="load-detail-right-col">
              <VehicleInfoCard
                vehicle={{
                  id: trip.vehicle_id,
                  type: `${vehicleTypeLabel(trip)} (${Number(trip.weight_cap_kg).toLocaleString()} kg / ${Number(trip.volume_cap_m3)} m³)`,
                  depot: hub,
                  departureTime: `${formatTime(trip.planned_departure_time)} • ${formatDate(trip.delivery_date)}`,
                  assignedDriver: trip.driver_name || 'Depot driver',
                  driverContact: trip.driver_phone || '—',
                }}
              />
              <LoadProgressSummaryCard
                loadedCount={checked - shorts}
                pendingCount={pending}
                issuesCount={shorts}
                totalOrders={stops.length}
                percentage={percent}
              />
              {shortStop ? (
                <LoadAttentionBanner
                  title="Shortfall reported to dispatch"
                  orderCode={shortStop.order_id}
                  productName={shortStop.shortfall_item}
                  description={`${shortStop.issue_type || 'Shortfall'}: ${shortStop.shortfall_reason || ''}${shortStop.shortfall_units != null ? ` (${shortStop.shortfall_units} units short)` : ''}. The store manager will see this before the delivery arrives.`}
                />
              ) : chilled > 0 && canEdit ? (
                <LoadAttentionBanner
                  title="Cold chain"
                  orderCode={null}
                  description={`${chilled} chilled order${chilled === 1 ? '' : 's'} on this load. Pre-cool ${trip.vehicle_id} and load chilled goods last, straight from the cold room.`}
                />
              ) : null}
              {issues.length > 0 && (
                <div className="load-issues-list">
                  <h4>Issues on this trip</h4>
                  {issues.slice(0, 4).map((i) => (
                    <p key={i.issue_id}>
                      <strong>{i.related_order_id || i.issue_category}</strong> — {i.description}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sticky Bottom Dock */}
        <LoadBottomBar
          loadId={trip.trip_id}
          status={status.status}
          statusType={status.statusType}
          loadedCount={checked}
          totalCount={stops.length}
          actionLabel={action?.label}
          actionDisabled={action?.disabled}
          canEdit={canEdit}
          onReportIssue={() => handleShort(stops.find((s) => !s.verified_at)?.order_id || stops[0]?.order_id)}
          onContinueLoading={handlePrimary}
        />
      </div>

      {toast && (
        <div className={`load-toast tone-${toast.tone}`} role="status">
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>
      )}
    </div>
  )
}
