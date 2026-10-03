import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import DriverSyncBanner from '../../../components/driver/DriverSyncBanner'
import MyTripsHeader from '../../../components/driver/myTrips/MyTripsHeader'
import MyTripsFilterBar from '../../../components/driver/myTrips/MyTripsFilterBar'
import CurrentAssignedTripHero from '../../../components/driver/myTrips/CurrentAssignedTripHero'
import UpcomingTripsCards from '../../../components/driver/myTrips/UpcomingTripsCards'
import CompletedTripsTable from '../../../components/driver/myTrips/CompletedTripsTable'
import { getMyTrips } from '../../../services/driverData'
import { OUTBOX_EVENT } from '../../../services/offline/outbox'
import { formatDate, formatShortDate, formatTime } from '../../../utils/orderFormat'
import { driverStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './MyTrips.css'

const PAGE = 8
const shift = (date, days) => new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10)

export default function MyTrips() {
  const navigate = useNavigate()
  const [activeFilterPill, setActiveFilterPill] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1)
    window.addEventListener(OUTBOX_EVENT, bump)
    window.addEventListener('online', bump)
    return () => {
      window.removeEventListener(OUTBOX_EVENT, bump)
      window.removeEventListener('online', bump)
    }
  }, [])

  useEffect(() => {
    let active = true
    getMyTrips()
      .then((res) => {
        if (!active) return
        setData(res)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [version])

  const today = data?.today
  const filtered = useMemo(() => {
    if (!data) return []
    const q = searchQuery.trim().toLowerCase()
    return data.trips.filter((t) => {
      if (q && ![t.trip_id, t.vehicle_id, t.district, t.depot].some((s) => s.toLowerCase().includes(q))) return false
      if (vehicleFilter !== 'All Vehicles' && t.vehicle_id !== vehicleFilter) return false
      if (statusFilter !== 'All Statuses' && driverStatusOf(t) !== statusFilter && !(statusFilter === 'Scheduled' && ['planned', 'loading', 'loaded'].includes(t.status))) return false
      if (dateFilter === 'Today' && t.delivery_date !== today) return false
      if (dateFilter === 'Tomorrow' && t.delivery_date !== shift(today, 1)) return false
      if (dateFilter === 'Past 7 Days' && (t.delivery_date < shift(today, -7) || t.delivery_date > today)) return false
      return true
    })
  }, [data, today, searchQuery, vehicleFilter, statusFilter, dateFilter])

  const current = filtered.find((t) => ['dispatched', 'in_progress'].includes(t.status) && t.delivery_date >= shift(today || '2000-01-01', -1)) ||
    filtered.filter((t) => t.status !== 'completed' && t.delivery_date >= (today || '')).sort((a, b) => a.delivery_date.localeCompare(b.delivery_date) || a.trip_number - b.trip_number)[0]
  const upcoming = filtered
    .filter((t) => t !== current && t.status !== 'completed' && t.delivery_date >= (today || ''))
    .sort((a, b) => a.delivery_date.localeCompare(b.delivery_date) || a.trip_number - b.trip_number)
  const completed = filtered.filter((t) => t.status === 'completed' || (t !== current && t.delivery_date < (today || '')))
  const totalPages = Math.max(1, Math.ceil(completed.length / PAGE))
  const shownCompleted = completed.slice((page - 1) * PAGE, page * PAGE)

  const showCurrent = activeFilterPill === 'All' || activeFilterPill === 'Current'
  const showUpcoming = activeFilterPill === 'All' || activeFilterPill === 'Upcoming'
  const showCompleted = activeFilterPill === 'All' || activeFilterPill === 'Completed'
  const when = (t) => `${t.delivery_date === today ? 'Today' : t.delivery_date === shift(today, 1) ? 'Tomorrow' : formatShortDate(t.delivery_date)}, ${formatTime(t.planned_departure_time)}`

  return (
    <div className="my-trips-page-container">
      {/* Top Navbar with My Trips active */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Page Content */}
      <main className="my-trips-main-content">
        <DriverSyncBanner compact cachedAt={data?.fromCache ? data.cachedAt : null} />

        {/* Header & Filter Pills */}
        <MyTripsHeader
          activeFilter={activeFilterPill}
          onFilterChange={setActiveFilterPill}
          counts={{ all: filtered.length, current: current ? 1 : 0, upcoming: upcoming.length, completed: completed.length }}
        />

        {error && <p className="driver-page-state error">{error}</p>}

        {/* Search & Select Filter Bar */}
        <MyTripsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          vehicleFilter={vehicleFilter}
          onVehicleChange={setVehicleFilter}
          vehicleOptions={[...new Set((data?.trips || []).map((t) => t.vehicle_id))]}
          onClearFilters={() => {
            setActiveFilterPill('All')
            setSearchQuery('')
            setDateFilter('All Dates')
            setStatusFilter('All Statuses')
            setVehicleFilter('All Vehicles')
          }}
        />

        {showCurrent && current && (
          <CurrentAssignedTripHero
            trip={{
              tripId: current.trip_id,
              vehicle: `${current.vehicle_id} (${vehicleTypeLabel(current)})`,
              route: `${current.depot} → ${current.district} (${current.brand})`,
              departureTime: when(current),
              completedStops: current.completed_stops,
              totalStops: current.stops,
              status: driverStatusOf(current),
              nextStopNumber: String(Math.min(current.completed_stops + 1, current.stops)).padStart(2, '0'),
              nextStopName: `${current.district} outlets`,
              nextStopArrival: formatTime(current.first_arrival),
            }}
            onContinueChecklist={() => navigate('/driver/dashboard')}
            onViewStopDetails={() => navigate(`/driver/my-trips/${current.trip_id}`)}
          />
        )}
        {showCurrent && !current && data && <p className="driver-page-state">No current trip.</p>}

        {showUpcoming && (
          <UpcomingTripsCards
            trips={upcoming.map((t) => ({
              id: t.trip_id,
              timeText: when(t),
              vehicle: `${t.vehicle_id} • ${vehicleTypeLabel(t)}`,
              route: `${t.depot} → ${t.district}`,
              stopsCount: t.stops,
              status: driverStatusOf(t),
            }))}
            onViewRouteDetails={(t) => navigate(`/driver/my-trips/${t.id}`)}
          />
        )}

        {showCompleted && (
          <CompletedTripsTable
            trips={shownCompleted.map((t) => ({
              id: t.trip_id,
              date: formatDate(t.delivery_date),
              vehicle: t.vehicle_id,
              routePath: `${t.depot} → ${t.district}`,
              departure: formatTime(t.planned_departure_time),
              stops: `${t.completed_stops}/${t.stops}`,
              status: t.status === 'completed' ? 'Completed' : driverStatusOf(t),
            }))}
            currentPage={page}
            totalPages={totalPages}
            totalTrips={completed.length}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onViewTrip={(t) => navigate(`/driver/my-trips/${t.id}`)}
          />
        )}
      </main>
    </div>
  )
}
