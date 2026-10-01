import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import OrderHistoryHeader from '../../../components/storeManager/orderHistory/OrderHistoryHeader'
import OutletInfoBanner from '../../../components/storeManager/orderHistory/OutletInfoBanner'
import OrderHistoryMetricsCards from '../../../components/storeManager/orderHistory/OrderHistoryMetricsCards'
import OrderHistoryFiltersBar from '../../../components/storeManager/orderHistory/OrderHistoryFiltersBar'
import OrderHistoryTable from '../../../components/storeManager/orderHistory/OrderHistoryTable'
import OrderHistoryDetailsModal from '../../../components/storeManager/orderHistory/OrderHistoryDetailsModal'
import './OrderHistory.css'

const MOCK_ORDER_HISTORY = [
  {
    id: 'ORD-0984',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0983',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0982',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Not Confirmed',
  },
  {
    id: 'ORD-0981',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (2SKUs)',
    deliveryType: 'Refrigerated',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0980',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Not Confirmed',
  },
  {
    id: 'ORD-0979',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0978',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Cancelled',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0977',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Not Confirmed',
  },
  {
    id: 'ORD-0976',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Cancelled',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0975',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0974',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0973',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Cancelled',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0972',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Not Confirmed',
  },
  {
    id: 'ORD-0971',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Cancelled',
    receiptStatus: 'Confirmed',
  },
  {
    id: 'ORD-0970',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    itemsVolume: '18 Items (3SKUs)',
    deliveryType: 'Standard',
    status: 'Completed',
    receiptStatus: 'Not Confirmed',
  },
]

export default function OrderHistory() {
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [deliveryType, setDeliveryType] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtering
  const filteredOrders = useMemo(() => {
    return MOCK_ORDER_HISTORY.filter((order) => {
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
  }, [searchQuery, activeStatus, deliveryType])

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
    navigate('/store-manager/report-issue')
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
          outletName="Colombo 05 Store"
          outletId="# OUT043"
          totalHistorical="128 Total"
          stagingDock="Bay 02 Dock Ramp"
          syncStatus="Synced with WayFlow Dispatch"
        />

        {/* 4 Metric Cards */}
        <OrderHistoryMetricsCards
          metrics={{
            total: 128,
            completed: 112,
            completedRate: '87.5% Rate',
            deferred: 9,
            cancelled: 7,
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
          counts={{
            all: 128,
            completed: 112,
            deferred: 9,
            cancelled: 7,
          }}
          dockLabel="Colombo 05 Dock"
        />

        {/* Historical Orders Table */}
        <OrderHistoryTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          currentPage={currentPage}
          totalPages={13}
          totalOrders={128}
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
