import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import StatCard from '../../../components/dispatcher/dashboard/StatCard'
import DeliveryProgressCard from '../../../components/dispatcher/dashboard/DeliveryProgressCard'
import NeedsAttentionCard from '../../../components/dispatcher/dashboard/NeedsAttentionCard'
import OrdersAttentionTable from '../../../components/dispatcher/dashboard/OrdersAttentionTable'
import FleetStatusCard from '../../../components/dispatcher/dashboard/FleetStatusCard'
import LiveDeliveriesCard from '../../../components/dispatcher/dashboard/LiveDeliveriesCard'
import QuickActions from '../../../components/dispatcher/dashboard/QuickActions'

// Icons
import planIcon from '../../../assets/icons/plan.svg'
import ordersIcon from '../../../assets/icons/orders.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'
import deliveryPlannerIcon from '../../../assets/icons/delivery-planner.svg'
import fleetAvailabilityIcon from '../../../assets/icons/fleet-availability.svg'
import liveDeliveriesIcon from '../../../assets/icons/live-deliveries.svg'
import delayIcon from '../../../assets/icons/delay.svg'
import completedIcon from '../../../assets/icons/completed.svg'

import { orderService } from '../../../services/orderService'
import { userService } from '../../../services/userService'
import './DispatcherDashboard.css'
import { useCurrentUser, greetingFor, firstNameOf } from '../../../hooks/useCurrentUser'

export default function DispatcherDashboard() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [vehicleCount, setVehicleCount] = useState(null)
  const [nextIntake, setNextIntake] = useState(null)

  useEffect(() => {
    let active = true
    orderService
      .listOrders({ pageSize: 5 })
      .then((res) => active && setData(res))
      .catch(() => active && setData({ stats: {}, attention: [] }))
    userService
      .getVehicles()
      .then((list) => active && setVehicleCount(list.length))
      .catch(() => active && setVehicleCount(null))
    orderService
      .getIntake()
      .then((res) => active && setNextIntake(res.dates.find((d) => d.open) || null))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const st = data?.stats || {}
  const v = (n) => (data ? String(n ?? 0) : '–')
  const stats = [
    { label: 'Total Orders', value: v(st.total), subtext: `${st.awaiting_cutoff ?? 0} awaiting cutoff`, icon: ordersIcon, iconBg: 'blue', dotColor: '#3b82f6' },
    { label: 'Pending Planning', value: v(st.pending), subtext: 'Confirmed, not yet on a trip', icon: deferredOrdersIcon, iconBg: 'amber', dotColor: '#f59e0b' },
    { label: 'Planned Orders', value: v(st.planned), subtext: 'Assigned to vehicles', icon: deliveryPlannerIcon, iconBg: 'green', dotColor: '#22c55e' },
    { label: 'Deferred Orders', value: v(st.deferred), subtext: 'Waiting for a later run', icon: deferredOrdersIcon, iconBg: 'blue', dotColor: '#3b82f6' },
    { label: 'Fleet Vehicles', value: vehicleCount === null ? '–' : String(vehicleCount), subtext: 'Peliyagoda & Kandy depots', icon: fleetAvailabilityIcon, iconBg: 'green', dotColor: '#22c55e' },
    { label: 'Active Deliveries', value: v(st.in_transit), subtext: 'Orders on the road', icon: liveDeliveriesIcon, iconBg: 'blue', dotColor: '#3b82f6' },
    { label: 'Exceptions', value: v(st.exception), subtext: 'Shortfalls, failures, disputes', icon: delayIcon, iconBg: 'red', dotColor: '#ef4444' },
    { label: 'Completed Deliveries', value: v(st.completed), subtext: 'Delivered or received', icon: completedIcon, iconBg: 'green', dotColor: '#22c55e' },
  ]

  const attention = data?.attention || []
  const repeatDeferrals = attention.filter((o) => o.status === 'deferred' && o.consecutive_deferral_count > 1).length
  const issues = [
    st.pending > 0 && { id: 'pending', text: `${st.pending} confirmed order${st.pending === 1 ? '' : 's'} need planning`, action: 'Open planner', to: '/dispatcher/delivery-planner', dotColor: '#f59e0b' },
    repeatDeferrals > 0 && { id: 'repeat', text: `${repeatDeferrals} outlet order${repeatDeferrals === 1 ? ' has' : 's have'} been deferred more than once`, action: 'Review', to: '/dispatcher/orders', dotColor: '#ef4444' },
    st.deferred > 0 && { id: 'deferred', text: `${st.deferred} deferred order${st.deferred === 1 ? '' : 's'} waiting for a run`, action: 'View deferred', to: '/dispatcher/orders', dotColor: '#f59e0b' },
    st.exception > 0 && { id: 'exception', text: `${st.exception} order exception${st.exception === 1 ? '' : 's'} to resolve`, action: 'Review', to: '/dispatcher/orders', dotColor: '#ef4444' },
    nextIntake && { id: 'intake', text: `${nextIntake.submitted} order${nextIntake.submitted === 1 ? '' : 's'} awaiting the ${new Date(nextIntake.cutoff_at).toLocaleString('en-GB', { timeZone: 'Asia/Colombo', weekday: 'short', hour: '2-digit', minute: '2-digit' })} cutoff`, action: 'Order intake', to: '/dispatcher/orders', dotColor: '#3b82f6' },
  ].filter(Boolean)

  const summary = data
    ? `${st.pending || 0} order${st.pending === 1 ? '' : 's'} need planning and ${st.deferred || 0} ${st.deferred === 1 ? 'is' : 'are'} deferred.${repeatDeferrals ? ` ${repeatDeferrals} ${repeatDeferrals === 1 ? 'has' : 'have'} been skipped more than once.` : ''}`
    : 'Loading today’s order position…'

  return (
    <div className="dispatcher-page-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeItem="Dashboard" />

      {/* Main Content Area */}
      <div className="dispatcher-main-wrapper">
        <Header />

        <main className="dispatcher-content">
          {/* Greeting & Action Banner */}
          <section className="greeting-banner">
            <div className="greeting-text-group">
              <h1 className="greeting-title">{greetingFor()}, {firstNameOf(user?.name)}</h1>
              <p className="greeting-subtitle">
                {summary}
              </p>
            </div>
            <button type="button" className="banner-action-btn" onClick={() => navigate('/dispatcher/delivery-planner')}>
              <img src={planIcon} alt="" className="banner-btn-icon" aria-hidden="true" />
              <span>Plan Today's Deliveries &rarr;</span>
            </button>
          </section>

          {/* 8 Stats Grid */}
          <section className="stats-grid">
            {stats.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                subtext={s.subtext}
                icon={s.icon}
                iconBg={s.iconBg}
                dotColor={s.dotColor}
              />
            ))}
          </section>

          {/* Delivery Progress & Needs Attention */}
          <section className="two-col-grid">
            <DeliveryProgressCard />
            <NeedsAttentionCard issues={issues} />
          </section>

          {/* Orders Requiring Attention Table */}
          <section>
            <OrdersAttentionTable orders={attention} />
          </section>

          {/* Fleet Status & Live Deliveries */}
          <section className="fleet-live-grid">
            <FleetStatusCard />
            <LiveDeliveriesCard />
          </section>

          {/* Quick Actions */}
          <section>
            <QuickActions />
          </section>

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>All times in Asia/Colombo (UTC+05:30)</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
