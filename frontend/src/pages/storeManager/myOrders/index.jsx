import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import MyOrdersMetricsCards from '../../../components/storeManager/myOrders/MyOrdersMetricsCards'
import MyOrdersFiltersBar from '../../../components/storeManager/myOrders/MyOrdersFiltersBar'
import MyOrdersTable from '../../../components/storeManager/myOrders/MyOrdersTable'
import OrderDetailsModal from '../../../components/storeManager/myOrders/OrderDetailsModal'
import './MyOrders.css'

const INITIAL_ORDERS = [
  {
    id: 'ORD-1042',
    priority: 'URGENT',
    hubOrRoute: 'Peliyagoda DC #04',
    placedDate: 'Sep 28, 2026',
    placedTime: '08:15 AM',
    itemCount: 18,
    weightKg: 656,
    skusSummary: '3 SKUs (10 Amb, 8 Chilled)',
    requestedDate: 'Sep 29, 2026',
    deliveryWindow: '10:30 – 11:00 AM',
    status: 'SCHEDULED',
    isToday: false,
  },
  {
    id: 'ORD-1041',
    priority: 'NORMAL',
    hubOrRoute: 'Route R-10 Colombo West',
    placedDate: 'Sep 28, 2026',
    placedTime: '07:40 AM',
    itemCount: 12,
    weightKg: 340,
    skusSummary: '2 SKUs (Fresh Bakery & Dairy)',
    requestedDate: 'Today (Sep 28)',
    deliveryWindow: '02:00 – 02:30 PM',
    status: 'IN_DELIVERY',
    statusSub: 'ETA ~25 min (TR-024)',
    isToday: true,
  },
  {
    id: 'ORD-1038',
    priority: 'NORMAL',
    hubOrRoute: 'Peliyagoda Central DC',
    placedDate: 'Sep 27, 2026',
    placedTime: '04:20 PM',
    itemCount: 24,
    weightKg: 890,
    skusSummary: '4 SKUs (Dry Goods & Staples)',
    requestedDate: 'Sep 29, 2026',
    deliveryWindow: '08:00 – 08:30 AM',
    status: 'CONFIRMED',
    isToday: false,
  },
  {
    id: 'ORD-1035',
    priority: 'NORMAL',
    hubOrRoute: 'Awaiting Hub Assignment',
    placedDate: 'Sep 27, 2026',
    placedTime: '02:10 PM',
    itemCount: 8,
    weightKg: 180,
    skusSummary: '1 SKU (Beverage Crates)',
    requestedDate: 'Sep 29, 2026',
    deliveryWindow: '11:00 – 11:30 AM',
    status: 'PENDING',
    isToday: false,
  },
  {
    id: 'ORD-1032',
    priority: 'NORMAL',
    hubOrRoute: 'DC Capacity Reassigned',
    placedDate: 'Sep 26, 2026',
    placedTime: '06:15 PM',
    itemCount: 24,
    weightKg: 710,
    skusSummary: '3 SKUs (Packaged Goods)',
    requestedDate: 'Sep 29, 2026',
    deliveryWindow: '09:00 – 09:30 AM',
    status: 'DEFERRED',
    statusSub: 'Was Sep 28 • Vehicle cap.',
    isToday: false,
  },
  {
    id: 'ORD-1030',
    priority: null,
    hubOrRoute: 'Peliyagoda DC #01',
    placedDate: 'Sep 25, 2026',
    placedTime: '08:00 AM',
    itemCount: 12,
    weightKg: 310,
    skusSummary: '2 SKUs (Dairy & Chill)',
    requestedDate: 'Sep 26, 2026',
    deliveryWindow: '10:00 – 10:30 AM',
    status: 'COMPLETED',
    statusSub: 'Signed by M. Perera',
    isToday: false,
  },
  {
    id: 'ORD-1027',
    priority: null,
    hubOrRoute: 'Route Overcapacity',
    placedDate: 'Sep 25, 2026',
    placedTime: '11:30 AM',
    itemCount: 10,
    weightKg: 280,
    skusSummary: '2 SKUs (Dry Snacks)',
    requestedDate: 'Sep 30, 2026',
    deliveryWindow: '01:30 – 02:00 PM',
    status: 'DEFERRED',
    statusSub: 'Transit capacity load',
    isToday: false,
  },
  {
    id: 'ORD-1024',
    priority: null,
    hubOrRoute: 'Peliyagoda DC #02',
    placedDate: 'Sep 24, 2026',
    placedTime: '01:10 PM',
    itemCount: 20,
    weightKg: 620,
    skusSummary: '4 SKUs (Chilled & Fresh)',
    requestedDate: 'Sep 27, 2026',
    deliveryWindow: '03:45 PM Completed',
    status: 'COMPLETED',
    statusSub: 'Confirmed Intact',
    isToday: false,
  },
]

