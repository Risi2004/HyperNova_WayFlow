import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import ReportProblemHeader from '../../../components/driver/reportProblem/ReportProblemHeader'
import TripInfoStripCard from '../../../components/driver/reportProblem/TripInfoStripCard'
import ProblemCategoryGrid from '../../../components/driver/reportProblem/ProblemCategoryGrid'
import ProblemDescriptionCard from '../../../components/driver/reportProblem/ProblemDescriptionCard'
import AffectedDeliveryCard from '../../../components/driver/reportProblem/AffectedDeliveryCard'
import ImpactOnTripCard from '../../../components/driver/reportProblem/ImpactOnTripCard'
import ReportProblemSuccessModal from '../../../components/driver/reportProblem/ReportProblemSuccessModal'
import './ReportProblem.css'

export default function ReportProblem() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const activeTripId = tripId || 'TR-024'

  const [selectedCategory, setSelectedCategory] = useState('refused')
  const [description, setDescription] = useState(
    'The outlet manager refused the delivery because the receiving area was closed. Please advise whether to wait or proceed to the next stop.'
  )
  const [selectedImpact, setSelectedImpact] = useState('delay')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const categoryLabels = {
    closed: 'Outlet Closed',
    refused: 'Delivery Refused',
    missing: 'Missing Items',
    damaged: 'Damaged Items',
    incorrect: 'Incorrect Order',
    window: 'Delivery Window Issue',
    vehicle: 'Vehicle Problem',
    access: 'Road/Access Problem',
    other: 'Other Issue',
  }

  const handleSubmitProblem = (e) => {
    e.preventDefault()
    setIsSuccessModalOpen(true)
    showToast('⚠️ Problem reported and broadcasted to dispatch controller.')
  }

  const handleCancel = () => {
    navigate(`/driver/my-trips/${activeTripId}/delivery-stop`)
  }

  return (
    <div className="report-problem-page-container">
      {/* Top Navbar */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Content */}
      <main className="report-problem-main-content">
        {/* Header Breadcrumb & Status */}
        <ReportProblemHeader
          tripId={activeTripId}
          isOnline={true}
        />

        {/* Trip Info Strip Card */}
        <TripInfoStripCard
          tripId={activeTripId}
          route="Peliyagoda → Colombo South"
          vehicle="WP-REF-007"
          stop="05 of 08"
          currentOutlet="Metro Grocers OUT043"
        />

        {/* Two-Column Form Layout */}
        <form onSubmit={handleSubmitProblem} className="report-content-grid">
          {/* Left Column: Categories + Description */}
          <div className="report-left-column">
            <ProblemCategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => setSelectedCategory(id)}
            />

            <ProblemDescriptionCard
              value={description}
              onChange={(val) => setDescription(val)}
            />
          </div>

          {/* Right Column: Affected Delivery + Impact */}
          <aside className="report-right-column">
            <AffectedDeliveryCard
              orderId="ORD-1042"
              outletName="Metro Grocers"
              stopPosition="Stop 05/08"
              deliveryWindow="11:00 AM – 11:30 AM"
              statusBadge="STALLED OUTCOME"
            />

            <ImpactOnTripCard
              selectedImpact={selectedImpact}
              onSelectImpact={(id) => setSelectedImpact(id)}
            />
          </aside>
        </form>

        {/* Bottom Actions Row */}
        <div className="report-bottom-actions-row">
          <button
            type="button"
            className="btn-report-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-submit-problem-primary"
            onClick={handleSubmitProblem}
          >
            Submit Problem
          </button>
        </div>
      </main>

      {/* Success Modal Confirmation */}
      <ReportProblemSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        tripId={activeTripId}
        problemType={categoryLabels[selectedCategory] || 'Delivery Issue'}
        outletName="Metro Grocers (OUT043)"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="report-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
