import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import MyTripsHeader from '../../../components/driver/myTrips/MyTripsHeader'
import MyTripsFilterBar from '../../../components/driver/myTrips/MyTripsFilterBar'
import CurrentAssignedTripHero from '../../../components/driver/myTrips/CurrentAssignedTripHero'
import UpcomingTripsCards from '../../../components/driver/myTrips/UpcomingTripsCards'
import CompletedTripsTable from '../../../components/driver/myTrips/CompletedTripsTable'
import './MyTrips.css'

const CURRENT_TRIP_DATA = {
  tripId: 'TR-024',
  vehicle: 'WP-REF-007 (Refrigerated Truck)',
  route: 'Peliyagoda HQ → Colombo South Outlet',
  departureTime: 'Today, 06:00 AM',
  completedStops: 4,
  totalStops: 8,
  status: 'In Progress',
  nextStopNumber: '05',
  nextStopName: 'WayFlow Fresh — Colombo 04',
  nextStopArrival: '10:42 AM',
}

const UPCOMING_TRIPS_DATA = [
  {
    id: 'TR-025',
    timeText: 'Tomorrow, 05:30 AM',
    vehicle: 'WP-VAN-004 • Delivery Van',
    route: 'Peliyagoda → Negombo',
    stopsCount: 6,
    status: 'Scheduled',
  },
  {
    id: 'TR-026',
    timeText: '28 Sep, 07:00 AM',
    vehicle: 'WP-DRY-019 • Dry-box Truck',
    route: 'Kandy → Central Region',
    stopsCount: 7,
    status: 'Scheduled',
  },
  {
    id: 'TR-027',
    timeText: '29 Sep, 06:00 AM',
    vehicle: 'WP-REF-011 • Refrigerated',
    route: 'Peliyagoda → Galle Coastal',
    stopsCount: 5,
    status: 'Scheduled',
  },
]

const COMPLETED_TRIPS_DATA = [
  {
    id: 'TR-023',
    date: '26 Sep 2026',
    vehicle: 'WP-LOR-012',
    routePath: 'Colombo North Outlet Loop',
    departure: '05:45 AM',
    stops: '8/8',
    status: 'Completed',
  },
  {
    id: 'TR-022',
    date: '26 Sep 2026',
    vehicle: 'WP-REF-007',
    routePath: 'Colombo CBD Metro',
    departure: '06:00 AM',
    stops: '6/6',
    status: 'Completed',
  },
  {
    id: 'TR-021',
    date: '25 Sep 2026',
    vehicle: 'WP-VAN-004',
    routePath: 'Negombo Delivery Hub',
    departure: '06:30 AM',
    stops: '7/7',
    status: 'Completed',
  },
  {
    id: 'TR-020',
    date: '25 Sep 2026',
    vehicle: 'WP-DRY-019',
    routePath: 'Mall Outlets Distribution',
    departure: '07:00 AM',
    stops: '5/5',
    status: 'Completed',
  },
  {
    id: 'TR-019',
    date: '24 Sep 2026',
    vehicle: 'WP-REF-011',
    routePath: 'Galle Coastal Fast Track',
    departure: '06:15 AM',
    stops: '8/8',
    status: 'Completed',
  },
]

export default function MyTrips() {
  const navigate = useNavigate()
  const [activeFilterPill, setActiveFilterPill] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('All Dates')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles')
  const [toastMessage, setToastMessage] = useState('')

  // Show temporary toast feedback
  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilterPill('All')
    setSearchQuery('')
    setDateFilter('All Dates')
    setStatusFilter('All Statuses')
    setVehicleFilter('All Vehicles')
  }

  // Filter completed trips based on query and dropdowns
  const filteredCompletedTrips = useMemo(() => {
    return COMPLETED_TRIPS_DATA.filter((trip) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = trip.id.toLowerCase().includes(q)
        const matchesVehicle = trip.vehicle.toLowerCase().includes(q)
        const matchesRoute = trip.routePath.toLowerCase().includes(q)
        if (!matchesId && !matchesVehicle && !matchesRoute) return false
      }

      if (vehicleFilter !== 'All Vehicles' && !trip.vehicle.includes(vehicleFilter)) {
        return false
      }

      if (statusFilter !== 'All Statuses' && statusFilter !== 'Completed') {
        return false
      }

      return true
    })
  }, [searchQuery, vehicleFilter, statusFilter])

  // Filter upcoming trips
  const filteredUpcomingTrips = useMemo(() => {
    return UPCOMING_TRIPS_DATA.filter((trip) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = trip.id.toLowerCase().includes(q)
        const matchesVehicle = trip.vehicle.toLowerCase().includes(q)
        const matchesRoute = trip.route.toLowerCase().includes(q)
        if (!matchesId && !matchesVehicle && !matchesRoute) return false
      }

      if (vehicleFilter !== 'All Vehicles' && !trip.vehicle.includes(vehicleFilter)) {
        return false
      }

      if (statusFilter !== 'All Statuses' && statusFilter !== 'Scheduled') {
        return false
      }

      return true
    })
  }, [searchQuery, vehicleFilter, statusFilter])

  // Determine section visibility based on pill
  const showCurrent = activeFilterPill === 'All' || activeFilterPill === 'Current'
  const showUpcoming = activeFilterPill === 'All' || activeFilterPill === 'Upcoming'
  const showCompleted = activeFilterPill === 'All' || activeFilterPill === 'Completed'

  return (
    <div className="my-trips-page-container">
      {/* Top Navbar with My Trips active */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Page Content */}
      <main className="my-trips-main-content">
        {/* Header & Filter Pills */}
        <MyTripsHeader
          activeFilter={activeFilterPill}
          onFilterChange={setActiveFilterPill}
          counts={{
            all: 12,
            current: 1,
            upcoming: 3,
            completed: 8,
          }}
        />

        {/* Action Feedback Banner */}
        {toastMessage && (
          <div className="driver-toast-banner" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}

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
          onClearFilters={handleClearFilters}
        />

        {/* Current Assigned Trip Hero Card */}
        {showCurrent && (
          <CurrentAssignedTripHero
            trip={CURRENT_TRIP_DATA}
            onContinueChecklist={() => navigate('/driver/dashboard')}
            onViewStopDetails={() => navigate(`/driver/my-trips/${CURRENT_TRIP_DATA.tripId}`)}
          />
        )}

        {/* Upcoming Scheduled Trips (3-Card Grid) */}
        {showUpcoming && (
          <UpcomingTripsCards
            trips={filteredUpcomingTrips}
            onViewRouteDetails={(trip) => navigate(`/driver/my-trips/${trip.id}`)}
          />
        )}

        {/* Completed Trips Log (Table) */}
        {showCompleted && (
          <CompletedTripsTable
            trips={filteredCompletedTrips}
            currentPage={1}
            totalPages={2}
            totalTrips={8}
            onPrev={() => triggerToast('Navigating to previous page of completed trips...')}
            onNext={() => triggerToast('Navigating to next page of completed trips...')}
            onViewTrip={(trip) => navigate(`/driver/my-trips/${trip.id}`)}
          />
        )}
      </main>
    </div>
  )
}
