import { useEffect, useState } from 'react'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoaderHeader from '../../../components/loader/LoaderHeader'
import LoaderStatCards from '../../../components/loader/LoaderStatCards'
import TodaysLoadsTable from '../../../components/loader/TodaysLoadsTable'
import LoadingProgressCard from '../../../components/loader/LoadingProgressCard'
import AttentionRequiredCard from '../../../components/loader/AttentionRequiredCard'
import UpcomingDeparturesCard from '../../../components/loader/UpcomingDeparturesCard'
import { tripService } from '../../../services/tripService'
import { formatDate, formatTime } from '../../../utils/orderFormat'
import { loadStatusOf, vehicleTypeLabel } from '../../../utils/tripFormat'
import './LoaderDashboard.css'

const DOT = { awaiting: 'gray', loading: 'blue', ready: 'green', issue: 'amber' }

export default function LoaderDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    tripService
      .listTrips()
      .then((res) => active && setData(res))
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [])

  const trips = data?.trips || []
  const rows = trips.map((t) => ({ trip: t, ...loadStatusOf(t) }))
  const count = (type) => rows.filter((r) => r.statusType === type).length
  const v = (n) => (data ? String(n) : '–')
  const issueTrip = trips.find((t) => t.shortfalls > 0 && ['loading', 'loaded'].includes(t.status))

  return (
    <div className="loader-layout-container">
      {/* Left Sidebar */}
      <LoaderSidebar activeItem="Dashboard" />

      {/* Main Content Area */}
      <div className="loader-main-wrapper">
        <main className="loader-content">
          {/* Header */}
          <LoaderHeader
            hub={data?.depot === 'Kandy' ? 'Kandy Regional Hub' : 'Peliyagoda Distribution Center'}
            dateText={data ? `Loading run for ${formatDate(data.date)}` : undefined}
          />
          {error && <p className="loader-dashboard-error">Unable to load trips: {error}</p>}

          {/* 4 Stat Metric Cards */}
          <LoaderStatCards
            stats={[
              { value: v(count('awaiting')), label: 'Loads to Prepare', dotColor: 'gray' },
              { value: v(count('loading')), label: 'Loading Now', dotColor: 'blue' },
              { value: v(count('ready')), label: 'Ready for Departure', dotColor: 'green' },
              { value: v(count('issue') + trips.filter((t) => t.status === 'loaded' && t.shortfalls).length), label: 'Issues', dotColor: 'amber' },
            ]}
          />

          {/* Today's Loads Table Card */}
          <TodaysLoadsTable
            loads={rows.slice(0, 8).map(({ trip: t, ...st }) => ({
              id: t.trip_id,
              vehicleNumber: t.vehicle_id,
              vehicleType: vehicleTypeLabel(t),
              route: `${t.depot} → ${t.district}`,
              departure: formatTime(t.planned_departure_time),
              stops: `${t.stops} stops`,
              loadedCount: t.verified,
              totalCount: t.stops,
              progressPercent: t.stops ? Math.round((t.verified / t.stops) * 100) : 0,
              status: st.status,
              statusType: st.statusType,
              actionLabel: st.actionText,
              actionType: st.actionType,
            }))}
          />

          {/* Bottom Grid */}
          <div className="loader-bottom-two-col">
            <div className="loader-bottom-left-col">
              <LoadingProgressCard
                loadedCount={trips.reduce((n, t) => n + t.verified, 0)}
                totalCount={Math.max(1, trips.reduce((n, t) => n + t.stops, 0))}
              />
              <AttentionRequiredCard
                issue={
                  issueTrip
                    ? {
                      tripId: issueTrip.trip_id,
                      vehicleId: issueTrip.vehicle_id,
                      message: `${issueTrip.shortfalls} order${issueTrip.shortfalls === 1 ? '' : 's'} reported short during loading checks. Dispatch has been notified.`,
                    }
                    : null
                }
              />
            </div>
            <div className="loader-bottom-right-col">
              <UpcomingDeparturesCard
                departures={rows
                  .filter((r) => ['planned', 'loading', 'loaded'].includes(r.trip.status))
                  .slice(0, 6)
                  .map(({ trip: t, ...st }) => ({
                    time: formatTime(t.planned_departure_time),
                    route: `${t.district} (${t.vehicle_id} • Trip ${t.trip_number})`,
                    status: st.status,
                    statusType: st.statusType,
                    dotColor: DOT[st.statusType] || 'gray',
                  }))}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
