import { useState, useMemo } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import LiveHeader from '../../../components/dispatcher/liveDeliveries/LiveHeader'
import LiveMetricCards from '../../../components/dispatcher/liveDeliveries/LiveMetricCards'
import LiveFilterBar from '../../../components/dispatcher/liveDeliveries/LiveFilterBar'
import LiveAttentionBanner from '../../../components/dispatcher/liveDeliveries/LiveAttentionBanner'
import LiveDeliveriesTable from '../../../components/dispatcher/liveDeliveries/LiveDeliveriesTable'
import LiveNetworkMapCard from '../../../components/dispatcher/liveDeliveries/LiveNetworkMapCard'
import LiveRealtimeInfoCard from '../../../components/dispatcher/liveDeliveries/LiveRealtimeInfoCard'
import LiveEmptyStateCard from '../../../components/dispatcher/liveDeliveries/LiveEmptyStateCard'

import './LiveDeliveries.css'

export default function LiveDeliveries() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All')
  const [windowFilter, setWindowFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const initialDeliveries = [
    {
      route: 'TR-024',
      vehicle: 'WP-CB-4521',
      vehicleType: 'Refrigerated Truck',
      depot: 'Peliyagoda',
      brand: 'Waypoint Fresh',
      driver: 'K. Perera',
      stops: '8 stops',
      currentStop: 'Stop 4 — OUT033',
      completedStops: 4,
      totalStops: 8,
      percent: 50,
      eta: '06:58 AM',
      status: 'On Time',
      statusType: 'ontime',
      lastUpdate: '09:40 AM',
    },
    {
      route: 'TR-027',
      vehicle: 'WP-CB-1184',
      vehicleType: '14ft Truck',
      depot: 'Peliyagoda',
      brand: 'Waypoint Style',
      driver: 'M. Fernando',
      stops: '6 stops',
      currentStop: 'Stop 3 — OUT018',
      completedStops: 3,
      totalStops: 6,
      percent: 50,
      eta: '07:15 AM',
      status: 'Delayed',
      statusType: 'delayed',
      statusDetail: 'Traffic delay',
      lastUpdate: '09:38 AM',
    },
    {
      route: 'TR-031',
      vehicle: 'WP-CB-6722',
      vehicleType: 'Refrigerated Truck',
      depot: 'Kandy',
      brand: 'Waypoint Fresh',
      driver: 'A. Silva',
      stops: '7 stops',
      currentStop: 'Stop 6 — OUT052',
      completedStops: 6,
      totalStops: 7,
      percent: 86,
      eta: '08:05 AM',
      status: 'Problem',
      statusType: 'problem',
      statusDetail: 'Awaiting review',
      lastUpdate: '09:41 AM',
    },
    {
      route: 'TR-018',
      vehicle: 'WP-KD-2207',
      vehicleType: 'Van',
      depot: 'Peliyagoda',
      brand: 'Waypoint Tech',
      driver: 'N. Jayasinghe',
      stops: '5 stops',
      currentStop: 'All stops completed',
      completedStops: 5,
      totalStops: 5,
      percent: 100,
      eta: '07:42 AM',
      status: 'Completed',
      statusType: 'completed',
      lastUpdate: '09:30 AM',
    },
    {
      route: 'TR-036',
      vehicle: 'WP-CB-3190',
      vehicleType: '14ft Truck',
      depot: 'Peliyagoda',
      brand: 'Waypoint Style',
      driver: 'S. Iqbal',
      stops: '9 stops',
      currentStop: 'Stop 7 — OUT088',
      completedStops: 7,
      totalStops: 9,
      percent: 78,
      eta: '09:10 AM',
      status: 'On Time',
      statusType: 'ontime',
      lastUpdate: '09:39 AM',
    },
    {
      route: 'TR-042',
      vehicle: 'WP-KD-5013',
      vehicleType: 'Van',
      depot: 'Kandy',
      brand: 'Waypoint Tech',
      driver: 'P. Kumara',
      stops: '4 stops',
      currentStop: 'Awaiting departure',
      completedStops: 0,
      totalStops: 4,
      percent: 0,
      eta: '10:20 AM',
      status: 'Pending',
      statusType: 'pending',
      lastUpdate: '09:32 AM',
    },
  ]

  // Filter logic
  const filteredDeliveries = useMemo(() => {
    return initialDeliveries.filter((d) => {
      // Tab filter
      if (activeTab === 'Active' && d.statusType !== 'ontime') return false
      if (activeTab === 'Pending' && d.statusType !== 'pending') return false
      if (activeTab === 'Completed' && d.statusType !== 'completed') return false
      if (activeTab === 'Delayed' && d.statusType !== 'delayed') return false
      if (activeTab === 'Problem' && d.statusType !== 'problem') return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          d.route.toLowerCase().includes(q) ||
          d.vehicle.toLowerCase().includes(q) ||
          d.driver.toLowerCase().includes(q) ||
          d.currentStop.toLowerCase().includes(q)
        if (!matches) return false
      }

      // Dropdown filters
      if (depotFilter !== 'All' && d.depot !== depotFilter) return false
      if (brandFilter !== 'All' && d.brand !== brandFilter) return false
      if (statusFilter !== 'All' && d.status !== statusFilter) return false
      if (vehicleTypeFilter !== 'All' && d.vehicleType !== vehicleTypeFilter) return false

      return true
    })
  }, [initialDeliveries, activeTab, searchQuery, depotFilter, brandFilter, statusFilter, vehicleTypeFilter])

  const handleClearFilters = () => {
    setSearchQuery('')
    setDepotFilter('All')
    setBrandFilter('All')
    setStatusFilter('All')
    setVehicleTypeFilter('All')
    setWindowFilter('All')
    setActiveTab('All')
  }

  return (
    <div className="live-page-container">
      {/* Sidebar with Live Deliveries Active */}
      <Sidebar activeItem="Live Deliveries" />

      {/* Main Content Area */}
      <div className="live-main-wrapper">
        <Header />

        <main className="live-content">
          {/* Header Row & Connection Status */}
          <LiveHeader />

          {/* 4 Summary Stat Cards */}
          <LiveMetricCards />

          {/* Horizontal Status Tabs & Filter Bar */}
          <LiveFilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            depotFilter={depotFilter}
            setDepotFilter={setDepotFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            vehicleTypeFilter={vehicleTypeFilter}
            setVehicleTypeFilter={setVehicleTypeFilter}
            windowFilter={windowFilter}
            setWindowFilter={setWindowFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Needs Attention Warning Alert Banner */}
          <LiveAttentionBanner />

          {/* Today's Deliveries Data Grid */}
          <LiveDeliveriesTable
            deliveries={filteredDeliveries}
            currentPage={currentPage}
            totalPages={10}
            onPageChange={setCurrentPage}
          />

          {/* Live Delivery Network Map */}
          <LiveNetworkMapCard />

          {/* Bottom Row: Real-time network visibility + Associated empty state */}
          <div className="live-bottom-two-col">
            <LiveRealtimeInfoCard />
            <LiveEmptyStateCard />
          </div>

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>Operational data synced at 09:26 • West Hub timezone</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
