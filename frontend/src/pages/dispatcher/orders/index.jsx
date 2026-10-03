import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import OrdersStatCards from '../../../components/dispatcher/orders/OrdersStatCards'
import OrdersFilterBar from '../../../components/dispatcher/orders/OrdersFilterBar'
import BulkActionBanner from '../../../components/dispatcher/orders/BulkActionBanner'
import OrdersTable from '../../../components/dispatcher/orders/OrdersTable'
import OrdersAttentionSection from '../../../components/dispatcher/orders/OrdersAttentionSection'
import DeferOrdersModal from '../../../components/dispatcher/orders/DeferOrdersModal'
import { orderService } from '../../../services/orderService'
import {
  DEFERRAL_REASONS,
  dispatchStatusOf,
  formatKg,
  formatM3,
  formatShortDate,
  formatTimestamp,
  formatWindow,
  outletLabel,
  requirementOf,
} from '../../../utils/orderFormat'
import './Orders.css'

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  brand: 'all',
  depot: 'all',
  date: 'all',
  window: 'any',
  priority: 'all',
  requirement: 'all',
}

// API order → row shape rendered by OrdersTable.
function toRow(o) {
  const status = dispatchStatusOf(o.status)
  const requirement = requirementOf(o)
  const urgent = o.priority === 'urgent'
  const repeatDeferral = o.status === 'deferred' && o.consecutive_deferral_count > 1
  return {
    id: o.order_id,
    rawStatus: o.status,
    priorityRaw: o.priority,
    outlet: outletLabel(o),
    brand: o.brand,
    date: formatShortDate(o.target_delivery_date),
    window: formatWindow(o.requested_window_open, o.requested_window_close),
    weight: formatKg(o.total_weight_kg),
    volume: formatM3(o.total_volume_m3),
    requirement: requirement.label,
    requirementType: requirement.type,
    priority: urgent ? 'Urgent' : 'Normal',
    priorityType: urgent ? 'urgent' : 'normal',
    status: repeatDeferral ? `Deferred ${o.consecutive_deferral_count}×` : status.label,
    statusType: repeatDeferral ? 'exception' : status.type,
    statusDetail: o.status === 'deferred'
      ? `${DEFERRAL_REASONS[o.deferral_reason] || 'Deferred'} — next run ${formatShortDate(o.next_scheduled_date)}`
      : null,
    vehicle: o.vehicle_id ? `${o.vehicle_id}${o.trip_status === 'draft' ? ' (draft plan)' : ` • Trip ${o.trip_id.split('-').pop()}`}` : 'Not Assigned',
    isUrgentWindow: urgent && ['submitted', 'confirmed', 'deferred'].includes(o.status),
  }
}

