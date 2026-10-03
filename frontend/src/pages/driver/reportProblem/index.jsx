import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import ReportProblemHeader from '../../../components/driver/reportProblem/ReportProblemHeader'
import TripInfoStripCard from '../../../components/driver/reportProblem/TripInfoStripCard'
import ProblemCategoryGrid from '../../../components/driver/reportProblem/ProblemCategoryGrid'
import ProblemDescriptionCard from '../../../components/driver/reportProblem/ProblemDescriptionCard'
import AffectedDeliveryCard from '../../../components/driver/reportProblem/AffectedDeliveryCard'
import ImpactOnTripCard from '../../../components/driver/reportProblem/ImpactOnTripCard'
import ReportProblemSuccessModal from '../../../components/driver/reportProblem/ReportProblemSuccessModal'
import { useConnectivity } from '../../../hooks/useConnectivity'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { driverActions } from '../../../services/driverData'
import { formatTime } from '../../../utils/orderFormat'
import './ReportProblem.css'

const CATEGORY_LABELS = {
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
// These mean the goods could not be handed over: the stop is recorded as not delivered.
const NOT_DELIVERED = ['closed', 'refused']

export default function ReportProblem() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { online } = useConnectivity()
  const { data, error } = useDriverTrip(tripId)
  const [selectedCategory, setSelectedCategory] = useState('closed')
  const [description, setDescription] = useState('')
  const [selectedImpact, setSelectedImpact] = useState('stop')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4500)
  }

  const trip = data?.trip
  const stops = data?.stops || []
  const stop = stops.find((s) => s.order_id === searchParams.get('order')) || currentStopOf(stops)

  const handleSubmitProblem = async (e) => {
    e?.preventDefault()
    if (!description.trim()) {
      showToast('Describe what happened so dispatch can act on it.')
      return
    }
    setIsSubmitting(true)
    try {
      const res = await driverActions.reportProblem(tripId, {
        order_id: stop && !DONE.includes(stop.stop_status) ? stop.order_id : null,
        category: selectedCategory,
        impact: selectedImpact,
        description: description.trim(),
      })
      setResult({ synced: res.synced })
    } catch (err) {
      showToast(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stopLabel = stop ? `${String(stop.stop_sequence).padStart(2, '0')} of ${String(stops.length).padStart(2, '0')}` : '—'

  return (
    <div className="report-problem-page-container">
      <DriverNavbar activeTab="My Trips" />

      <main className="report-problem-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />
        <ReportProblemHeader tripId={tripId} isOnline={online} />
        {error && !trip && <p className="driver-page-state error">{error}</p>}

        {trip && (
          <>
            <TripInfoStripCard
              tripId={tripId}
              route={`${trip.depot} → ${trip.district}`}
              vehicle={trip.vehicle_id}
              stop={stopLabel}
              currentOutlet={stop ? `Waypoint ${stop.brand} ${stop.outlet_id}` : 'Between stops'}
            />

            <form onSubmit={handleSubmitProblem} className="report-content-grid">
              <div className="report-left-column">
                <ProblemCategoryGrid selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                <ProblemDescriptionCard value={description} onChange={setDescription} />
                {NOT_DELIVERED.includes(selectedCategory) && stop && (
                  <p className="driver-page-state">
                    {stop.order_id} will be recorded as <strong>not delivered</strong> and returned to dispatch to re-plan.
                  </p>
                )}
              </div>

              <aside className="report-right-column">
                {stop && (
                  <AffectedDeliveryCard
                    orderId={stop.order_id}
                    outletName={`Waypoint ${stop.brand} (${stop.outlet_id})`}
                    stopPosition={`Stop ${stopLabel.replace(' of ', '/')}`}
                    deliveryWindow={`${formatTime(stop.requested_window_open)} – ${formatTime(stop.requested_window_close)}`}
                    statusBadge={NOT_DELIVERED.includes(selectedCategory) ? 'NOT DELIVERED' : 'ISSUE REPORTED'}
                  />
                )}
                <ImpactOnTripCard selectedImpact={selectedImpact} onSelectImpact={setSelectedImpact} />
              </aside>
            </form>

            <div className="report-bottom-actions-row">
              <button
                type="button"
                className="btn-report-cancel"
                onClick={() => navigate(`/driver/my-trips/${tripId}/delivery-stop${stop ? `?order=${stop.order_id}` : ''}`)}
              >
                Cancel
              </button>
              <button type="button" className="btn-submit-problem-primary" onClick={handleSubmitProblem} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit Problem'}
              </button>
            </div>
          </>
        )}
      </main>

      <ReportProblemSuccessModal
        isOpen={Boolean(result)}
        onClose={() => setResult(null)}
        tripId={tripId}
        problemType={`${CATEGORY_LABELS[selectedCategory] || 'Delivery Issue'}${result && !result.synced ? ' (saved offline — will sync)' : ''}`}
        outletName={stop ? `Waypoint ${stop.brand} (${stop.outlet_id})` : trip?.trip_id}
      />

      {toastMessage && (
        <div className="report-action-toast">
          <span>{toastMessage}</span>
          <button type="button" className="btn-toast-dismiss" onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
