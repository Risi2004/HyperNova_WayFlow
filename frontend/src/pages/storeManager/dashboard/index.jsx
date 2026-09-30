import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import SimulationStateBar from '../../../components/storeManager/SimulationStateBar'
import StoreManagerMetricsCards from '../../../components/storeManager/StoreManagerMetricsCards'
import NextDeliveryHeroCard from '../../../components/storeManager/NextDeliveryHeroCard'
import CurrentOrdersTable from '../../../components/storeManager/CurrentOrdersTable'
import ScheduledDeliveriesCard from '../../../components/storeManager/ScheduledDeliveriesCard'
import DeferredOrdersCard from '../../../components/storeManager/DeferredOrdersCard'
import RecentlyReceivedCard from '../../../components/storeManager/RecentlyReceivedCard'
import QuickActionsCard from '../../../components/storeManager/QuickActionsCard'
import './StoreManagerDashboard.css'

export default function StoreManagerDashboard() {
  const navigate = useNavigate()
  const [simulationState, setSimulationState] = useState('active')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSelectSimState = (stateId) => {
    setSimulationState(stateId)
    if (stateId === 'loading') {
      showToast('Simulation: Rendering Skeleton Loading State...')
    } else if (stateId === 'empty') {
      showToast('Simulation: Switched to Zero-Order Outlet Empty State.')
    } else if (stateId === 'alerts') {
      showToast('Simulation: High Alert Escalations Active (3 Deferred Orders).')
    } else {
      showToast('Simulation: Standard Active Store View.')
    }
  }

  const handleTrackGPS = () => {
    showToast('Opening Live GPS Telemetry for Vehicle WP-REF-007 (Driver Marcus Vance)...')
  }

  const handleContactDispatch = () => {
    showToast('Connecting to Regional Central Dispatch (+94 11 234 5670)...')
  }

  const handleViewManifest = () => {
    showToast('Loading Manifest for Trip TR-024 (18 items for Colombo 05 Store)...')
  }

  const handleViewOrder = (order) => {
    showToast(`Inspecting Order details for ${order.id} (${order.status})...`)
  }

  const handleAssignDriver = (order) => {
    showToast(`Driver contact for ${order.id}: Marcus Vance (Refrigerated Truck).`)
  }

  return (
    <div className="sm-dashboard-container">
      {/* Left Sidebar Navigation */}
      <StoreManagerSidebar activeItem="Dashboard" />

      {/* Main Store Manager Dashboard Content */}
      <main className="sm-dashboard-main">
        {/* Simulation State Bar */}
        <SimulationStateBar
          currentState={simulationState}
          onSelectState={handleSelectSimState}
        />

        {/* 4 Metric Summary Cards */}
        <StoreManagerMetricsCards
          activeOrders={simulationState === 'empty' ? '00' : '06'}
          scheduledDeliveries={simulationState === 'empty' ? '00' : '04'}
          nextEta={simulationState === 'empty' ? '--:--' : '10:45 AM'}
          nextEtaSub={simulationState === 'empty' ? 'No pending runs' : 'Today • Trip TR-024'}
          deferredOrders={simulationState === 'alerts' ? '03' : '02'}
        />

        {/* Next Delivery Hero Card */}
        <NextDeliveryHeroCard
          tripId="TR-024"
          dispatchRun="Dispatch Run #04"
          orderId="ORD-1042"
          destination="Colombo 05 Store"
          windowTime="10:30 AM - 11:00 AM"
          vehicle="Refrigerated (WP-REF-007)"
          driverName="Marcus Vance"
          expectedArrival="10:45 AM"
          etaMinutes="32 min"
          currentLocation="Havelock Road junction"
          onTrackGPS={handleTrackGPS}
          onContactDispatch={handleContactDispatch}
          onViewManifest={handleViewManifest}
        />

        {/* Current Orders Table */}
        <CurrentOrdersTable
          onViewOrder={handleViewOrder}
          onAssignDriver={handleAssignDriver}
        />

        {/* Lower Two-Column Section */}
        <div className="sm-lower-grid">
          {/* Left Column: Scheduled Deliveries + Recently Received */}
          <div className="sm-lower-col">
            <ScheduledDeliveriesCard />
            <RecentlyReceivedCard />
          </div>

          {/* Right Column: Deferred Orders + Quick Actions */}
          <div className="sm-lower-col">
            <DeferredOrdersCard />
            <QuickActionsCard
              storeName="Store #05 — Colombo Central"
              operatingHours="Operating Hours 07:00 - 22:00 • Cold storage ready"
              onCreateOrder={() => showToast('Redirecting to Store Manager Order Creation form...')}
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
