import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import ProofHeaderSection from '../../../components/driver/proofOfDelivery/ProofHeaderSection'
import DeliverySummaryStripCard from '../../../components/driver/proofOfDelivery/DeliverySummaryStripCard'
import ProofUploadCard from '../../../components/driver/proofOfDelivery/ProofUploadCard'
import DeliveryConfirmationStatusCard from '../../../components/driver/proofOfDelivery/DeliveryConfirmationStatusCard'
import ProofActionFooter from '../../../components/driver/proofOfDelivery/ProofActionFooter'
import { useConnectivity } from '../../../hooks/useConnectivity'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { driverActions } from '../../../services/driverData'
import { formatTime } from '../../../utils/orderFormat'
import { compressImage } from '../../../utils/tripFormat'
import './ProofOfDelivery.css'

export default function ProofOfDelivery() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { online } = useConnectivity()
  const { data, error } = useDriverTrip(tripId)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [receivedBy, setReceivedBy] = useState('')
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4500)
  }

  const trip = data?.trip
  const stops = data?.stops || []
  const stop = stops.find((s) => s.order_id === searchParams.get('order')) || currentStopOf(stops)
  const outcome = searchParams.get('outcome') === 'partial' || stop?.shortfall_flag ? 'partial' : 'delivered'
  const nextStop = stop && stops.find((s) => s.stop_sequence > stop.stop_sequence && !DONE.includes(s.stop_status))

  const handleSaveProof = async () => {
    if (!receivedBy.trim()) {
      showToast('Enter the name of the person who received the goods.')
      return
    }
    setIsSaving(true)
    try {
      const photo = await compressImage(uploadedImage.previewUrl)
      const res = await driverActions.deliver(tripId, stop.order_id, {
        outcome,
        received_by_name: receivedBy.trim(),
        notes: notes.trim() || (outcome === 'partial' ? `Part delivery: ${stop.shortfall_reason || 'loaded short'}` : ''),
        photo,
        arrived_at: stop.actual_arrival_time && String(stop.actual_arrival_time).includes('T') ? stop.actual_arrival_time : undefined,
      })
      setSaved({ synced: res.synced })
    } catch (err) {
      showToast(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="proof-page-container">
      <DriverNavbar activeTab="My Trips" />

      <main className="proof-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />
        {error && !trip && <p className="driver-page-state error">{error}</p>}

        {trip && stop && (
          <>
            {/* Header Breadcrumb & Status */}
            <ProofHeaderSection
              tripId={tripId}
              stopNumber={String(stop.stop_sequence).padStart(2, '0')}
              totalStops={String(stops.length).padStart(2, '0')}
              isOnline={online}
            />

            {/* Summary Strip */}
            <DeliverySummaryStripCard
              outlet={`Waypoint ${stop.brand} (${stop.outlet_id})`}
              order={stop.order_id}
              status={outcome === 'partial' ? 'PART DELIVERED' : 'DELIVERED'}
              deliveryWindow={`${formatTime(stop.requested_window_open)} – ${formatTime(stop.requested_window_close)}`}
              vehicle={trip.vehicle_id}
            />

            {/* Two-Column Grid: Upload + Confirmation */}
            <div className="proof-content-grid">
              <div className="proof-left-column">
                <ProofUploadCard
                  uploadedImage={uploadedImage}
                  onImageSelected={(img) => {
                    setUploadedImage(img)
                    showToast('✓ Proof photo attached.')
                  }}
                  onRemoveImage={() => setUploadedImage(null)}
                />
                <div className="driver-inline-field">
                  <label htmlFor="pod-received-by">Received by (name) *</label>
                  <input
                    id="pod-received-by"
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder={stop.manager_name || 'Name of the person signing'}
                    autoComplete="off"
                  />
                </div>
                <div className="driver-inline-field">
                  <label htmlFor="pod-notes">Notes {outcome === 'partial' ? '(what was short)' : '(optional)'}</label>
                  <textarea id="pod-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>

              <aside className="proof-right-column">
                <DeliveryConfirmationStatusCard hasProof={Boolean(uploadedImage)} outletName={`Waypoint ${stop.brand}`} orderId={stop.order_id} />
              </aside>
            </div>

            {/* Bottom Actions */}
            <ProofActionFooter
              tripId={tripId}
              isSaveEnabled={Boolean(uploadedImage) && Boolean(receivedBy.trim()) && !DONE.includes(stop.stop_status)}
              onSaveProof={handleSaveProof}
              isSaving={isSaving}
            />
          </>
        )}
      </main>

      {/* Completed Stop Modal */}
      {saved && stop && (
        <div className="delivery-success-modal-backdrop">
          <div className="delivery-success-modal-box">
            <div className="success-modal-icon-circle">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="success-modal-title">Stop {String(stop.stop_sequence).padStart(2, '0')} Completed!</h3>
            <p className="success-modal-description">
              {saved.synced
                ? <>Proof of delivery for <strong>{stop.outlet_id}</strong> is recorded and the store manager can now confirm receipt.</>
                : <>No signal: proof of delivery for <strong>{stop.outlet_id}</strong> is saved on this device with the time you delivered. It will sync automatically when you are back in coverage.</>}
            </p>
            <div className="success-modal-actions">
              <button type="button" className="btn-modal-back-trips" onClick={() => navigate(`/driver/my-trips/${tripId}`)}>
                Back to Trip
              </button>
              <button
                type="button"
                className="btn-modal-next-stop"
                onClick={() => navigate(nextStop ? `/driver/my-trips/${tripId}/delivery-stop?order=${nextStop.order_id}` : '/driver/dashboard')}
              >
                {nextStop ? 'Continue to Next Stop' : 'Finish Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="proof-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
