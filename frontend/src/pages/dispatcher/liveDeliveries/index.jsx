import { useState, useMemo, useEffect, useCallback } from 'react'
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
import { tripService } from '../../../services/tripService'

import './LiveDeliveries.css'

const FALLBACK_DELIVERIES = [
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

export default function LiveDeliveries() {
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All')
  const [windowFilter, setWindowFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const [backendTrips, setBackendTrips] = useState([])
  const [backendMetrics, setBackendMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLiveTrips = useCallback(async () => {
    try {
      const res = await tripService.listTrips()
      if (res && Array.isArray(res.trips)) {
        setBackendTrips(res.trips)
        if (res.metrics) setBackendMetrics(res.metrics)
      }
    } catch (err) {
      console.warn('LiveDeliveries fetch failed, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLiveTrips()
    const interval = setInterval(fetchLiveTrips, 15000)
    return () => clearInterval(interval)
  }, [fetchLiveTrips])

  // Transform backend trips into display deliveries, or fallback
  const allDeliveries = useMemo(() => {
    if (!backendTrips || backendTrips.length === 0) return FALLBACK_DELIVERIES

    return backendTrips.map((t) => {
      const stopsCount = Number(t.stops || 0)
      const completedCount = Number(t.completed_stops || 0)
      const pct = stopsCount > 0 ? Math.round((completedCount / stopsCount) * 100) : 0

      let statusType = 'ontime'
      let statusLabel = 'On Time'
      let statusDetail = null

      if (Number(t.open_issues) > 0) {
        statusType = 'problem'
        statusLabel = 'Problem'
        statusDetail = `${t.open_issues} issue(s) reported`
      } else if (Number(t.late_stops) > 0) {
        statusType = 'delayed'
        statusLabel = 'Delayed'
        statusDetail = `${t.late_stops} late stop(s)`
      } else if (t.status === 'completed' || (stopsCount > 0 && completedCount === stopsCount)) {
        statusType = 'completed'
        statusLabel = 'Completed'
      } else if (t.status === 'dispatched' || completedCount > 0) {
        statusType = 'ontime'
        statusLabel = 'On Time'
        if (Number(t.offline_records) > 0) {
          statusDetail = `${t.offline_records} offline synced`
        }
      } else {
        statusType = 'pending'
        statusLabel = t.status === 'loading' ? 'Loading' : 'Pending'
      }

      const vehicleLabel = t.vehicle_type === 'van' ? 'Van' : t.vehicle_temp === 'reefer' ? 'Refrigerated Truck' : '14ft Truck'
      const brandLabel = t.brand === 'Fresh' ? 'Waypoint Fresh' : t.brand === 'Style' ? 'Waypoint Style' : 'Waypoint Tech'
      const currentStopLabel = t.next_outlet_id
        ? `Stop ${t.next_stop_sequence || completedCount + 1} — ${t.next_outlet_id}`
        : completedCount === stopsCount && stopsCount > 0
        ? 'All stops completed'
        : 'Departing depot'

      const etaTime = t.last_arrival ? String(t.last_arrival).slice(0, 5) : '08:00 AM'
      const lastUpdateStr = t.dispatched_at
        ? new Date(t.dispatched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Scheduled'

      return {
        route: t.trip_id,
        vehicle: t.vehicle_id,
        vehicleType: vehicleLabel,
        depot: t.depot,
        brand: brandLabel,
        driver: t.driver_name || 'Assigned Driver',
        stops: `${stopsCount} stops`,
        currentStop: currentStopLabel,
        completedStops: completedCount,
        totalStops: stopsCount,
        percent: pct,
        eta: etaTime,
        status: statusLabel,
        statusType,
        statusDetail,
        lastUpdate: lastUpdateStr,
        openIssues: Number(t.open_issues || 0),
        lateStops: Number(t.late_stops || 0),
        offlineRecords: Number(t.offline_records || 0),
      }
    })
  }, [backendTrips])

  // Live Metric summary
  const metrics = useMemo(() => {
    if (backendMetrics) return backendMetrics
    const active = allDeliveries.filter((d) => d.statusType === 'ontime').length
    const completed = allDeliveries.filter((d) => d.statusType === 'completed').length
    const delayed = allDeliveries.filter((d) => d.statusType === 'delayed').length
    const problems = allDeliveries.filter((d) => d.statusType === 'problem').length
    const lateStops = allDeliveries.reduce((sum, d) => sum + (d.lateStops || 0), 0)
    const offlineRecords = allDeliveries.reduce((sum, d) => sum + (d.offlineRecords || 0), 0)
    const openIssues = allDeliveries.reduce((sum, d) => sum + (d.openIssues || 0), 0)
    return { active, completed, delayed, problems, lateStops, offlineRecords, openIssues }
  }, [backendMetrics, allDeliveries])

  // Needs Attention alerts
  const attentionAlerts = useMemo(() => {
    const list = []
    for (const d of allDeliveries) {
      if (d.statusType === 'problem') {
        list.push({
          routeId: d.route,
          outletId: d.currentStop,
          highlight: 'Delivery issue reported',
          detail: d.statusDetail || 'Awaiting review',
        })
      } else if (d.statusType === 'delayed') {
        list.push({
          routeId: d.route,
          outletId: d.currentStop,
          highlight: 'Delayed arrival',
          detail: d.statusDetail || 'Behind reported window',
        })
      } else if (d.offlineRecords > 0) {
        list.push({
          routeId: d.route,
          outletId: d.currentStop,
          highlight: 'Offline synced records',
          detail: `${d.offlineRecords} records uploaded from field cache`,
        })
      }
    }
    return list.slice(0, 4)
  }, [allDeliveries])

  // Filter logic
  const filteredDeliveries = useMemo(() => {
    return allDeliveries.filter((d) => {
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
  }, [allDeliveries, activeTab, searchQuery, depotFilter, brandFilter, statusFilter, vehicleTypeFilter])

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
          <LiveMetricCards metrics={metrics} />

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
          <LiveAttentionBanner alerts={attentionAlerts} totalCount={attentionAlerts.length} />


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
