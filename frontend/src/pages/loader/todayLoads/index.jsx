import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import TodayLoadsControls from '../../../components/loader/TodayLoadsControls'
import TodayLoadsSummaryPills from '../../../components/loader/TodayLoadsSummaryPills'
import TodayLoadsFullTable from '../../../components/loader/TodayLoadsFullTable'
import { tripService } from '../../../services/tripService'
import { formatDate, formatTime } from '../../../utils/orderFormat'
import { loadStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './TodayLoads.css'

const toMinutes = (time) => {
  const [h, m] = String(time).split(':').map(Number)
  return h * 60 + m
}

// API trip → row rendered by TodayLoadsFullTable.
function toLoad(t) {
  return {
    id: t.trip_id,
    vehicleId: t.vehicle_id,
    vehicleType: vehicleTypeLabel(t),
    route: `${t.district} • ${t.brand} • Trip ${t.trip_number}`,
    departureTime: formatTime(t.planned_departure_time),
    departureMin: toMinutes(t.planned_departure_time),
    stops: t.stops,
    loaded: t.verified,
    totalStops: t.stops,
    progressPercent: t.stops ? Math.round((t.verified / t.stops) * 100) : 0,
    ...loadStatusOf(t),
  }
}

export default function TodayLoads() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [departureFilter, setDepartureFilter] = useState('ALL')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL')
  const [date, setDate] = useState('')
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let active = true
    tripService
      .listTrips(date || undefined)
      .then((res) => {
        if (!active) return
        setData(res)
        setLoadError(null)
      })
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [date])

  const loads = useMemo(() => (data?.trips || []).map(toLoad), [data])

  // Calculate counts for summary pills
  const counts = useMemo(
    () => ({
      total: loads.length,
      awaiting: loads.filter((l) => l.statusType === 'awaiting').length,
      loading: loads.filter((l) => l.statusType === 'loading').length,
      ready: loads.filter((l) => l.statusType === 'ready').length,
      issues: loads.filter((l) => l.statusType === 'issue').length,
    }),
    [loads]
  )

  // Filter loads
  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const hit = [load.id, load.vehicleId, load.vehicleType, load.route].some((v) => v.toLowerCase().includes(q))
        if (!hit) return false
      }
      if (statusFilter !== 'ALL' && load.statusType !== statusFilter.toLowerCase()) return false
      if (vehicleTypeFilter !== 'ALL' && load.vehicleType !== vehicleTypeFilter) return false
      if (departureFilter === 'EARLY' && load.departureMin >= 390) return false
      if (departureFilter === 'MID' && (load.departureMin < 390 || load.departureMin > 450)) return false
      if (departureFilter === 'LATE' && load.departureMin <= 450) return false
      return true
    })
  }, [loads, searchQuery, statusFilter, vehicleTypeFilter, departureFilter])

  return (
    <div className="today-loads-page-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="today-loads-main-wrapper">
        <main className="today-loads-content">
          {/* Subheader Title & Filter Controls */}
          <div className="today-loads-header-row">
            <div className="today-loads-title-col">
              <h2 className="today-loads-title">Loads for {data ? formatDate(data.date) : '…'}</h2>
              <p className="today-loads-subtitle">
                Published trips loading at {data?.depot === 'Kandy' ? 'Kandy Regional Hub' : 'Peliyagoda Distribution Center'}
                {data?.dates?.length > 1 && (
                  <>
                    {' • '}
                    <select
                      className="today-loads-date-select"
                      value={data.date}
                      onChange={(e) => setDate(e.target.value)}
                      aria-label="Loading date"
                    >
                      {data.dates.map((d) => (
                        <option key={d} value={d}>
                          {formatDate(d)}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </p>
              {loadError && <p className="today-loads-error">Unable to load trips: {loadError}</p>}
            </div>

            <TodayLoadsControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              departureFilter={departureFilter}
              onDepartureChange={setDepartureFilter}
              vehicleTypeFilter={vehicleTypeFilter}
              onVehicleTypeChange={setVehicleTypeFilter}
            />
          </div>

          {/* Quick Filter Status Pills */}
          <TodayLoadsSummaryPills counts={counts} activeStatus={statusFilter} onSelectStatus={setStatusFilter} />

          {/* Loads Table Card */}
          <TodayLoadsFullTable
            loads={filteredLoads}
            onActionClick={(load) => navigate(`/loader/today-orders/${load.id}`)}
          />
        </main>
      </div>
    </div>
  )
}
