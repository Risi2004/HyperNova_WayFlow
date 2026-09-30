import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import ProofHeaderSection from '../../../components/driver/proofOfDelivery/ProofHeaderSection'
import DeliverySummaryStripCard from '../../../components/driver/proofOfDelivery/DeliverySummaryStripCard'
import ProofUploadCard from '../../../components/driver/proofOfDelivery/ProofUploadCard'
import DeliveryConfirmationStatusCard from '../../../components/driver/proofOfDelivery/DeliveryConfirmationStatusCard'
import ProofActionFooter from '../../../components/driver/proofOfDelivery/ProofActionFooter'
import './ProofOfDelivery.css'

export default function ProofOfDelivery() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const activeTripId = tripId || 'TR-024'

  const [uploadedImage, setUploadedImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  const handleImageSelected = (imgData) => {
    setUploadedImage(imgData)
    showToast('✓ Proof photo captured and attached successfully!')
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    showToast('Proof photo removed.')
  }

  const handleSaveProof = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setIsSuccessModalOpen(true)
    }, 600)
  }

  return (
    <div className="proof-page-container">
      {/* Top Navbar */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Page Content */}
      <main className="proof-main-content">
        {/* Header Breadcrumb & Status */}
        <ProofHeaderSection
          tripId={activeTripId}
          stopNumber="05"
          totalStops="08"
          isOnline={true}
        />

        {/* 5-Column Summary Strip */}
        <DeliverySummaryStripCard
          outlet="Metro Grocers (OUT043)"
          order="ORD-1042"
          status="DELIVERED"
          deliveryWindow="11:00 AM – 11:30 AM"
          vehicle="WP-REF-007"
        />

        {/* Two-Column Grid: Upload + Confirmation */}
        <div className="proof-content-grid">
          {/* Left Column: Proof Upload */}
          <div className="proof-left-column">
            <ProofUploadCard
              uploadedImage={uploadedImage}
              onImageSelected={handleImageSelected}
              onRemoveImage={handleRemoveImage}
            />
          </div>

          {/* Right Column: Confirmation Status Steps */}
          <aside className="proof-right-column">
            <DeliveryConfirmationStatusCard
              hasProof={Boolean(uploadedImage)}
              outletName="Metro Grocers"
              orderId="ORD-1042"
            />
          </aside>
        </div>

        {/* Bottom Actions */}
        <ProofActionFooter
          tripId={activeTripId}
          isSaveEnabled={Boolean(uploadedImage)}
          onSaveProof={handleSaveProof}
          isSaving={isSaving}
        />
      </main>

      {/* Completed Stop Success Modal */}
      {isSuccessModalOpen && (
        <div className="delivery-success-modal-backdrop">
          <div className="delivery-success-modal-box">
            <div className="success-modal-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="success-modal-title">Stop 05 Completed!</h3>
            <p className="success-modal-description">
              Proof of delivery for <strong>Metro Grocers (OUT043)</strong> has been recorded and synchronized with dispatch central.
            </p>
            <div className="success-modal-actions">
              <button
                type="button"
                className="btn-modal-back-trips"
                onClick={() => navigate(`/driver/my-trips/${activeTripId}`)}
              >
                Back to Trip {activeTripId}
              </button>
              <button
                type="button"
                className="btn-modal-next-stop"
                onClick={() => navigate(`/driver/my-trips/${activeTripId}`)}
              >
                Continue to Next Stop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="proof-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
