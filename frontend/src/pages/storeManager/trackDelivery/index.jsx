import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import TelemetrySimulatorBar from '../../../components/storeManager/trackDelivery/TelemetrySimulatorBar'
import TrackDeliveryHeroCard from '../../../components/storeManager/trackDelivery/TrackDeliveryHeroCard'
import LifecycleSequenceCard from '../../../components/storeManager/trackDelivery/LifecycleSequenceCard'
import RouteCorridorCard from '../../../components/storeManager/trackDelivery/RouteCorridorCard'
import RouteStopManifestCard from '../../../components/storeManager/trackDelivery/RouteStopManifestCard'
import DockGateActionsCard from '../../../components/storeManager/trackDelivery/DockGateActionsCard'
import AssignedDriverCard from '../../../components/storeManager/trackDelivery/AssignedDriverCard'
import DeliverySlaCard from '../../../components/storeManager/trackDelivery/DeliverySlaCard'
import PayloadBreakdownCard from '../../../components/storeManager/trackDelivery/PayloadBreakdownCard'
import ManifestModal from '../../../components/storeManager/trackDelivery/ManifestModal'
import ReportIssueModal from '../../../components/storeManager/trackDelivery/ReportIssueModal'
import { orderService } from '../../../services/orderService'
import './TrackDelivery.css'

