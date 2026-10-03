import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import DeferredHeader from '../../../components/dispatcher/deferredOrders/DeferredHeader'
import DeferredStatCards from '../../../components/dispatcher/deferredOrders/DeferredStatCards'
import DeferredFilterBar from '../../../components/dispatcher/deferredOrders/DeferredFilterBar'
import DeferredBulkBanner from '../../../components/dispatcher/deferredOrders/DeferredBulkBanner'
import DeferredOrdersTable from '../../../components/dispatcher/deferredOrders/DeferredOrdersTable'
import EmptyStateCard from '../../../components/dispatcher/deferredOrders/EmptyStateCard'
import { orderService } from '../../../services/orderService'
import { DEFERRAL_REASONS, formatKg, formatM3, formatShortDate, formatWindow } from '../../../utils/orderFormat'
import './DeferredOrders.css'

const PAGE = 15
const CAPACITY = ['capacity_exceeded', 'no_reefer_available', 'fuel_quota']
const ACCESS = ['no_van_available', 'time_window', 'outlet_access']

// The orders API pages at 100; deferred orders are few enough to load them all.
async function loadAllDeferred() {
  const first = await orderService.listOrders({ status: 'deferred', date: 'all', pageSize: 100, page: 1 })
  const pages = first.pagination.totalPages
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) => orderService.listOrders({ status: 'deferred', date: 'all', pageSize: 100, page: i + 2 }))
  )
  return [first, ...rest].flatMap((r) => r.orders)
}

export default function DeferredOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [reasonFilter, setReasonFilter] = useState('All')
  const [nextRunFilter, setNextRunFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true
    loadAllDeferred()
      .then((list) => {
        if (!active) return
        setOrders(list)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  const rows = useMemo(
    () =>
      (orders || [])
        .map((o) => ({
          id: o.order_id,
          outlet: o.outlet_id,
          district: o.district,
          brand: o.brand,
          units: o.total_units,
          weight: formatKg(o.total_weight_kg),
          volume: formatM3(o.total_volume_m3),
          window: formatWindow(o.requested_window_open, o.requested_window_close),
          depot: o.depot,
          temp: o.temp_requirement,
          reason: o.deferral_reason || 'dispatcher_decision',
          reasonTitle: DEFERRAL_REASONS[o.deferral_reason] || 'Deferred',
          reasonSub: o.deferral_explanation || '',
          originalDate: o.target_delivery_date,
          nextRunDate: o.next_scheduled_date,
          nextRun: o.next_scheduled_date ? formatShortDate(o.next_scheduled_date) : 'Not scheduled',
          consecutive: Number(o.consecutive_deferral_count || 1),
        }))
        .sort((a, b) => b.consecutive - a.consecutive || String(a.nextRunDate).localeCompare(String(b.nextRunDate))),
    [orders]
  )

  const stats = {
    total: rows.length,
    consecutive: rows.filter((o) => o.consecutive > 1).length,
    capacity: rows.filter((o) => CAPACITY.includes(o.reason)).length,
    access: rows.filter((o) => ACCESS.includes(o.reason)).length,
  }

  const options = useMemo(() => ({
    depots: [...new Set(rows.map((r) => r.depot))].sort(),
    brands: [...new Set(rows.map((r) => r.brand))].sort(),
    reasons: [...new Set(rows.map((r) => r.reason))].sort(),
    nextRuns: [...new Set(rows.map((r) => r.nextRunDate).filter(Boolean))].sort(),
  }), [rows])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((o) => {
      if (q && ![o.id, o.outlet, o.district, o.brand].some((s) => s.toLowerCase().includes(q))) return false
      if (depotFilter !== 'All' && o.depot !== depotFilter) return false
      if (brandFilter !== 'All' && o.brand !== brandFilter) return false
      if (reasonFilter !== 'All' && o.reason !== reasonFilter) return false
      if (nextRunFilter !== 'All' && o.nextRunDate !== nextRunFilter) return false
      return true
    })
  }, [rows, searchQuery, depotFilter, brandFilter, reasonFilter, nextRunFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const currentPage = Math.min(page, totalPages)
  const shown = filtered.slice((currentPage - 1) * PAGE, currentPage * PAGE)
  const selected = rows.filter((o) => selectedIds.includes(o.id))
  // The planner works one delivery date at a time: open it on the selected orders' next run.
  const plannerDate = [...new Set(selected.map((o) => o.nextRunDate).filter(Boolean))].sort()[0] || options.nextRuns[0]

  const toggle = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleAll = () => {
    const ids = shown.map((o) => o.id)
    const all = ids.length > 0 && ids.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) => (all ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]))
  }
  const filterSetter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="deferred-page-container">
      <Sidebar activeItem="Deferred Orders" />

      <div className="deferred-main-wrapper">
        <Header />

        <main className="deferred-content">
          <DeferredHeader plannerDate={plannerDate} />

          {error && <p className="deferred-page-state error">{error}</p>}
          {!orders && !error && <p className="deferred-page-state">Loading deferred orders…</p>}

          {orders && (
            <>
              <DeferredStatCards stats={stats} />

              <DeferredFilterBar
                options={options}
                searchQuery={searchQuery}
                setSearchQuery={filterSetter(setSearchQuery)}
                depotFilter={depotFilter}
                setDepotFilter={filterSetter(setDepotFilter)}
                brandFilter={brandFilter}
                setBrandFilter={filterSetter(setBrandFilter)}
                reasonFilter={reasonFilter}
                setReasonFilter={filterSetter(setReasonFilter)}
                nextRunFilter={nextRunFilter}
                setNextRunFilter={filterSetter(setNextRunFilter)}
                onClearFilters={() => {
                  setSearchQuery('')
                  setDepotFilter('All')
                  setBrandFilter('All')
                  setReasonFilter('All')
                  setNextRunFilter('All')
                  setPage(1)
                }}
              />

              {selected.length > 0 && <DeferredBulkBanner selectedCount={selected.length} onClear={() => setSelectedIds([])} plannerDate={plannerDate} />}

              {rows.length === 0 ? (
                <EmptyStateCard />
              ) : (
                <DeferredOrdersTable
                  orders={shown}
                  totalCount={filtered.length}
                  firstIndex={(currentPage - 1) * PAGE}
                  selectedIds={selectedIds}
                  onToggleSelect={toggle}
                  onToggleSelectAll={toggleAll}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          <footer className="dispatcher-footer">
            <span>All times in Asia/Colombo (UTC+05:30)</span>
          </footer>
        </main>
      </div>
    </div>
  )
}
