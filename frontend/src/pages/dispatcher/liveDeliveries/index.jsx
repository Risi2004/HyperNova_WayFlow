import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import LiveHeader from '../../../components/dispatcher/liveDeliveries/LiveHeader'
import LiveMetricCards from '../../../components/dispatcher/liveDeliveries/LiveMetricCards'
import LiveFilterBar from '../../../components/dispatcher/liveDeliveries/LiveFilterBar'
import LiveAttentionBanner from '../../../components/dispatcher/liveDeliveries/LiveAttentionBanner'
import LiveDeliveriesTable from '../../../components/dispatcher/liveDeliveries/LiveDeliveriesTable'
import LiveTripPanel from '../../../components/dispatcher/liveDeliveries/LiveTripPanel'
import LiveIssuesCard from '../../../components/dispatcher/liveDeliveries/LiveIssuesCard'
import LiveEmptyStateCard from '../../../components/dispatcher/liveDeliveries/LiveEmptyStateCard'
import { tripService } from '../../../services/tripService'
import { formatTime } from '../../../utils/orderFormat'
import { vehicleTypeLabel } from '../../../utils/tripFormat'
import './LiveDeliveries.css'

const PAGE = 10
const REFRESH_MS = 30000
const TABS = ['All', 'Active', 'Pending', 'Completed', 'Delayed', 'Problem']
// Tabs overlap on purpose: a trip on the road with an open issue is both Active and Problem.
const TAB_MATCH = {
  All: () => true,
  Active: (r) => r.phase === 'active',
  Pending: (r) => r.phase === 'pending',
  Completed: (r) => r.phase === 'completed',
  Delayed: (r) => r.lateStops > 0,
  Problem: (r) => r.openIssues > 0 || r.shortfalls > 0,
}

// One row per trip, with the reason it needs attention (if any) spelled out.
function toRow(t) {
  const total = Number(t.stops || 0)
  const done = Number(t.completed_stops || 0)
  const finished = t.status === 'completed' || (total > 0 && done === total)
  let statusType
  let status
  let statusDetail = null
  if (t.open_issues > 0 || t.shortfalls > 0) {
    statusType = 'problem'
    status = 'Problem'
    statusDetail = [t.open_issues && `${t.open_issues} open issue${t.open_issues === 1 ? '' : 's'}`, t.shortfalls && `${t.shortfalls} loaded short`].filter(Boolean).join(' · ')
  } else if (t.late_stops > 0) {
    statusType = 'delayed'
    status = 'Delayed'
    statusDetail = `${t.late_stops} late stop${t.late_stops === 1 ? '' : 's'}`
  } else if (finished) {
    statusType = 'completed'
    status = 'Completed'
  } else if (['dispatched', 'in_progress'].includes(t.status)) {
    statusType = 'ontime'
    status = 'On the road'
  } else {
    statusType = 'pending'
    status = { planned: 'Awaiting loading', loading: 'Loading', loaded: 'Ready to depart' }[t.status] || t.status
  }
  if (['problem', 'delayed'].includes(statusType)) {
    const phase = finished ? 'Completed' : ['dispatched', 'in_progress'].includes(t.status) ? 'On the road' : 'Not departed'
    statusDetail = `${phase} · ${statusDetail}`
  }
  if (t.offline_records > 0) statusDetail = [statusDetail, `${t.offline_records} synced from offline`].filter(Boolean).join(' · ')

  return {
    phase: finished ? 'completed' : ['dispatched', 'in_progress'].includes(t.status) ? 'active' : 'pending',
    route: t.trip_id,
    vehicle: t.vehicle_id,
    vehicleType: vehicleTypeLabel(t),
    depot: t.depot,
    brand: t.brand,
    district: t.district,
    driver: t.driver_name || 'No driver assigned',
    totalStops: total,
    completedStops: done,
    percent: total ? Math.round((done / total) * 100) : 0,
    currentStop: finished ? 'All stops recorded' : t.next_outlet_id ? `Stop ${t.next_stop_sequence} — ${t.next_outlet_id}` : 'At depot',
    eta: finished ? formatTime(t.last_arrival) : `${formatTime(t.first_arrival)} – ${formatTime(t.last_arrival)}`,
    departure: formatTime(t.planned_departure_time),
    status,
    statusType,
    statusDetail,
    lateStops: t.late_stops,
    offlineRecords: t.offline_records,
    openIssues: t.open_issues,
    shortfalls: t.shortfalls,
  }
}

