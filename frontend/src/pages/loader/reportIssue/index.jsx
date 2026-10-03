import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import ReportIssueHeader from '../../../components/loader/reportIssue/ReportIssueHeader'
import ReportIssueMetaBar from '../../../components/loader/reportIssue/ReportIssueMetaBar'
import ReportIssueForm from '../../../components/loader/reportIssue/ReportIssueForm'
import { tripService } from '../../../services/tripService'
import { formatDate, formatTime } from '../../../utils/orderFormat'
import { loadStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './ReportIssue.css'

export default function ReportIssue() {
  const { orderId, loadId } = useParams()
  const tripId = orderId || loadId
  const [searchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tripId) return
    let active = true
    tripService
      .getTrip(tripId)
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [tripId])

  const trip = data?.trip
  const stops = data?.stops || []
  const checked = stops.filter((s) => s.verified_at).length

  return (
    <div className="report-issue-layout-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="report-issue-main-wrapper">
        <main className="report-issue-content">
          {/* Header */}
          <ReportIssueHeader loadId={tripId || '—'} vehicleId={trip?.vehicle_id || ''} />

          {!tripId && <p className="record-issue-error">Open a load from Today's Loads to report an issue for it.</p>}
          {error && <p className="record-issue-error">Unable to open {tripId}: {error}</p>}

          {trip && (
            <>
              {/* Top Meta Strip */}
              <ReportIssueMetaBar
                loadId={trip.trip_id}
                vehicle={`${trip.vehicle_id} (${vehicleTypeLabel(trip)})`}
                route={`${trip.depot} → ${trip.district} (${stops.length} Stops)`}
                departure={`${formatTime(trip.planned_departure_time)} ${formatDate(trip.delivery_date)}`}
                progress={`${checked} / ${stops.length} Orders Checked`}
                status={loadStatusOf({ ...trip, shortfalls: stops.filter((s) => s.shortfall_flag).length }).status}
              />

              {['planned', 'loading'].includes(trip.status) ? (
                <ReportIssueForm trip={trip} stops={stops} initialOrderId={searchParams.get('order')} />
              ) : (
                <p className="record-issue-error">Loading for {trip.trip_id} is complete; report problems on the road through the driver app.</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
