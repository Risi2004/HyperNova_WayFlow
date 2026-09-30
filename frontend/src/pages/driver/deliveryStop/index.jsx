import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import StopHeaderBanner from '../../../components/driver/deliveryStop/StopHeaderBanner'
import StopOrderInfoCard from '../../../components/driver/deliveryStop/StopOrderInfoCard'
import StopInstructionsCard from '../../../components/driver/deliveryStop/StopInstructionsCard'
import StopPreChecklistCard from '../../../components/driver/deliveryStop/StopPreChecklistCard'
import OutletDetailsCard from '../../../components/driver/deliveryStop/OutletDetailsCard'
import DeliveryWindowCard from '../../../components/driver/deliveryStop/DeliveryWindowCard'
import TripContextCard from '../../../components/driver/deliveryStop/TripContextCard'
import ProofOfDeliveryCard from '../../../components/driver/deliveryStop/ProofOfDeliveryCard'
import ReportProblemModal from '../../../components/driver/ReportProblemModal'
import './DeliveryStop.css'

const DEFAULT_ORDER_ITEMS = [
  { name: 'Fresh Milk', quantity: '12 units' },
  { name: 'Yogurt', quantity: '10 units' },
  { name: 'Butter', quantity: '8 units' },
  { name: 'Cheese', quantity: '6 units' },
  { name: 'Juice', quantity: '6 units' },
]

const INITIAL_CHECKLIST = [
  { id: 1, label: 'Correct outlet verified', checked: true },
  { id: 2, label: 'Delivery window checked and matched', checked: true },
  { id: 3, label: 'Order information reviewed and items counted', checked: true },
  { id: 4, label: 'Delivery instructions reviewed completely', checked: true },
]

export default function DeliveryStop() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const activeTripId = tripId || 'TR-024'

  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isRecorded, setIsRecorded] = useState(false)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleToggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const handleRecordDelivery = () => {
    const allChecked = checklist.every((item) => item.checked)
    if (!allChecked) {
      showToast('⚠️ Please verify and confirm all checklist items before recording.')
      return
    }
    setIsRecorded(true)
    showToast('✓ Delivery recorded successfully! Ready for Proof of Delivery.')
  }

  const handleContinueProof = () => {
    showToast('Redirecting to Proof of Delivery upload / signature capture...')
  }

  const handleOpenNavigation = () => {
    showToast('Opening GPS route navigation to Metro Grocers (OUT043)...')
  }

  const handleReportProblemSubmit = (data) => {
    showToast(`⚠️ Problem reported to dispatch: ${data.issueType.toUpperCase()}`)
  }

  return (
    <div className="delivery-stop-page-container">
      {/* Top Navigation */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Stop Content */}
      <main className="delivery-stop-main-content">
        {/* Banner with Breadcrumb & Hero Card */}
        <StopHeaderBanner
          tripId={activeTripId}
          stopNumber="05"
          totalStops="08"
          storeName="Metro Grocers (OUT043)"
          deliveryWindow="11:00 AM - 11:30 AM"
          status={isRecorded ? 'Delivery Recorded' : 'Pending Delivery'}
        />

        {/* 2-Column Grid Layout */}
        <div className="delivery-stop-grid">
          {/* Left Column (Main Stop Data) */}
          <div className="stop-left-column">
            {/* Order Information Card */}
            <StopOrderInfoCard
              orderCode="ORD-1042"
              items={DEFAULT_ORDER_ITEMS}
              totalUnits="42 units"
              isRefrigerated={true}
            />

            {/* Delivery Instructions Card */}
            <StopInstructionsCard
              instructions="Use the rear receiving entrance. Ask for the outlet manager before unloading. Keep refrigerated items inside the cold storage area."
            />

            {/* Before Recording Delivery Checklist */}
            <StopPreChecklistCard
              checks={checklist}
              onToggleCheck={handleToggleCheck}
            />

            {/* Bottom Actions Row */}
            <div className="stop-bottom-actions-row">
              <button
                type="button"
                className="btn-record-delivery-primary"
                onClick={handleRecordDelivery}
              >
                {isRecorded ? 'Delivery Recorded ✓' : 'Record Delivery'}
              </button>

              <button
                type="button"
                className="btn-report-stop-problem"
                onClick={() => setIsReportModalOpen(true)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Report Problem</span>
              </button>
            </div>
          </div>

          {/* Right Column (Sidebar Cards) */}
          <aside className="stop-right-column">
            {/* Outlet Details */}
            <OutletDetailsCard
              storeName="Metro Grocers"
              storeCode="Code: OUT043"
              district="Colombo 05"
              address="125 Main Street, Colombo 05"
              contactPerson="Outlet Manager"
              role="Contact Person"
              phone="+94 11 234 5678"
              onOpenNavigation={handleOpenNavigation}
            />

            {/* Delivery Window */}
            <DeliveryWindowCard
              windowTime="11:00 AM - 11:30 AM"
              statusText="Scheduled - Starts in 15 mins"
            />

            {/* Trip Context */}
            <TripContextCard
              tripId={activeTripId}
              route="Peliyagoda → Colombo South"
              vehicle="WP-REF-007"
              progressText="4 / 8 stops completed"
            />

            {/* Proof of Delivery */}
            <ProofOfDeliveryCard
              onContinueProof={handleContinueProof}
            />
          </aside>
        </div>
      </main>

      {/* Report Problem Modal */}
      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportProblemSubmit}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="stop-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