export default function TrackDelivery() {
  const { tripId: routeTripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [currentTripId, setCurrentTripId] = useState(routeTripId || searchParams.get('tripId') || 'TR-024')
  const [currentOrderId, setCurrentOrderId] = useState(searchParams.get('orderId') || 'ORD-1042')
  const [destInfo, setDestInfo] = useState({ name: 'Colombo 05 Store', code: 'OUT043', cycle: 'Morning Fresh Cycle #01' })
  const [driverInfo, setDriverInfo] = useState({ name: 'Marcus Vance', id: 'DRV-091', phone: '+94 11 234 5678' })
  const [vehicleInfo, setVehicleInfo] = useState({ id: 'WP-REF-007', type: 'Isuzu 5T', temp: 'reefer' })

  // Telemetry Simulation State (initialized from real status if available)
  const [simState, setSimState] = useState('in_delivery')
  const [isManifestOpen, setIsManifestOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function loadRealTracking() {
      try {
        let orderId = searchParams.get('orderId')
        let tripId = routeTripId || searchParams.get('tripId')

        if (!orderId && !tripId) {
          const myOrdersRes = await orderService.getMyOrders()
          if (myOrdersRes?.orders && myOrdersRes.orders.length > 0) {
            // Pick active in-transit / planned / delivered order
            const active = myOrdersRes.orders.find((o) => ['dispatched', 'delivered', 'loading', 'planned'].includes(o.status)) || myOrdersRes.orders[0]
            if (active) {
              orderId = active.order_id
              tripId = active.trip_id
            }
          }
        }

        if (orderId) {
          const res = await orderService.getOrder(orderId)
          if (!isMounted || !res?.order) return

          setCurrentOrderId(res.order.order_id)
          if (res.plan?.trip_id) setCurrentTripId(res.plan.trip_id)
          if (res.outlet) {
            setDestInfo({
              name: res.outlet.brand ? `${res.outlet.district} ${res.outlet.brand} Store` : 'Store Outlet',
              code: res.outlet.outlet_id,
              cycle: `${res.order.brand || 'Morning'} Delivery Cycle`,
            })
          }
          if (res.plan) {
            setDriverInfo({
              name: res.plan.driver_name || 'Assigned Driver',
              id: 'DRV-091',
              phone: '+94 11 234 5678',
            })
            setVehicleInfo({
              id: res.plan.vehicle_id || 'VEH-001',
              type: res.plan.vehicle_type || 'Truck',
              temp: res.plan.vehicle_temp || 'ambient',
            })
          }

          if (res.order.status === 'delivered') setSimState('delivered')
          else if (res.order.status === 'dispatched') setSimState('in_delivery')
          else if (res.order.status === 'loading') setSimState('arriving_soon')
        }
      } catch (err) {
        console.warn('Could not load real delivery tracking, using simulation defaults:', err)
      }
    }
    loadRealTracking()
    return () => {
      isMounted = false
    }
  }, [routeTripId, searchParams])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleSelectSimState = (stateId) => {
    setSimState(stateId)
    if (stateId === 'delivered') {
      showToast(`Vehicle ${vehicleInfo.id} arrived at dock! Confirm Receipt unlocked.`)
    } else if (stateId === 'delayed') {
      showToast('Simulation: Traffic delay detected (+35 min). Live ETA shifted to 11:20 AM.')
    } else if (stateId === 'offline') {
      showToast('Simulation: Telemetry offline. Showing last known coordinates from 8m ago.')
    } else if (stateId === 'arriving_soon') {
      showToast('Simulation: Vehicle 2.1 km away. Dock alarm: Arriving in ~3 mins!')
    } else if (stateId === 'error') {
      showToast('Simulation: Sensor alert - Cold storage telemetry re-routing.')
    } else {
      showToast('Simulation: Standard In-Delivery telemetry active.')
    }
  }

  const handleConfirmReceipt = () => {
    if (simState === 'delivered') {
      showToast('Navigating to physical dock inspection & Confirm Receipt...')
      setTimeout(() => {
        navigate(`/store-manager/confirm-receipt?orderId=${encodeURIComponent(currentOrderId)}`)
      }, 700)
    } else {
      showToast('Dock Sensor: Vehicle is still in transit. Switch simulator to Arrived / Delivered to confirm.')
    }
  }

  const handleContactDriver = () => {
    showToast(`Connecting to ${driverInfo.name} via Dispatch Radio (${driverInfo.phone})...`)
  }

  const handleSubmitIssue = (issueType, notes) => {
    showToast(`Escalation (${issueType}) dispatched to Regional Central Control!`)
    navigate(`/store-manager/report-issue?orderId=${encodeURIComponent(currentOrderId)}`)
  }


  return (
    <div className="sm-track-delivery-page">
      {/* Left Sidebar */}
      <StoreManagerSidebar activeItem="Track Delivery" />

      {/* Main Content */}
      <main className="sm-track-delivery-main">
        {/* 1. Prototype Telemetry State Simulator Bar */}
        <TelemetrySimulatorBar
          currentState={simState}
          onSelectState={handleSelectSimState}
          tripId={currentTripId}
        />

        {/* 2. Order Header Strip */}
        <div className="td-order-header-strip">
          <div className="td-order-header-left">
            <span>Order:</span>
            <span className="td-order-code-bold">{currentOrderId}</span>
            <span>&bull; Destination:</span>
            <span className="td-dest-name-bold">{destInfo.name}</span>
            <span className="td-dest-pill">{destInfo.code}</span>
            <span>&bull; Manifest:</span>
            <span className="td-manifest-cycle">{destInfo.cycle}</span>
          </div>

          <div className="td-order-header-right">
            <span className="td-in-delivery-pill">
              <span className="td-status-indicator-dot" />
              <span>
                {simState === 'delivered'
                  ? 'ARRIVED AT DOCK'
                  : simState === 'delayed'
                  ? 'DELAYED IN TRANSIT'
                  : 'IN DELIVERY'}
              </span>
            </span>
          </div>
        </div>

        {/* 3. Hero Card: Estimated Arrival & Real-Time Telemetry */}
        <TrackDeliveryHeroCard
          tripId={currentTripId}
          orderId={currentOrderId}
          simState={simState}
        />

        {/* 4. Delivery Lifecycle Sequence Stepper */}
        <LifecycleSequenceCard simState={simState} />

        {/* 5. Two-Column Main Content */}
        <div className="td-main-cols-layout">
          {/* Left Column: Schematic Corridor + Stop Manifest */}
          <div className="td-left-col">
            <RouteCorridorCard tripId={currentTripId} />
            <RouteStopManifestCard simState={simState} />
          </div>

          {/* Right Column: Dock Actions, Driver, SLA, Payload */}
          <div className="td-right-col">
            <DockGateActionsCard
              orderId={currentOrderId}
              simState={simState}
              onConfirmReceipt={handleConfirmReceipt}
              onViewManifest={() => setIsManifestOpen(true)}
              onReportIssue={() => setIsReportOpen(true)}
              onContactDriver={handleContactDriver}
            />

            <AssignedDriverCard driver={driverInfo} vehicle={vehicleInfo} />

            <DeliverySlaCard simState={simState} />


            <PayloadBreakdownCard />
          </div>
        </div>
      </main>

      {/* Manifest Modal */}
      <ManifestModal
        isOpen={isManifestOpen}
        onClose={() => setIsManifestOpen(false)}
        orderId={currentOrderId}
        tripId={currentTripId}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitIssue={handleSubmitIssue}
        orderId={currentOrderId}
        tripId={currentTripId}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="td-toast-notification">
          <span>{toastMessage}</span>
          <button
            type="button"
            className="btn-td-toast-close"
            onClick={() => setToastMessage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