export default function LiveDeliveries() {
  const [date, setDate] = useState(null)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)

  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setReloadKey((k) => k + 1), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let active = true
    tripService
      .listTrips(date || undefined)
      .then((res) => {
        if (!active) return
        setData(res)
        setError(null)
        setUpdatedAt(new Date())
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [date, reloadKey])

  const rows = useMemo(() => (data?.trips || []).map(toRow), [data])
  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t, rows.filter(TAB_MATCH[t]).length])), [rows])
  const options = useMemo(() => ({
    depots: [...new Set(rows.map((r) => r.depot))].sort(),
    brands: [...new Set(rows.map((r) => r.brand))].sort(),
    vehicleTypes: [...new Set(rows.map((r) => r.vehicleType))].sort(),
  }), [rows])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((d) => {
      if (!TAB_MATCH[activeTab](d)) return false
      if (q && ![d.route, d.vehicle, d.driver, d.currentStop, d.district].some((s) => s.toLowerCase().includes(q))) return false
      if (depotFilter !== 'All' && d.depot !== depotFilter) return false
      if (brandFilter !== 'All' && d.brand !== brandFilter) return false
      if (vehicleTypeFilter !== 'All' && d.vehicleType !== vehicleTypeFilter) return false
      return true
    })
  }, [rows, activeTab, searchQuery, depotFilter, brandFilter, vehicleTypeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE))
  const currentPage = Math.min(page, totalPages)
  const shown = filtered.slice((currentPage - 1) * PAGE, currentPage * PAGE)

  const alerts = rows
    .filter((r) => r.statusType === 'problem' || r.statusType === 'delayed' || r.offlineRecords > 0)
    .map((r) => ({
      routeId: r.route,
      outletId: `${r.vehicle} • ${r.district}`,
      highlight: r.statusType === 'problem' ? 'Issue or shortfall reported' : r.statusType === 'delayed' ? 'Late arrivals recorded' : 'Records synced after no signal',
      detail: r.statusDetail,
    }))

  const filterSetter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className="live-page-container">
      <Sidebar activeItem="Live Deliveries" />

      <div className="live-main-wrapper">
        <Header />

        <main className="live-content">
          <LiveHeader
            date={data?.date}
            dates={data?.dates || []}
            onDateChange={(d) => {
              setDate(d)
              setSelectedTrip(null)
              setPage(1)
            }}
            updatedAt={updatedAt}
            onRefresh={() => setReloadKey((k) => k + 1)}
            connected={!error}
          />

          {error && <p className="live-page-state error">{error}</p>}

          {data && (
            <>
              <LiveMetricCards metrics={data.metrics} total={rows.length} />

              <LiveFilterBar
                tabs={TABS.map((label) => ({ label, count: counts[label] }))}
                activeTab={activeTab}
                onTabChange={filterSetter(setActiveTab)}
                searchQuery={searchQuery}
                setSearchQuery={filterSetter(setSearchQuery)}
                options={options}
                depotFilter={depotFilter}
                setDepotFilter={filterSetter(setDepotFilter)}
                brandFilter={brandFilter}
                setBrandFilter={filterSetter(setBrandFilter)}
                vehicleTypeFilter={vehicleTypeFilter}
                setVehicleTypeFilter={filterSetter(setVehicleTypeFilter)}
                onClearFilters={() => {
                  setSearchQuery('')
                  setDepotFilter('All')
                  setBrandFilter('All')
                  setVehicleTypeFilter('All')
                  setActiveTab('All')
                  setPage(1)
                }}
              />

              <LiveAttentionBanner alerts={alerts.slice(0, 6)} totalCount={alerts.length} onSelect={setSelectedTrip} />

              {rows.length === 0 ? (
                <LiveEmptyStateCard date={data.date} />
              ) : (
                <LiveDeliveriesTable
                  deliveries={shown}
                  totalCount={filtered.length}
                  firstIndex={(currentPage - 1) * PAGE}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  selected={selectedTrip}
                  onSelect={setSelectedTrip}
                />
              )}

              {selectedTrip && <LiveTripPanel tripId={selectedTrip} reloadKey={reloadKey} onClose={() => setSelectedTrip(null)} />}

              <LiveIssuesCard date={data.date} reloadKey={reloadKey} onChanged={() => setReloadKey((k) => k + 1)} onSelectTrip={setSelectedTrip} />
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
