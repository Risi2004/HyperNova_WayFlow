import { useNavigate, useParams } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import TripDetailsHeader from '../../../components/driver/tripDetails/TripDetailsHeader'
import TripOverviewCard from '../../../components/driver/tripDetails/TripOverviewCard'
import RouteStopsListCard from '../../../components/driver/tripDetails/RouteStopsListCard'
import { currentStopOf, DONE, useDriverTrip } from '../../../hooks/useDriverTrip'
import { formatDate, formatTime } from '../../../utils/orderFormat'
import { driverStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './TripDetails.css'

export default function TripDetails() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const { data, error } = useDriverTrip(tripId)

  const trip = data?.trip
  const stops = data?.stops || []
  const done = stops.filter((s) => DONE.includes(s.stop_status)).length
  const current = currentStopOf(stops)
  const onRoad = trip && ['dispatched', 'in_progress'].includes(trip.status)

  return (
    <div className="trip-details-page-container">
      {/* Top Navbar with My Trips active */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Page Body */}
      <main className="trip-details-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />

        {/* Breadcrumb Header Row */}
        <TripDetailsHeader tripId={tripId} status={trip ? driverStatusOf(trip) : '…'} />

        {error && !trip && <p className="driver-page-state error">{error}</p>}
        {!trip && !error && <p className="driver-page-state">Loading trip…</p>}

        {trip && (
          <>
            {/* Overview Specifications & Progress Bar */}
            <TripOverviewCard
              trip={{
                tripId: trip.trip_id,
                status: driverStatusOf(trip),
                vehicle: `${trip.vehicle_id} (${vehicleTypeLabel(trip)})`,
                routePathway: `${trip.depot} depot → ${trip.district} (${trip.brand})`,
                departureTime: `${formatDate(trip.delivery_date)}, ${formatTime(trip.planned_departure_time)}`,
                stopsSummary: `${stops.length} Stops (${done} Completed, ${stops.length - done} Remaining)`,
                completedStops: done,
                totalStops: stops.length,
              }}
            />
            {!onRoad && trip.status !== 'completed' && (
              <p className="driver-page-state">
                {trip.status === 'loaded' ? 'Loading is complete — start the trip from your dashboard when you leave.' : 'This trip has not left the depot yet.'}
              </p>
            )}

            {/* Route Stops List */}
            <RouteStopsListCard
              stops={stops.map((s) => ({
                id: s.order_id,
                stopNumber: String(s.stop_sequence).padStart(2, '0'),
                name: `Waypoint ${s.brand}${s.pending_sync ? ' • waiting to sync' : ''}`,
                orderCode: `${s.outlet_id} • ${s.order_id}`,
                location: s.district,
                deliveryWindow: `${formatTime(s.requested_window_open)} - ${formatTime(s.requested_window_close)} • plan ${formatTime(s.planned_arrival_time)}`,
                status: DONE.includes(s.stop_status) ? 'completed' : current?.order_id === s.order_id && onRoad ? 'current' : 'scheduled',
              }))}
              onViewStopDetails={(s) => navigate(`/driver/my-trips/${tripId}/delivery-stop?order=${s.id}`)}
            />
          </>
        )}
      </main>
    </div>
  )
}
