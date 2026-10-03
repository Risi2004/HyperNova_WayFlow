import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import OrderHistoryHeader from '../../../components/storeManager/orderHistory/OrderHistoryHeader'
import OutletInfoBanner from '../../../components/storeManager/orderHistory/OutletInfoBanner'
import OrderHistoryMetricsCards from '../../../components/storeManager/orderHistory/OrderHistoryMetricsCards'
import OrderHistoryFiltersBar from '../../../components/storeManager/orderHistory/OrderHistoryFiltersBar'
import OrderHistoryTable from '../../../components/storeManager/orderHistory/OrderHistoryTable'
import OrderHistoryDetailsModal from '../../../components/storeManager/orderHistory/OrderHistoryDetailsModal'
import './OrderHistory.css'
import { useCurrentUser } from '../../../hooks/useCurrentUser'
import { orderService } from '../../../services/orderService'
import { colomboToday, formatDate, formatTimestamp } from '../../../utils/orderFormat'

const PAGE_SIZE = 10
const COMPLETED = ['delivered', 'partial', 'received', 'disputed']
const DOCK_LABELS = { rear_dock: 'Rear loading dock', street: 'Curbside unloading', mall_bay: 'Shared mall bay' }

// API order → history row. History covers finished orders plus deferred ones.
function toHistoryRow(o) {
  const status = COMPLETED.includes(o.status)
    ? 'Completed'
    : o.status === 'cancelled'
      ? 'Cancelled'
      : ['deferred', 'failed'].includes(o.status)
        ? 'Deferred'
        : null
  if (!status) return null
  return {
    id: o.order_id,
    orderDate: formatTimestamp(o.submitted_at || o.created_at).date,
    deliveryDate: formatDate(o.target_delivery_date),
    deliveryIso: o.target_delivery_date,
    createdAt: o.created_at,
    itemsVolume: `${o.total_units} Units (${o.sku_count} SKU${o.sku_count === 1 ? '' : 's'})`,
    deliveryType: o.temp_requirement === 'chilled' ? 'Refrigerated' : 'Standard',
    status,
    receiptStatus: o.received_at ? 'Confirmed' : 'Not Confirmed',
    tripId: o.trip_id,
    driverName: o.driver_name,
    receivedBy: o.received_by_name,
    receivedAtLabel: o.received_at ? `${formatTimestamp(o.received_at).date} at ${formatTimestamp(o.received_at).time}` : null,
    outletId: o.outlet_id,
  }
}

export default function OrderHistory() {
  const user = useCurrentUser()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [deliveryType, setDeliveryType] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rows, setRows] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let active = true
    orderService
      .getMyOrders({ include_cancelled: true })
      .then((res) => active && setRows(res.orders.map(toHistoryRow).filter(Boolean)))
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [])

  const history = useMemo(() => rows || [], [rows])
  const counts = {
    all: history.length,
    completed: history.filter((r) => r.status === 'Completed').length,
    deferred: history.filter((r) => r.status === 'Deferred').length,
    cancelled: history.filter((r) => r.status === 'Cancelled').length,
  }

  // Filtering
  const filteredOrders = useMemo(() => {
    const today = colomboToday()
    const days = { '7d': 7, '30d': 30, '90d': 90 }[dateRange]
    const since = days ? new Date(Date.parse(`${today}T00:00:00Z`) - days * 86400000).toISOString().slice(0, 10) : null

    const list = history.filter((order) => {
      // Date range (by delivery date)
      if (since && order.deliveryIso < since) return false
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = order.id.toLowerCase().includes(q)
        const matchesVolume = order.itemsVolume.toLowerCase().includes(q)
        if (!matchesId && !matchesVolume) return false
      }

      // Status
      if (activeStatus !== 'all') {
        if (activeStatus === 'completed' && order.status !== 'Completed') return false
        if (activeStatus === 'cancelled' && order.status !== 'Cancelled') return false
        if (activeStatus === 'deferred' && order.status !== 'Deferred') return false
      }

      // Delivery Type
      if (deliveryType !== 'all') {
        if (order.deliveryType.toLowerCase() !== deliveryType.toLowerCase()) return false
      }

      return true
    })
    return sortOrder === 'oldest' ? [...list].reverse() : list
  }, [history, searchQuery, activeStatus, deliveryType, dateRange, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const pageRows = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveStatus('all')
    setDateRange('30d')
    setDeliveryType('all')
    setSortOrder('newest')
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedOrder(null)
    setIsModalOpen(false)
  }

  const handleReportIssueFromModal = (orderId) => {
    navigate(orderId ? `/store-manager/report-issue?orderId=${encodeURIComponent(orderId)}` : '/store-manager/report-issue')
  }

  const handleCreateOrder = () => {
    navigate('/store-manager/create-order')
  }

  const handleBackToOrders = () => {
    navigate('/store-manager/my-orders')
  }

  return (
    <div className="oh-page-wrapper">
      {/* Store Manager Sidebar */}
      <StoreManagerSidebar activeItem="Order History" />

      {/* Main Content */}
      <main className="oh-main-content">
        {/* Top Header */}
        <OrderHistoryHeader
          onCreateOrder={handleCreateOrder}
          onBackToOrders={handleBackToOrders}
        />

        {/* Outlet Info Banner */}
        <OutletInfoBanner
          outletName={user?.outlet ? `Waypoint ${user.outlet.brand} – ${user.outlet.district}` : user?.facility}
          outletId={`# ${user?.outlet_id || '—'}`}
          totalHistorical={rows ? `${counts.all} Total` : '—'}
          stagingDock={DOCK_LABELS[user?.outlet?.dock_type] || 'Outlet dock'}
          syncStatus={loadError ? `Unable to load history: ${loadError}` : rows ? 'Live from WayFlow dispatch' : 'Loading history…'}
        />

        {/* 4 Metric Cards */}
        <OrderHistoryMetricsCards
          metrics={{
            total: counts.all,
            completed: counts.completed,
            completedRate: counts.all ? `${Math.round((counts.completed / counts.all) * 1000) / 10}% Rate` : '—',
            deferred: counts.deferred,
            cancelled: counts.cancelled,
          }}
          activeTab={activeStatus}
          onSelectTab={setActiveStatus}
        />

        {/* Search & Filters */}
        <OrderHistoryFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          deliveryType={deliveryType}
          onDeliveryTypeChange={setDeliveryType}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onClearFilters={handleClearFilters}
          counts={counts}
          dockLabel={`${user?.outlet_id || 'Outlet'} Dock`}
        />

        {/* Historical Orders Table */}
        <OrderHistoryTable
          orders={pageRows}
          onViewOrder={handleViewOrder}
          currentPage={page}
          totalPages={totalPages}
          totalOrders={filteredOrders.length}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* Order Details & e-POD Modal */}
      <OrderHistoryDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onReportIssue={handleReportIssueFromModal}
      />
    </div>
  )
}
