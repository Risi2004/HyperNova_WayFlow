import { useState, useMemo, useEffect, useCallback } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import DeferredHeader from '../../../components/dispatcher/deferredOrders/DeferredHeader'
import DeferredStatCards from '../../../components/dispatcher/deferredOrders/DeferredStatCards'
import DeferredFilterBar from '../../../components/dispatcher/deferredOrders/DeferredFilterBar'
import DeferredBulkBanner from '../../../components/dispatcher/deferredOrders/DeferredBulkBanner'
import DeferredOrdersTable from '../../../components/dispatcher/deferredOrders/DeferredOrdersTable'
import TraceableDecisionsCard from '../../../components/dispatcher/deferredOrders/TraceableDecisionsCard'
import EmptyStateCard from '../../../components/dispatcher/deferredOrders/EmptyStateCard'
import { orderService } from '../../../services/orderService'

import './DeferredOrders.css'

const FALLBACK_ORDERS = [
  {
    id: 'ORD-1072',
    outlet: 'OUT042',
    brand: 'Waypoint Fresh',
    orderValue: 'LKR 184,500',
    weight: '620 kg',
    volume: '4.2 m³',
    window: '05:30-08:00',
    depot: 'Peliyagoda',
    reasonTitle: 'Insufficient Capacity',
    reasonSub: 'Insufficient refrigerated capacity',
    nextRun: 'Mon, 28 Sep',
    consecutive: 2,
  },
  {
    id: 'ORD-1081',
    outlet: 'OUT061',
    brand: 'Waypoint Style',
    orderValue: 'LKR 126,800',
    weight: '390 kg',
    volume: '8.1 m³',
    window: '07:00-08:00',
    depot: 'Peliyagoda',
    reasonTitle: 'Insufficient Capacity',
    reasonSub: 'Vehicle volume capacity',
    nextRun: 'Next available run',
    consecutive: 1,
  },
  {
    id: 'ORD-1087',
    outlet: 'OUT019',
    brand: 'Waypoint Tech',
    orderValue: 'LKR 342,900',
    weight: '780 kg',
    volume: '3.8 m³',
    window: '08:00-09:00',
    depot: 'Kandy',
    reasonTitle: 'No Suitable Vehicle',
    reasonSub: 'No suitable vehicle available',
    nextRun: 'Next available run',
    consecutive: 1,
  },
  {
    id: 'ORD-1090',
    outlet: 'OUT033',
    brand: 'Waypoint Fresh',
    orderValue: 'LKR 98,400',
    weight: '540 kg',
    volume: '3.2 m³',
    window: '06:15-06:45',
    depot: 'Peliyagoda',
    reasonTitle: 'Delivery Window Conflict',
    reasonSub: 'Fixed window cannot be reached',
    nextRun: 'Next available run',
    consecutive: 1,
  },
  {
    id: 'ORD-1094',
    outlet: 'OUT078',
    brand: 'Waypoint Tech',
    orderValue: 'LKR 217,600',
    weight: '410 kg',
    volume: '2.6 m³',
    window: '07:30-08:15',
    depot: 'Kandy',
    reasonTitle: 'Vehicle Access Restriction',
    reasonSub: 'Outlet is van-access only',
    nextRun: 'Next available run',
    consecutive: 1,
  },
  {
    id: 'ORD-1102',
    outlet: 'OUT052',
    brand: 'Waypoint Style',
    orderValue: 'LKR 154,200',
    weight: '430 kg',
    volume: '2.2 m³',
    window: '09:00-09:45',
    depot: 'Kandy',
    reasonTitle: 'Fuel Quota Constraint',
    reasonSub: 'Weekly fuel quota unavailable',
    nextRun: 'Next available run',
    consecutive: 1,
  },
]