export default function DispatcherOrders() {
  const navigate = useNavigate()

  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [data, setData] = useState({ orders: [], attention: [], stats: {}, pagination: undefined, facets: { dates: [] } })
  const [intake, setIntake] = useState([])
  const [loadState, setLoadState] = useState({ loading: true, error: null, syncedAt: null })

  const [selectedOrderIds, setSelectedOrderIds] = useState([])
  const [isDeferOpen, setIsDeferOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [closingDate, setClosingDate] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, tone = 'info') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 5000)
  }

  // Debounce free-text search so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300)
    return () => clearTimeout(timer)
  }, [filters.search])

  const load = useCallback(async () => {
    setLoadState((s) => ({ ...s, loading: true }))
    try {
      const [list, intakeRes] = await Promise.all([
        orderService.listOrders({ ...filters, search: debouncedSearch, page, pageSize }),
        orderService.getIntake(),
      ])
      setData(list)
      setIntake(intakeRes.dates)
      setLoadState({ loading: false, error: null, syncedAt: new Date().toISOString() })
    } catch (err) {
      setLoadState((s) => ({ ...s, loading: false, error: err.message }))
    }
  }, [filters, debouncedSearch, page, pageSize])

  useEffect(() => {
    load()
  }, [load])

  const rows = data.orders.map(toRow)
  const selectedRows = rows.filter((r) => selectedOrderIds.includes(r.id))
  // Selection may include orders from other pages; keep the ids but describe what is visible.
  const awaitingCutoff = selectedRows.filter((r) => r.rawStatus === 'submitted').length
  const plannable = selectedRows.filter((r) => ['confirmed', 'deferred'].includes(r.rawStatus)).length
  const bulkHint = awaitingCutoff
    ? `${awaitingCutoff} still awaiting cutoff — close intake for their date before planning`
    : plannable === selectedRows.length
      ? 'All selected orders are ready for planning'
      : `${plannable} of ${selectedRows.length} selected orders can be planned or deferred`
  const allUrgent = selectedRows.length > 0 && selectedRows.every((r) => r.priorityRaw === 'urgent')

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    const pageIds = rows.map((o) => o.id)
    if (pageIds.length > 0 && pageIds.every((id) => selectedOrderIds.includes(id))) {
      setSelectedOrderIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedOrderIds((prev) => [...new Set([...prev, ...pageIds])])
    }
  }

  const runAction = async (action) => {
    setIsBusy(true)
    try {
      const res = await action()
      showToast(res.message, 'success')
      setSelectedOrderIds([])
      await load()
      return true
    } catch (err) {
      showToast(err.message, 'error')
      return false
    } finally {
      setIsBusy(false)
    }
  }

  const handleMarkPriority = () =>
    runAction(() => orderService.setPriority(selectedOrderIds, allUrgent ? 'normal' : 'urgent'))

  const handleDefer = async (reason, explanation) => {
    if (await runAction(() => orderService.deferOrders(selectedOrderIds, reason, explanation))) {
      setIsDeferOpen(false)
    }
  }

  const handleCloseIntake = async (date, submittedCount) => {
    const ok = window.confirm(
      `Close order intake for ${formatShortDate(date)}?\n\n${submittedCount} submitted order(s) will be confirmed for planning. Stores will no longer be able to order for this date.`
    )
    if (!ok) return
    setClosingDate(date)
    await runAction(() => orderService.closeIntake(date))
    setClosingDate(null)
  }

  const synced = loadState.syncedAt ? formatTimestamp(loadState.syncedAt).time : '—'

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

          {loadState.error && (
            <div className="orders-load-error" role="alert">
              <span>Unable to load orders: {loadState.error}</span>
              <button type="button" onClick={load}>Retry</button>
            </div>
          )}

          {/* 6 Metric Stat Cards */}
          <OrdersStatCards
            stats={data.stats}
            activeStatus={filters.status}
            onSelectStatus={(status) => handleFilterChange('status', status)}
          />

          {/* Filter Bar */}
          <OrdersFilterBar
            filters={filters}
            dateOptions={data.facets?.dates || []}
            onChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Action Banner */}
          <BulkActionBanner
            selectedCount={selectedOrderIds.length}
            hint={bulkHint}
            allUrgent={allUrgent}
            isBusy={isBusy}
            onClearSelection={() => setSelectedOrderIds([])}
            onMarkPriority={handleMarkPriority}
            onDefer={() => setIsDeferOpen(true)}
            onAddToPlanner={() => navigate('/dispatcher/delivery-planner', { state: { orderIds: selectedOrderIds } })}
          />

          {/* All Orders Table */}
          <OrdersTable
            orders={rows}
            selectedOrderIds={selectedOrderIds}
            onToggleSelectOrder={toggleSelectOrder}
            onToggleSelectAll={toggleSelectAll}
            pagination={data.pagination}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            isLoading={loadState.loading}
            onClearFilters={handleClearFilters}
          />

          {/* Attention Items & Order Intake */}
          <OrdersAttentionSection
            attention={data.attention}
            intake={intake}
            isClosing={closingDate}
            onCloseIntake={handleCloseIntake}
          />

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>Operational data synced at {synced} • Asia/Colombo</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>

      <DeferOrdersModal
        isOpen={isDeferOpen}
        orderIds={selectedOrderIds}
        isBusy={isBusy}
        onClose={() => setIsDeferOpen(false)}
        onConfirm={handleDefer}
      />

      {toast && (
        <div className={`orders-toast tone-${toast.tone}`} role="status">
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss">✕</button>
        </div>
      )}
    </div>
  )
}
