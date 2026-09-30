import { useState, useMemo } from 'react'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoaderHeader from '../../../components/loader/LoaderHeader'
import HistoryMetricCards from '../../../components/loader/loadingHistory/HistoryMetricCards'
import HistoryFilterBar from '../../../components/loader/loadingHistory/HistoryFilterBar'
import HistoryTable from '../../../components/loader/loadingHistory/HistoryTable'
import HistoryPagination from '../../../components/loader/loadingHistory/HistoryPagination'
import './LoadingHistory.css'

const INITIAL_HISTORY = [
  {
    id: 'LD-018',
    vehicleId: 'WP-LOR-012',
    vehicleType: 'Dry-box Truck',
    route: 'Colombo North',
    loadingDate: '26 Sep 2026',
    departure: '05:30 AM',
    duration: '38 min',
    items: '24 / 24',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
  {
    id: 'LD-019',
    vehicleId: 'WP-REF-007',
    vehicleType: 'Refrigerated Truck',
    route: 'Colombo South',
    loadingDate: '26 Sep 2026',
    departure: '06:00 AM',
    duration: '46 min',
    items: '25 / 25',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
  {
    id: 'LD-020',
    vehicleId: 'WP-VAN-004',
    vehicleType: 'Refrigerated Van',
    route: 'Mall Outlets',
    loadingDate: '25 Sep 2026',
    departure: '06:15 AM',
    duration: '51 min',
    items: '18 / 20',
    status: 'COMPLETED WITH ISSUE',
    statusType: 'issue',
    issues: 'Quantity mismatch',
  },
  {
    id: 'LD-021',
    vehicleId: 'WP-DRY-019',
    vehicleType: 'Dry Van',
    route: 'Negombo',
    loadingDate: '25 Sep 2026',
    departure: '06:30 AM',
    duration: '43 min',
    items: '22 / 22',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
  {
    id: 'LD-022',
    vehicleId: 'WP-LOR-015',
    vehicleType: 'Dry-box Truck',
    route: 'Kandy Express',
    loadingDate: '24 Sep 2026',
    departure: '07:00 AM',
    duration: '35 min',
    items: '20 / 20',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
  {
    id: 'LD-023',
    vehicleId: 'WP-REF-011',
    vehicleType: 'Refrigerated Truck',
    route: 'Galle Coastal',
    loadingDate: '24 Sep 2026',
    departure: '07:15 AM',
    duration: '55 min',
    items: '30 / 32',
    status: 'COMPLETED WITH ISSUE',
    statusType: 'issue',
    issues: '2 items short',
  },
  {
    id: 'LD-024',
    vehicleId: 'WP-VAN-008',
    vehicleType: 'Delivery Van',
    route: 'Colombo CBD',
    loadingDate: '23 Sep 2026',
    departure: '07:30 AM',
    duration: '40 min',
    items: '20 / 20',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
  {
    id: 'LD-025',
    vehicleId: 'WP-DRY-022',
    vehicleType: 'Dry Van',
    route: 'Kurunegala',
    loadingDate: '23 Sep 2026',
    departure: '08:00 AM',
    duration: '44 min',
    items: '22 / 22',
    status: 'COMPLETED',
    statusType: 'completed',
    issues: 'None',
  },
]

export default function LoadingHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('Last 7 Days')
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles')
  const [routeFilter, setRouteFilter] = useState('All Routes')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [issueFilter, setIssueFilter] = useState('All Issues')

  const filteredHistory = useMemo(() => {
    return INITIAL_HISTORY.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = item.id.toLowerCase().includes(q)
        const matchesVehicle =
          item.vehicleId.toLowerCase().includes(q) ||
          item.vehicleType.toLowerCase().includes(q)
        const matchesRoute = item.route.toLowerCase().includes(q)
        if (!matchesId && !matchesVehicle && !matchesRoute) return false
      }

      // Vehicle
      if (vehicleFilter !== 'All Vehicles' && item.vehicleId !== vehicleFilter) {
        return false
      }

      // Route
      if (routeFilter !== 'All Routes' && item.route !== routeFilter) {
        return false
      }

      // Status
      if (statusFilter !== 'All Statuses') {
        if (statusFilter === 'COMPLETED' && item.statusType !== 'completed') {
          return false
        }
        if (statusFilter === 'COMPLETED WITH ISSUE' && item.statusType !== 'issue') {
          return false
        }
      }

      // Issues
      if (issueFilter === 'With Issues' && item.issues === 'None') {
        return false
      }
      if (issueFilter === 'None' && item.issues !== 'None') {
        return false
      }

      return true
    })
  }, [searchQuery, vehicleFilter, routeFilter, statusFilter, issueFilter])

  const handleClearFilters = () => {
    setSearchQuery('')
    setDateRange('Last 7 Days')
    setVehicleFilter('All Vehicles')
    setRouteFilter('All Routes')
    setStatusFilter('All Statuses')
    setIssueFilter('All Issues')
  }

  const handleExport = () => {
    alert('Exporting loading history report (CSV)...')
  }

  return (
    <div className="loading-history-layout-container">
      {/* Sidebar with Loading History active */}
      <LoaderSidebar activeItem="Loading History" />

      {/* Main Content */}
      <div className="loading-history-main-wrapper">
        <main className="loading-history-content">
          {/* Header */}
          <LoaderHeader
            title="Loading History"
            hub="Peliyagoda Distribution Center"
            dateText="Sunday, 27 September 2026"
          />

          {/* 4 Stat Cards */}
          <HistoryMetricCards
            metrics={{
              totalLoads: 128,
              completed: 121,
              issuesReported: 7,
              avgLoadingTime: '42 min',
            }}
          />

          {/* Filters Bar */}
          <HistoryFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            vehicleFilter={vehicleFilter}
            onVehicleFilterChange={setVehicleFilter}
            routeFilter={routeFilter}
            onRouteChange={setRouteFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            issueFilter={issueFilter}
            onIssueChange={setIssueFilter}
            onClearFilters={handleClearFilters}
            onExport={handleExport}
          />

          {/* History Table */}
          <HistoryTable loads={filteredHistory} />

          {/* Pagination */}
          <HistoryPagination
            start={1}
            end={filteredHistory.length}
            total={128}
            currentPage={1}
            totalPages={16}
            onPrev={() => {}}
            onNext={() => {}}
          />
        </main>
      </div>
    </div>
  )
}