export default function MyOrders() {
  const navigate = useNavigate()

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('LATEST')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Selection & Modal State
  const [selectedOrderIds, setSelectedOrderIds] = useState([])
  const [inspectingOrder, setInspectingOrder] = useState(null)
  const [isReceiptModal, setIsReceiptModal] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return INITIAL_ORDERS.filter((order) => {
      // Status filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false
      }
      // Date filter
      if (dateFilter === 'TODAY' && !order.isToday) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesId = order.id.toLowerCase().includes(q)
        const matchesHub = order.hubOrRoute.toLowerCase().includes(q)
        const matchesSkus = order.skusSummary.toLowerCase().includes(q)
        if (!matchesId && !matchesHub && !matchesSkus) {
          return false
        }
      }
      return true
    })
  }, [statusFilter, dateFilter, searchQuery])

  // Handlers
  const handleViewOrder = (order) => {
    setInspectingOrder(order)
    setIsReceiptModal(false)
  }

  const handleTrackOrder = (order) => {
    navigate('/store-manager/track-delivery/TR-024')
  }

  const handleViewReceipt = (order) => {
    setInspectingOrder(order)
    setIsReceiptModal(true)
  }

  const handleExport = () => {
    showToast('Exporting 24 orders to CSV/Excel report...')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = () => {
    showToast('Orders list synchronized with Peliyagoda DC Dispatch.')
  }

  return (
    <div className="sm-my-orders-page">
      {/* Left Sidebar */}
      <StoreManagerSidebar activeItem="My Orders" />

      {/* Main Content */}
      <main className="sm-my-orders-main">
        {/* Top Header */}
        <div className="mo-top-header-row">
          <div>
            <nav className="mo-breadcrumb-nav">
              <span
                className="mo-bc-link"
                onClick={() => navigate('/store-manager/dashboard')}
              >
                Store Dashboard
              </span>
              <span className="mo-bc-sep">&gt;</span>
              <span className="mo-bc-curr">My Orders</span>
            </nav>

            <h1 className="mo-page-title">My Orders</h1>
            <p className="mo-page-desc">
              View and manage stock replenishment orders placed by your outlet.
            </p>
          </div>

          <div className="mo-header-utility-group">
            <button
              type="button"
              className="btn-mo-utility"
              title="Filter by target criteria"
              onClick={() => showToast('Target store outlet filter: Colombo 05 (OUT043)')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
            </button>

            <button
              type="button"
              className="btn-mo-utility"
              title="Export orders data"
              onClick={handleExport}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

            <button
              type="button"
              className="btn-mo-utility"
              title="Print orders list"
              onClick={handlePrint}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>
          </div>
        </div>

        {/* 5 Metric Summary Cards */}
        <MyOrdersMetricsCards
          counts={{
            all: 24,
            pending: 3,
            inDelivery: 2,
            completed: 17,
            deferred: 2,
          }}
          activeFilter={statusFilter}
          onSelectFilter={(filterKey) => setStatusFilter(filterKey)}
        />

        {/* Subheader, Search & Status Filter Tabs */}
        <MyOrdersFiltersBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={{
            all: 24,
            pending: 3,
            confirmed: 2,
            scheduled: 2,
            inDelivery: 2,
            completed: 17,
            deferred: 2,
          }}
          onRefresh={handleRefresh}
        />

        {/* Orders Table */}
        <MyOrdersTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          onTrackOrder={handleTrackOrder}
          onViewReceipt={handleViewReceipt}
          selectedOrderIds={selectedOrderIds}
          setSelectedOrderIds={setSelectedOrderIds}
        />
      </main>

      {/* Inspect Order / Receipt Modal */}
      <OrderDetailsModal
        order={inspectingOrder}
        isOpen={Boolean(inspectingOrder)}
        onClose={() => setInspectingOrder(null)}
        isReceiptMode={isReceiptModal}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mo-toast-notification">
          <span>{toastMessage}</span>
          <button
            type="button"
            className="btn-mo-toast-close"
            onClick={() => setToastMessage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
