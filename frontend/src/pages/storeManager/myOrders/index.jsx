import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import MyOrdersMetricsCards from '../../../components/storeManager/myOrders/MyOrdersMetricsCards'
import MyOrdersFiltersBar from '../../../components/storeManager/myOrders/MyOrdersFiltersBar'
import MyOrdersTable from '../../../components/storeManager/myOrders/MyOrdersTable'
import OrderDetailsModal from '../../../components/storeManager/myOrders/OrderDetailsModal'
import { orderService } from '../../../services/orderService'
import {
  DEFERRAL_REASONS,
  STORE_STATUS,
  colomboToday,
  formatDate,
  formatShortDate,
  formatTime,
  formatTimestamp,
  formatWindow,
} from '../../../utils/orderFormat'
import './MyOrders.css'

// Maps an API order onto the row shape the My Orders components render.
function toRow(o, today) {
  const status = STORE_STATUS[o.status] || o.status.toUpperCase()
  const placed = formatTimestamp(o.submitted_at || o.created_at)
  const eta = o.planned_arrival_time ? `ETA ${formatTime(o.planned_arrival_time)}` : null

  const subByStatus = {
    PENDING: 'Confirms at 4:00 PM cutoff',
    CONFIRMED: 'Waiting for dispatcher planning',
    SCHEDULED: [eta, o.vehicle_id].filter(Boolean).join(' • ') || 'Assigned to a delivery run',
    IN_DELIVERY: [eta, o.trip_id].filter(Boolean).join(' • '),
    DEFERRED: o.next_scheduled_date
      ? `Moved to ${formatShortDate(o.next_scheduled_date)} • ${DEFERRAL_REASONS[o.deferral_reason] || 'Capacity'}`
      : 'Delivery attempt failed',
    COMPLETED: o.received_by_name ? `Signed by ${o.received_by_name}` : o.status === 'partial' ? 'Part delivered' : 'Delivered',
  }

  return {
    id: o.order_id,
    priority: (o.priority || 'normal').toUpperCase(),
    hubOrRoute: o.trip_id ? `Trip ${o.trip_id} • ${o.vehicle_id}` : `${o.depot} DC`,
    placedDate: placed.date,
    placedTime: placed.time,
    itemCount: o.total_units,
    weightKg: Number(o.total_weight_kg),
    skusSummary: `${o.sku_count} SKU${o.sku_count === 1 ? '' : 's'} • ${o.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient'} • ${Number(o.total_volume_m3)} m³`,
    requestedDate: o.target_delivery_date === today ? `Today (${formatShortDate(today)})` : formatDate(o.target_delivery_date),
    requestedDateIso: o.target_delivery_date,
    deliveryWindow: formatWindow(o.requested_window_open, o.requested_window_close),
    status,
    statusSub: subByStatus[status] || null,
    isToday: o.target_delivery_date === today,
    tripId: o.trip_id,
    outletLabel: `Waypoint ${o.brand} – ${o.district} (${o.outlet_id})`,
    receivedBy: o.received_by_name,
    receiptStatus: o.receipt_status,
    createdAt: o.created_at,
  }
}

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

  const [orders, setOrders] = useState([])
  const [outletId, setOutletId] = useState('')
  const [loadState, setLoadState] = useState({ loading: true, error: null })

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Bumping reloadKey re-fetches the outlet's orders (after a withdrawal or a manual refresh).
  const [reloadKey, setReloadKey] = useState(0)
  const reloadOrders = () => setReloadKey((k) => k + 1)

  useEffect(() => {
    let active = true
    orderService
      .getMyOrders()
      .then((res) => {
        if (!active) return
        const today = colomboToday()
        setOrders(res.orders.map((o) => toRow(o, today)))
        setOutletId(res.outlet_id)
        setLoadState({ loading: false, error: null })
      })
      .catch((err) => active && setLoadState({ loading: false, error: err.message }))
    return () => {
      active = false
    }
  }, [reloadKey])

  const counts = useMemo(() => {
    const by = (status) => orders.filter((o) => o.status === status).length
    return {
      all: orders.length,
      pending: by('PENDING'),
      confirmed: by('CONFIRMED'),
      scheduled: by('SCHEDULED'),
      inDelivery: by('IN_DELIVERY'),
      completed: by('COMPLETED'),
      deferred: by('DEFERRED'),
    }
  }, [orders])

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    const today = colomboToday()
    const shift = (days) => new Date(Date.parse(`${today}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10)
    const inDateRange = (date) => {
      switch (dateFilter) {
        case 'TODAY':
          return date === today
        case 'TOMORROW':
          return date === shift(1)
        case 'NEXT_7_DAYS':
          return date >= today && date <= shift(7)
        case 'PAST_30_DAYS':
          return date < today && date >= shift(-30)
        default:
          return true
      }
    }

    const rows = orders.filter((order) => {
      // Status filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false
      }
      // Date filter
      if (!inDateRange(order.requestedDateIso)) {
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
    if (sortBy === 'EARLIEST') return [...rows].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
    if (sortBy === 'DELIVERY_DATE') return [...rows].sort((a, b) => String(a.requestedDateIso).localeCompare(String(b.requestedDateIso)))
    if (sortBy === 'PAYLOAD_WEIGHT') return [...rows].sort((a, b) => b.weightKg - a.weightKg)
    return rows
  }, [orders, statusFilter, dateFilter, searchQuery, sortBy])

  // Handlers
  const handleViewOrder = (order) => {
    setInspectingOrder(order)
    setIsReceiptModal(false)
  }

  const handleTrackOrder = (order) => {
    navigate(order.tripId ? `/store-manager/track-delivery/${order.tripId}` : '/store-manager/track-delivery')
  }

  const handleWithdraw = async (order) => {
    try {
      const res = await orderService.cancelOrder(order.id, 'Withdrawn by store manager')
      setInspectingOrder(null)
      showToast(res.message)
      reloadOrders()
    } catch (err) {
      showToast(err.message)
    }
  }

  const handleViewReceipt = (order) => {
    setInspectingOrder(order)
    setIsReceiptModal(true)
  }

  const handleExport = () => {
    const header = ['Order ID', 'Priority', 'Placed', 'Units', 'Weight (kg)', 'Requested Date', 'Window', 'Status', 'Detail']
    const lines = filteredOrders.map((o) =>
      [o.id, o.priority, `${o.placedDate} ${o.placedTime}`, o.itemCount, o.weightKg, o.requestedDate, o.deliveryWindow, o.status, o.statusSub || '']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${outletId || 'outlet'}-orders.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    showToast(`Exported ${filteredOrders.length} orders to CSV.`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = () => {
    reloadOrders()
    showToast('Refreshing order statuses from dispatch…')
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
              onClick={() => showToast(`Showing orders for outlet ${outletId}`)}
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
          counts={counts}
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
          statusCounts={counts}
          onRefresh={handleRefresh}
        />

        {(loadState.loading || loadState.error) && (
          <div className={`mo-page-state ${loadState.error ? 'error' : ''}`}>
            {loadState.error ? `Unable to load orders: ${loadState.error}` : 'Loading your orders…'}
          </div>
        )}

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
        onWithdraw={handleWithdraw}
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
