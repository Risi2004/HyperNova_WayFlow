import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
import './TrackDelivery.css'

export default function TrackDelivery() {
  const { tripId: routeTripId } = useParams()
  const navigate = useNavigate()

  const currentTripId = routeTripId || 'TR-024'
  const currentOrderId = 'ORD-1042'

  // Telemetry Simulation State
  const [simState, setSimState] = useState('in_delivery')
  const [isManifestOpen, setIsManifestOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleSelectSimState = (stateId) => {
    setSimState(stateId)
    if (stateId === 'delivered') {
      showToast('Simulation: Vehicle WP-REF-007 arrived at Bay 02! Confirm Receipt unlocked.')
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
      showToast('Physical dock handover verified! Electronic Proof of Delivery created.')
      setTimeout(() => {
        navigate('/store-manager/dashboard')
      }, 1800)
    } else {
      showToast('Dock Bay 02 Sensor: Confirmation locked until vehicle docks at Bay 02.')
    }
  }

  const handleContactDriver = () => {
    showToast('Connecting to Marcus Vance via Direct Radio +94 11 234 5678 (Channel 4)...')
  }

  const handleSubmitIssue = (issueType, notes) => {
    showToast(`Escalation (${issueType}) dispatched to Regional Central Control!`)
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
            <span className="td-dest-name-bold">Colombo 05 Store</span>
            <span className="td-dest-pill">OUT043</span>
            <span>&bull; Manifest:</span>
            <span className="td-manifest-cycle">Morning Fresh Cycle #01</span>
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

            <AssignedDriverCard />

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
