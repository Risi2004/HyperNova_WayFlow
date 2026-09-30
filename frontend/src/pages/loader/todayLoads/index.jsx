import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import TodayLoadsControls from '../../../components/loader/TodayLoadsControls'
import TodayLoadsSummaryPills from '../../../components/loader/TodayLoadsSummaryPills'
import TodayLoadsFullTable from '../../../components/loader/TodayLoadsFullTable'
import './TodayLoads.css'

const INITIAL_LOADS = [
  {
    id: 'LD-024',
    vehicleId: 'WP-LOR-012',
    vehicleType: 'Dry-box Truck',
    route: 'Colombo North',
    departureTime: '05:30 AM',
    departureAlert: 'Departs in 35 min',
    stops: 6,
    loaded: 0,
    totalStops: 6,
    progressPercent: 0,
    status: 'AWAITING LOADING',
    statusType: 'awaiting',
    actionText: 'Start Loading',
    actionType: 'primary',
  },
  {
    id: 'LD-025',
    vehicleId: 'WP-REF-007',
    vehicleType: 'Refrigerated Truck',
    route: 'Colombo South',
    departureTime: '06:00 AM',
    stops: 5,
    loaded: 3,
    totalStops: 5,
    progressPercent: 60,
    status: 'LOADING',
    statusType: 'loading',
    actionText: 'Continue Loading',
    actionType: 'primary',
  },
  {
    id: 'LD-026',
    vehicleId: 'WP-VAN-004',
    vehicleType: 'Refrigerated Van',
    route: 'Mall Outlets',
    departureTime: '06:15 AM',
    stops: 4,
    loaded: 4,
    totalStops: 4,
    progressPercent: 100,
    status: 'READY',
    statusType: 'ready',
    actionText: 'View Load',
    actionType: 'secondary',
  },
  {
    id: 'LD-027',
    vehicleId: 'WP-DRY-019',
    vehicleType: 'Dry-box Truck',
    route: 'Negombo',
    departureTime: '06:30 AM',
    stops: 7,
    loaded: 2,
    totalStops: 7,
    progressPercent: 29,
    status: 'ISSUE',
    statusType: 'issue',
    statusSubtext: '3 cartons missing',
    actionText: 'View Issue',
    actionType: 'issue',
  },
  {
    id: 'LD-028',
    vehicleId: 'WP-LOR-015',
    vehicleType: 'Dry-box Truck',
    route: 'Kandy Express',
    departureTime: '07:00 AM',
    stops: 3,
    loaded: 0,
    totalStops: 3,
    progressPercent: 0,
    status: 'AWAITING LOADING',
    statusType: 'awaiting',
    actionText: 'Start Loading',
    actionType: 'primary',
  },
  {
    id: 'LD-029',
    vehicleId: 'WP-REF-011',
    vehicleType: 'Refrigerated Truck',
    route: 'Galle Coastal',
    departureTime: '07:15 AM',
    stops: 8,
    loaded: 8,
    totalStops: 8,
    progressPercent: 100,
    status: 'READY',
    statusType: 'ready',
    actionText: 'View Load',
    actionType: 'secondary',
  },
  {
    id: 'LD-030',
    vehicleId: 'WP-VAN-008',
    vehicleType: 'Delivery Van',
    route: 'Colombo CBD',
    departureTime: '07:30 AM',
    stops: 4,
    loaded: 1,
    totalStops: 4,
    progressPercent: 25,
    status: 'LOADING',
    statusType: 'loading',
    actionText: 'Continue Loading',
    actionType: 'primary',
  },
  {
    id: 'LD-031',
    vehicleId: 'WP-DRY-022',
    vehicleType: 'Dry-box Truck',
    route: 'Kurunegala',
    departureTime: '08:00 AM',
    stops: 5,
    loaded: 0,
    totalStops: 5,
    progressPercent: 0,
    status: 'AWAITING LOADING',
    statusType: 'awaiting',
    actionText: 'Start Loading',
    actionType: 'primary',
  },
]

export default function TodayLoads() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [departureFilter, setDepartureFilter] = useState('ALL')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL')

  // Calculate counts for summary pills
  const counts = useMemo(() => {
    return {
      total: INITIAL_LOADS.length,
      awaiting: INITIAL_LOADS.filter((l) => l.statusType === 'awaiting').length,
      loading: INITIAL_LOADS.filter((l) => l.statusType === 'loading').length,
      ready: INITIAL_LOADS.filter((l) => l.statusType === 'ready').length,
      issues: INITIAL_LOADS.filter((l) => l.statusType === 'issue').length,
    }
  }, [])

  // Filter loads
  const filteredLoads = useMemo(() => {
    return INITIAL_LOADS.filter((load) => {
      // Search matching load id, vehicle, or route
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = load.id.toLowerCase().includes(q)
        const matchesVehicle = load.vehicleId.toLowerCase().includes(q) || load.vehicleType.toLowerCase().includes(q)
        const matchesRoute = load.route.toLowerCase().includes(q)
        if (!matchesId && !matchesVehicle && !matchesRoute) return false
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'AWAITING' && load.statusType !== 'awaiting') return false
        if (statusFilter === 'LOADING' && load.statusType !== 'loading') return false
        if (statusFilter === 'READY' && load.statusType !== 'ready') return false
        if (statusFilter === 'ISSUE' && load.statusType !== 'issue') return false
      }

      // Vehicle type filter
      if (vehicleTypeFilter !== 'ALL' && load.vehicleType !== vehicleTypeFilter) {
        return false
      }

      return true
    })
  }, [searchQuery, statusFilter, vehicleTypeFilter])

  const navigate = useNavigate()

  const handleActionClick = (load, actionType) => {
    if (actionType === 'issue' || load.actionType === 'issue' || load.statusType === 'issue') {
      navigate(`/loader/today-loads/${load.id}/report-issue`)
    } else {
      navigate(`/loader/today-orders/${load.id}`)
    }
  }

  return (
    <div className="today-loads-page-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="today-loads-main-wrapper">
        <main className="today-loads-content">
          {/* Subheader Title & Filter Controls */}
          <div className="today-loads-header-row">
            <div className="today-loads-title-col">
              <h2 className="today-loads-title">Today's Loads</h2>
              <p className="today-loads-subtitle">
                Vehicles scheduled for loading at Peliyagoda Distribution Center
              </p>
            </div>

            <TodayLoadsControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              departureFilter={departureFilter}
              onDepartureChange={setDepartureFilter}
              vehicleTypeFilter={vehicleTypeFilter}
              onVehicleTypeChange={setVehicleTypeFilter}
            />
          </div>

          {/* Quick Filter Status Pills */}
          <TodayLoadsSummaryPills
            counts={counts}
            activeStatus={statusFilter}
            onSelectStatus={(status) => setStatusFilter(status)}
          />

          {/* Loads Table Card */}
          <TodayLoadsFullTable
            loads={filteredLoads}
            onActionClick={handleActionClick}
          />
        </main>
      </div>
    </div>
  )
}
