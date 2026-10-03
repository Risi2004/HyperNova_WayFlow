import { useState } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import RoutesHeader from '../../../components/dispatcher/routes/RoutesHeader'
import RoutesFilterBar from '../../../components/dispatcher/routes/RoutesFilterBar'
import RoutesMetricCards from '../../../components/dispatcher/routes/RoutesMetricCards'
import RoutesTable from '../../../components/dispatcher/routes/RoutesTable'
import RoutesAttentionCard from '../../../components/dispatcher/routes/RoutesAttentionCard'
import RoutesOperationalMap from '../../../components/dispatcher/routes/RoutesOperationalMap'
import RoutesBottomCards from '../../../components/dispatcher/routes/RoutesBottomCards'

import './Routes.css'

export default function DispatcherRoutes() {
  const [activeTab, setActiveTab] = useState('all')
  const [activeDepot, setActiveDepot] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicleType, setVehicleType] = useState('all')
  const [routeStatus, setRouteStatus] = useState('all')
  const [brand, setBrand] = useState('all')
  const [viewMode, setViewMode] = useState('table')

  const initialRoutes = [
    {
      id: 'RTE-2026-041',
      status: 'Planned',
      statusType: 'planned',
      statusSub: null,
      depot: 'Peliyagoda',
      vehicle: 'WP-CA-2847',
      driver: 'Assigned Driver',
      trip: '1 / 2',
      stops: '5 stops',
      distance: '68 km',
      duration: '8h 15m',
      departure: '06:30 AM',
      progressText: 'Not started',
      progressPercent: 0,
      progressSub: null,
    },
    {
      id: 'RTE-2026-042',
      status: 'Active',
      statusType: 'active',
      statusSub: null,
      depot: 'Peliyagoda',
      vehicle: 'WP-CA-3912',
      driver: 'Assigned Driver',
      trip: '1 / 2',
      stops: '7 stops',
      distance: '82 km',
      duration: '9h 05m',
      departure: '06:45 AM',
      progressText: '3 / 5 stops',
      progressPercent: 60,
      progressSub: 'Next: Waypoint Fresh – Colombo 07 • ETA 11:25 AM',
    },
    {
      id: 'RTE-2026-043',
      status: 'Loading',
      statusType: 'loading',
      statusSub: null,
      depot: 'Peliyagoda',
      vehicle: 'WP-CA-4408',
      driver: 'Assigned Driver',
      trip: '1 / 1',
      stops: '6 stops',
      distance: '74 km',
      duration: '7h 40m',
      departure: '07:15 AM',
      progressText: 'Not started',
      progressPercent: 0,
      progressSub: null,
    },
    {
      id: 'RTE-2026-044',
      status: 'Delayed',
      statusType: 'delayed',
      statusSub: 'Traffic delay',
      depot: 'Kandy',
      vehicle: 'WP-KA-2178',
      driver: 'Assigned Driver',
      trip: '1 / 2',
      stops: '5 stops',
      distance: '63 km',
      duration: '7h 10m',
      departure: '07:30 AM',
      progressText: '28% complete',
      progressPercent: 28,
      progressSub: null,
    },
    {
      id: 'RTE-2026-037',
      status: 'Completed',
      statusType: 'completed',
      statusSub: null,
      depot: 'Kandy',
      vehicle: 'WP-KA-1184',
      driver: 'Assigned Driver',
      trip: '2 / 2',
      stops: '4 stops',
      distance: '51 km',
      duration: '6h 20m',
      departure: '07:00 AM',
      progressText: 'Complete',
      progressPercent: 100,
      progressSub: null,
    },
  ]

  // Filtering
  const filteredRoutes = initialRoutes.filter((r) => {
    const matchesTab =
      activeTab === 'all' || r.statusType === activeTab

    const matchesDepot =
      activeDepot === 'all' || r.depot.toLowerCase() === activeDepot.toLowerCase()

    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.driver.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      routeStatus === 'all' || r.statusType === routeStatus

    return matchesTab && matchesDepot && matchesSearch && matchesStatus
  })

  const handleClearFilters = () => {
    setActiveTab('all')
    setActiveDepot('all')
    setSearchQuery('')
    setVehicleType('all')
    setRouteStatus('all')
    setBrand('all')
  }

  const handleViewRoute = (route) => {
    // Interactive action hook
    console.log('Viewing route:', route)
  }

  return (
    <div className="routes-page-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeItem="Routes" />

      {/* Main Content Area */}
      <div className="routes-main-wrapper">
        <Header />

        <main className="routes-content">
          {/* Header & Status Tabs */}
          <RoutesHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Depot & Filters Bar */}
          <RoutesFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeDepot={activeDepot}
            setActiveDepot={setActiveDepot}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            routeStatus={routeStatus}
            setRouteStatus={setRouteStatus}
            brand={brand}
            setBrand={setBrand}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onClearFilters={handleClearFilters}
          />

          {/* 6 Metric Cards */}
          <RoutesMetricCards />

          {/* Data Table */}
          <RoutesTable
            routes={filteredRoutes}
            onViewRoute={handleViewRoute}
          />

          {/* Routes Requiring Attention Banner */}
          <RoutesAttentionCard onViewRoute={handleViewRoute} />

          {/* Operational Map Overview (React Leaflet Map) */}
          <RoutesOperationalMap />

          {/* Bottom Split Cards (Tablet Card View & Empty State Preview) */}
          <RoutesBottomCards
            onClearFilters={handleClearFilters}
            onViewRoute={handleViewRoute}
          />

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>All times in Asia/Colombo (UTC+05:30)</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
