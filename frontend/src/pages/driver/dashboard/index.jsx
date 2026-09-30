import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSubheader from '../../../components/driver/DriverSubheader'
import TodayTripCard from '../../../components/driver/TodayTripCard'
import DeliveryProgressCard from '../../../components/driver/DeliveryProgressCard'
import CurrentStopHeroCard from '../../../components/driver/CurrentStopHeroCard'
import ImportantWarningsCard from '../../../components/driver/ImportantWarningsCard'
import LiveRouteUpdatesCard from '../../../components/driver/LiveRouteUpdatesCard'
import QuickDriverActionsCard from '../../../components/driver/QuickDriverActionsCard'
import TodayStopsTimelineCard from '../../../components/driver/TodayStopsTimelineCard'
import CallDispatchModal from '../../../components/driver/CallDispatchModal'
import './DriverDashboard.css'

const INITIAL_STOPS = [
  {
    id: 1,
    stopNumber: '01',
    name: 'Waypoint Fresh',
    location: 'Colombo 03',
    time: '08:30 AM',
    status: 'completed',
  },
  {
    id: 2,
    stopNumber: '02',
    name: 'Waypoint Style',
    location: 'Bambalapitiya',
    time: '08:45 AM',
    status: 'completed',
  },
  {
    id: 3,
    stopNumber: '03',
    name: 'Waypoint Tech',
    location: 'Wellawatte',
    time: '09:15 AM',
    status: 'completed',
  },
  {
    id: 4,
    stopNumber: '04',
    name: 'Waypoint Fresh',
    location: 'Dehiwala',
    time: '09:50 AM',
    status: 'completed',
  },
  {
    id: 5,
    stopNumber: '05',
    name: 'Waypoint Fresh',
    location: 'Colombo 04',
    time: '10:42 AM',
    status: 'current',
  },
  {
    id: 6,
    stopNumber: '06',
    name: 'Waypoint Fresh',
    location: 'Mount Lavinia',
    time: '--:--',
    status: 'upcoming',
  },
  {
    id: 7,
    stopNumber: '07',
    name: 'Waypoint Market',
    location: 'Moratuwa',
    time: '--:--',
    status: 'upcoming',
  },
  {
    id: 8,
    stopNumber: '08',
    name: 'Waypoint Fresh',
    location: 'Panadura',
    time: '--:--',
    status: 'upcoming',
  },
]

export default function DriverDashboard() {
  const navigate = useNavigate()
  const [stops, setStops] = useState(INITIAL_STOPS)
  const [isOffline, setIsOffline] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showDispatchModal, setShowDispatchModal] = useState(false)

  // Show temporary toast feedback
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Handlers
  const handleContinueTrip = () => {
    triggerToast('Navigation continuing along Colombo South Corridor. Next stop: Colombo 04.')
  }

  const handleStartChecklist = () => {
    triggerToast('Stop 05 checklist loaded. Verify cartons and customer receiving sign-off.')
  }

  const handleViewRouteMap = () => {
    triggerToast('Opening turn-by-turn route telemetry map...')
  }

  const handleNextStop = () => {
    triggerToast('Advancing preview to Stop 06 (Mount Lavinia).')
  }

  const handleReportProblem = () => {
    navigate('/driver/my-trips/TR-024/report-problem')
  }

  const handleCallDispatch = () => {
    setShowDispatchModal(true)
  }

  const handleViewHistory = () => {
    triggerToast('Loading past completed routes and historical driver logs...')
  }

  const handleToggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev
      triggerToast(next ? 'Switched to Offline Mode. Route cache active.' : 'Reconnected to WayFlow Live Telematics.')
      return next
    })
  }

  const handleSelectStop = (stop) => {
    triggerToast(`Inspecting details for Stop ${stop.stopNumber} (${stop.name} - ${stop.location}).`)
  }

  const handleNotificationClick = () => {
    triggerToast('No urgent dispatch broadcast flags. Route running on schedule.')
  }

  return (
    <div className="driver-dashboard-container">
      {/* Top Navbar */}
      <DriverNavbar activeTab="Dashboard" />

      {/* Main Content Area */}
      <main className="driver-dashboard-main">
        {/* Subheader: Greeting, Online Badge, Notification Bell */}
        <DriverSubheader
          driverName="Kasun"
          dateText="Sunday, 27 September 2026"
          isOnline={!isOffline}
          onNotificationClick={handleNotificationClick}
        />

        {/* Action Toast Alert Banner */}
        {toastMessage && (
          <div className="driver-toast-banner" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Two-Column Grid */}
        <div className="driver-dashboard-grid">
          {/* Left Column (68%) */}
          <div className="driver-left-column">
            {/* Row 1: Today's Trip & Delivery Progress */}
            <div className="driver-top-two-cards">
              <TodayTripCard
                tripId="TR-024"
                vehicle="WP-REF-007 (Refrigerated)"
                route="Peliyagoda → Colombo South"
                departureTime="06:00 AM"
                status="In Progress"
                onContinueTrip={handleContinueTrip}
              />

              <DeliveryProgressCard
                completedStops={4}
                totalStops={8}
                currentStopNumber="05"
              />
            </div>

            {/* Row 2: Current Stop Hero Card */}
            <CurrentStopHeroCard
              stopNumber="05"
              totalStops="08"
              storeName="Waypoint Fresh — Colombo 04"
              orderId="OUT-042"
              address="No. 125, Galle Road, Colombo 04"
              deliveryWindow="10:30 AM - 11:00 AM"
              expectedArrival="10:52 AM (In Window)"
              instructions="Use the rear entrance. Receiving area is available from 10:00 AM. Contact manager if gate is locked."
              onStartChecklist={handleStartChecklist}
              onViewRouteMap={handleViewRouteMap}
              onNextStop={handleNextStop}
            />

            {/* Row 3: Important Information & Warnings */}
            <ImportantWarningsCard />

            {/* Row 4: Live Route Updates & Quick Driver Actions */}
            <div className="driver-bottom-two-cards">
              <LiveRouteUpdatesCard />

              <QuickDriverActionsCard
                onReportProblem={handleReportProblem}
                onCallDispatch={handleCallDispatch}
                onViewHistory={handleViewHistory}
                onToggleOffline={handleToggleOffline}
                isOffline={isOffline}
              />
            </div>
          </div>

          {/* Right Column: Today's Stops Timeline (32%) */}
          <div className="driver-right-column">
            <TodayStopsTimelineCard
              stops={stops}
              onSelectStop={handleSelectStop}
            />
          </div>
        </div>
      </main>

      {/* Interactive Modals */}
      <CallDispatchModal
        isOpen={showDispatchModal}
        onClose={() => setShowDispatchModal(false)}
      />
    </div>
  )
}
