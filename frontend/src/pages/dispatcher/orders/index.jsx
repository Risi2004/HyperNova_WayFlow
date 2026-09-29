import { useState } from 'react'
import Sidebar from '../../../components/layout/Sidebar'
import Header from '../../../components/layout/Header'
import OrdersStatCards from '../../../components/orders/OrdersStatCards'
import OrdersFilterBar from '../../../components/orders/OrdersFilterBar'
import BulkActionBanner from '../../../components/orders/BulkActionBanner'
import OrdersTable from '../../../components/orders/OrdersTable'
import OrdersAttentionSection from '../../../components/orders/OrdersAttentionSection'
import './Orders.css'

export default function DispatcherOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedRequirement, setSelectedRequirement] = useState('all')

  // Pre-selected orders based on screenshot
  const [selectedOrderIds, setSelectedOrderIds] = useState([
    'ORD-2026-1048',
    'ORD-2026-1052',
    'ORD-2026-1057',
  ])

  const initialOrders = [
    {
      id: 'ORD-2026-1048',
      outlet: 'Waypoint Fresh – Colombo 03',
      brand: 'Fresh',
      date: '26 Sep',
      window: '10:00 AM – 12:00 PM',
      weight: '420 kg',
      volume: '3.8 m³',
      requirement: 'Refrigerated',
      requirementType: 'refrigerated',
      priority: 'High',
      priorityType: 'high',
      status: 'Pending Planning',
      statusType: 'pending',
      vehicle: 'Not Assigned',
      isUrgentWindow: false,
    },
    {
      id: 'ORD-2026-1052',
      outlet: 'Waypoint Fresh – Kandy City',
      brand: 'Fresh',
      date: '26 Sep',
      window: '10:30 AM – 11:30 AM',
      weight: '285 kg',
      volume: '2.2 m³',
      requirement: 'Refrigerated',
      requirementType: 'refrigerated',
      priority: 'Urgent',
      priorityType: 'urgent',
      status: 'Pending Planning',
      statusType: 'pending',
      vehicle: 'Not Assigned',
      isUrgentWindow: true,
    },
    {
      id: 'ORD-2026-1057',
      outlet: 'Waypoint Style – Galle Fort',
      brand: 'Style',
      date: '26 Sep',
      window: '1:00 PM – 3:00 PM',
      weight: '160 kg',
      volume: '1.8 m³',
      requirement: 'Van Only',
      requirementType: 'van',
      priority: 'Normal',
      priorityType: 'normal',
      status: 'Planned',
      statusType: 'planned',
      vehicle: 'WP-CA-2847',
      isUrgentWindow: false,
    },
    {
      id: 'ORD-2026-1061',
      outlet: 'Waypoint Tech – Nugegoda',
      brand: 'Tech',
      date: '26 Sep',
      window: '11:00 AM – 1:00 PM',
      weight: '340 kg',
      volume: '2.6 m³',
      requirement: 'Refrigerated',
      requirementType: 'refrigerated',
      priority: 'High',
      priorityType: 'high',
      status: 'Exception',
      statusType: 'exception',
      vehicle: 'Not Assigned',
      isUrgentWindow: false,
    },
    {
      id: 'ORD-2026-1064',
      outlet: 'Waypoint Style – Negombo',
      brand: 'Style',
      date: '27 Sep',
      window: '9:00 AM – 11:00 AM',
      weight: '190 kg',
      volume: '2.0 m³',
      requirement: 'Van Only',
      requirementType: 'van',
      priority: 'Normal',
      priorityType: 'normal',
      status: 'Loading',
      statusType: 'loading',
      vehicle: 'WP-NB-1162',
      isUrgentWindow: false,
    },
    {
      id: 'ORD-2026-1068',
      outlet: 'Waypoint Tech – Kurunegala',
      brand: 'Tech',
      date: '27 Sep',
      window: '2:00 PM – 4:00 PM',
      weight: '510 kg',
      volume: '4.1 m³',
      requirement: 'Standard',
      requirementType: 'standard',
      priority: 'High',
      priorityType: 'high',
      status: 'Planned',
      statusType: 'planned',
      vehicle: 'WP-KU-4091',
      isUrgentWindow: false,
    },
    {
      id: 'ORD-2026-1070',
      outlet: 'Waypoint Fresh – Colombo 07',
      brand: 'Fresh',
      date: '26 Sep',
      window: '12:00 PM – 2:00 PM',
      weight: '680 kg',
      volume: '5.6 m³',
      requirement: 'Standard',
      requirementType: 'standard',
      priority: 'Urgent',
      priorityType: 'urgent',
      status: 'Exception',
      statusType: 'exception',
      vehicle: 'Not Assigned',
      isUrgentWindow: true,
    },
    {
      id: 'ORD-2026-1074',
      outlet: 'Waypoint Style – Matara',
      brand: 'Style',
      date: '28 Sep',
      window: '9:30 AM – 12:00 PM',
      weight: '225 kg',
      volume: '2.4 m³',
      requirement: 'Van Only',
      requirementType: 'van',
      priority: 'Normal',
      priorityType: 'normal',
      status: 'Deferred',
      statusType: 'deferred',
      vehicle: 'Not Assigned',
      isUrgentWindow: false,
    },
  ]

  // Filtered orders
  const filteredOrders = initialOrders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.outlet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.brand.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatus === 'all' || ord.statusType === selectedStatus

    const matchesRequirement =
      selectedRequirement === 'all' || ord.requirement === selectedRequirement

    return matchesSearch && matchesStatus && matchesRequirement
  })

  const toggleSelectOrder = (id) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter((item) => item !== id))
    } else {
      setSelectedOrderIds([...selectedOrderIds, id])
    }
  }

  const toggleSelectAll = () => {
    if (filteredOrders.every((o) => selectedOrderIds.includes(o.id))) {
      setSelectedOrderIds([])
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id))
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStatus('all')
    setSelectedRequirement('all')
  }

  return (
    <div className="orders-page-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeItem="Orders" />

      {/* Main Content */}
      <div className="orders-main-wrapper">
        <Header />

        <main className="orders-content">
          {/* Subheader */}
          <div className="orders-page-header-row">
            <p className="orders-page-subtitle">
              Review and prepare store orders for delivery planning.
            </p>
          </div>

          {/* 6 Metric Stat Cards */}
          <OrdersStatCards />

          {/* Filter Bar */}
          <OrdersFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedRequirement={selectedRequirement}
            setSelectedRequirement={setSelectedRequirement}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Action Banner */}
          <BulkActionBanner
            selectedCount={selectedOrderIds.length}
            onClearSelection={() => setSelectedOrderIds([])}
          />

          {/* All Orders Table */}
          <OrdersTable
            orders={filteredOrders}
            selectedOrderIds={selectedOrderIds}
            onToggleSelectOrder={toggleSelectOrder}
            onToggleSelectAll={toggleSelectAll}
          />

          {/* Attention Items & Alternate Empty State */}
          <OrdersAttentionSection onClearFilters={handleClearFilters} />

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
