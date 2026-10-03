import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import RecordDeliveryHeader from '../../../components/driver/recordDelivery/RecordDeliveryHeader'
import DeliveryOutletSummaryCard from '../../../components/driver/recordDelivery/DeliveryOutletSummaryCard'
import DeliveryOutcomeSelector from '../../../components/driver/recordDelivery/DeliveryOutcomeSelector'
import OutcomeConfirmationCard from '../../../components/driver/recordDelivery/OutcomeConfirmationCard'
import ProofOfDeliveryFooterCard from '../../../components/driver/recordDelivery/ProofOfDeliveryFooterCard'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { formatTime } from '../../../utils/orderFormat'
import './RecordDelivery.css'

export default function RecordDelivery() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { data, error } = useDriverTrip(tripId)
  const [selectedOutcome, setSelectedOutcome] = useState('success')

  const trip = data?.trip
  const stops = data?.stops || []
  const stop = stops.find((s) => s.order_id === searchParams.get('order')) || currentStopOf(stops)
  const q = stop ? `?order=${stop.order_id}` : ''
  // A short-loaded order can only be part-delivered.
  const outcome = stop?.shortfall_flag ? 'partial' : 'delivered'

  const handleSelectOutcome = (choice) => {
    if (choice === 'problem') {
      navigate(`/driver/my-trips/${tripId}/report-problem${q}`)
      return
    }
    setSelectedOutcome(choice)
  }

  const goToProof = () => navigate(`/driver/my-trips/${tripId}/proof-of-delivery${q}&outcome=${outcome}`)

  return (
    <div className="record-delivery-page-container">
      <DriverNavbar activeTab="My Trips" />

      <main className="record-delivery-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />
        {error && !trip && <p className="driver-page-state error">{error}</p>}
        {trip && !stop && <p className="driver-page-state">Every stop on {tripId} is recorded.</p>}

        {trip && stop && (
          <>
            <RecordDeliveryHeader
              tripId={tripId}
              stopNumber={String(stop.stop_sequence).padStart(2, '0')}
              totalStops={String(stops.length).padStart(2, '0')}
            />

            {/* Store & Outlet Summary Card */}
            <DeliveryOutletSummaryCard
              storeName={`Waypoint ${stop.brand} — ${stop.district}`}
              outletId={stop.outlet_id}
              orderId={stop.order_id}
              deliveryWindow={`${formatTime(stop.requested_window_open)} – ${formatTime(stop.requested_window_close)}`}
              route={`${trip.depot} → ${trip.district}`}
              vehicle={trip.vehicle_id}
              badgeText={DONE.includes(stop.stop_status) ? 'RECORDED' : 'CURRENT STOP'}
            />

            {/* How was this delivery completed? */}
            <DeliveryOutcomeSelector selectedOutcome={selectedOutcome} onSelectOutcome={handleSelectOutcome} />

            {/* Ready to Complete Status Card */}
            <OutcomeConfirmationCard
              outcome={selectedOutcome}
              storeName={`Waypoint ${stop.brand} (${stop.outlet_id})`}
              orderId={stop.order_id}
              schedule={`Window ${formatTime(stop.requested_window_open)}–${formatTime(stop.requested_window_close)}`}
              statusBadge={outcome === 'partial' ? 'PART DELIVERY — LOADED SHORT' : 'DELIVERED'}
              onConfirmAndContinue={goToProof}
              onReportProblem={() => navigate(`/driver/my-trips/${tripId}/report-problem${q}`)}
            />

            {/* Next: Capture Proof of Delivery Banner */}
            <ProofOfDeliveryFooterCard onContinueProof={goToProof} />
          </>
        )}
      </main>
    </div>
  )
}