export default function DeferredOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [reasonFilter, setReasonFilter] = useState('All')
  const [windowFilter, setWindowFilter] = useState('All')
  const [nextRunFilter, setNextRunFilter] = useState('All')

  const [selectedIds, setSelectedIds] = useState(['ORD-1072', 'ORD-1081', 'ORD-1087'])
  const [currentPage, setCurrentPage] = useState(1)

  const [backendOrders, setBackendOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDeferredOrders = useCallback(async () => {
    try {
      const res = await orderService.listOrders({ status: 'deferred' })
      if (res && Array.isArray(res.orders)) {
        setBackendOrders(res.orders)
      }
    } catch (err) {
      console.warn('DeferredOrders fetch failed, using fallback:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeferredOrders()
  }, [fetchDeferredOrders])

  // Transform backend deferred orders
  const allOrders = useMemo(() => {
    if (!backendOrders || backendOrders.length === 0) return FALLBACK_ORDERS

    return backendOrders.map((o) => {
      const brandLabel = o.brand === 'Fresh' ? 'Waypoint Fresh' : o.brand === 'Style' ? 'Waypoint Style' : 'Waypoint Tech'
      const weightVal = `${Math.round(Number(o.total_weight_kg || 0))} kg`
      const volVal = `${Number(o.total_volume_m3 || 0).toFixed(1)} m³`
      const windowVal = `${String(o.requested_window_open || '06:00').slice(0, 5)}-${String(o.requested_window_close || '08:00').slice(0, 5)}`

      let reasonTitle = 'Insufficient Capacity'
      if (o.deferral_reason === 'no_reefer_available') reasonTitle = 'Insufficient Capacity'
      else if (o.deferral_reason === 'no_van_available') reasonTitle = 'Vehicle Access Restriction'
      else if (o.deferral_reason === 'time_window') reasonTitle = 'Delivery Window Conflict'
      else if (o.deferral_reason === 'fuel_quota') reasonTitle = 'Fuel Quota Constraint'
      else if (o.deferral_reason === 'outlet_access') reasonTitle = 'Vehicle Access Restriction'

      const reasonSub = o.deferral_explanation || (o.deferral_reason ? o.deferral_reason.replace(/_/g, ' ') : 'Deferred during plan allocation')
      const nextRunLabel = o.next_scheduled_date
        ? new Date(o.next_scheduled_date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
        : 'Next available run'

      return {
        id: o.order_id,
        outlet: o.outlet_id,
        brand: brandLabel,
        orderValue: `LKR ${(Number(o.total_units || 20) * 1500).toLocaleString()}`,
        weight: weightVal,
        volume: volVal,
        window: windowVal,
        depot: o.depot,
        reasonTitle,
        reasonSub,
        nextRun: nextRunLabel,
        consecutive: Number(o.consecutive_deferral_count || 1),
      }
    })
  }, [backendOrders])

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = allOrders.length
    const consecutive = allOrders.filter((o) => o.consecutive > 1).length
    const capacity = allOrders.filter((o) => o.reasonTitle === 'Insufficient Capacity').length
    const vehicle = allOrders.filter((o) => o.reasonTitle === 'Vehicle Access Restriction' || o.reasonTitle === 'Delivery Window Conflict' || o.reasonTitle === 'Fuel Quota Constraint').length
    return { total, consecutive, capacity, vehicle }
  }, [allOrders])

  // Filtering
  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          order.id.toLowerCase().includes(q) ||
          order.outlet.toLowerCase().includes(q) ||
          order.brand.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }
      if (depotFilter !== 'All' && order.depot !== depotFilter) return false
      if (brandFilter !== 'All' && order.brand !== brandFilter) return false
      if (reasonFilter !== 'All' && order.reasonTitle !== reasonFilter) return false
      if (windowFilter !== 'All' && order.window !== windowFilter) return false
      if (nextRunFilter !== 'All' && order.nextRun !== nextRunFilter) return false
      return true
    })
  }, [allOrders, searchQuery, depotFilter, brandFilter, reasonFilter, windowFilter, nextRunFilter])

  // Toggle selection
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    const allIds = filteredOrders.map((o) => o.id)
    const isAllChecked = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
    if (isAllChecked) {
      setSelectedIds([])
    } else {
      setSelectedIds(allIds)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDepotFilter('All')
    setBrandFilter('All')
    setReasonFilter('All')
    setWindowFilter('All')
    setNextRunFilter('All')
  }

  return (
    <div className="deferred-page-container">
      {/* Sidebar with Deferred Orders Active */}
      <Sidebar activeItem="Deferred Orders" />

      {/* Main Content Area */}
      <div className="deferred-main-wrapper">
        <Header />

        <main className="deferred-content">
          {/* Header Row & Global Controls */}
          <DeferredHeader />

          {/* 4 Summary Stat Cards */}
          <DeferredStatCards stats={stats} />

          {/* Multi-Filter & Search Bar */}
          <DeferredFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            depotFilter={depotFilter}
            setDepotFilter={setDepotFilter}
            brandFilter={brandFilter}
            setBrandFilter={setBrandFilter}
            reasonFilter={reasonFilter}
            setReasonFilter={setReasonFilter}
            windowFilter={windowFilter}
            setWindowFilter={setWindowFilter}
            nextRunFilter={nextRunFilter}
            setNextRunFilter={setNextRunFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Active Selection Bulk Banner */}
          {selectedIds.length > 0 && (
            <DeferredBulkBanner
              selectedCount={selectedIds.length}
              onSelectAll={handleToggleSelectAll}
            />
          )}

          {/* Deferred Orders Grid Table */}
          <DeferredOrdersTable
            orders={filteredOrders}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            currentPage={currentPage}
            totalPages={2}
            onPageChange={setCurrentPage}
          />

          {/* Bottom Row: Traceable Decisions & Associated Empty State */}
          <div className="deferred-bottom-two-col">
            <TraceableDecisionsCard />
            <EmptyStateCard />
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
