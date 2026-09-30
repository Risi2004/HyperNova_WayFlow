import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import RecordDeliveryHeader from '../../../components/driver/recordDelivery/RecordDeliveryHeader'
import DeliveryOutletSummaryCard from '../../../components/driver/recordDelivery/DeliveryOutletSummaryCard'
import DeliveryOutcomeSelector from '../../../components/driver/recordDelivery/DeliveryOutcomeSelector'
import OutcomeConfirmationCard from '../../../components/driver/recordDelivery/OutcomeConfirmationCard'
import ProofOfDeliveryFooterCard from '../../../components/driver/recordDelivery/ProofOfDeliveryFooterCard'
import ReportProblemModal from '../../../components/driver/ReportProblemModal'
import './RecordDelivery.css'

export default function RecordDelivery() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const activeTripId = tripId || 'TR-024'

  const [selectedOutcome, setSelectedOutcome] = useState('success')
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleSelectOutcome = (outcome) => {
    if (outcome === 'problem') {
      navigate(`/driver/my-trips/${activeTripId}/report-problem`)
      return
    }
    setSelectedOutcome(outcome)
    setIsConfirmed(false)
  }

  const handleConfirmAndContinue = () => {
    setIsConfirmed(true)
    navigate(`/driver/my-trips/${activeTripId}/proof-of-delivery`)
  }

  const handleContinueProof = () => {
    navigate(`/driver/my-trips/${activeTripId}/proof-of-delivery`)
  }

  const handleReportProblemSubmit = (data) => {
    showToast(`⚠️ Delivery issue recorded: ${data.issueType.toUpperCase()}. Dispatch has been notified.`)
  }

  return (
    <div className="record-delivery-page-container">
      {/* Top Navbar */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Container */}
      <main className="record-delivery-main-content">
        {/* Header & Back Link */}
        <RecordDeliveryHeader
          tripId={activeTripId}
          stopNumber="05"
          totalStops="08"
        />

        {/* Store & Outlet Summary Card */}
        <DeliveryOutletSummaryCard
          storeName="Metro Grocers"
          outletId="OUT043"
          orderId="ORD-1042"
          deliveryWindow="11:00 AM – 11:30 AM"
          route="Peliyagoda → Colombo South"
          vehicle="WP-REF-007"
          badgeText="CURRENT STOP"
        />

        {/* How was this delivery completed? */}
        <DeliveryOutcomeSelector
          selectedOutcome={selectedOutcome}
          onSelectOutcome={handleSelectOutcome}
        />

        {/* Ready to Complete Status Card */}
        <OutcomeConfirmationCard
          outcome={selectedOutcome}
          storeName="Metro Grocers"
          orderId="ORD-1042"
          schedule="Scheduled 11:00–11:30 AM"
          statusBadge={isConfirmed ? 'CONFIRMED' : 'DELIVERED'}
          onConfirmAndContinue={handleConfirmAndContinue}
          onReportProblem={() => navigate(`/driver/my-trips/${activeTripId}/report-problem`)}
        />

        {/* Next: Capture Proof of Delivery Banner */}
        <ProofOfDeliveryFooterCard
          onContinueProof={handleContinueProof}
        />
      </main>

      {/* Report Problem Modal */}
      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportProblemSubmit}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="record-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
