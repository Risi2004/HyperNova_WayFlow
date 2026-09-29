import Sidebar from '../../../components/layout/Sidebar'
import Header from '../../../components/layout/Header'
import StatCard from '../../../components/dashboard/StatCard'
import DeliveryProgressCard from '../../../components/dashboard/DeliveryProgressCard'
import NeedsAttentionCard from '../../../components/dashboard/NeedsAttentionCard'
import OrdersAttentionTable from '../../../components/dashboard/OrdersAttentionTable'
import FleetStatusCard from '../../../components/dashboard/FleetStatusCard'
import LiveDeliveriesCard from '../../../components/dashboard/LiveDeliveriesCard'
import QuickActions from '../../../components/dashboard/QuickActions'

// Icons
import planIcon from '../../../assets/icons/plan.svg'
import ordersIcon from '../../../assets/icons/orders.svg'
import deferredOrdersIcon from '../../../assets/icons/deferred-orders.svg'
import deliveryPlannerIcon from '../../../assets/icons/delivery-planner.svg'
import fleetAvailabilityIcon from '../../../assets/icons/fleet-availability.svg'
import liveDeliveriesIcon from '../../../assets/icons/live-deliveries.svg'
import delayIcon from '../../../assets/icons/delay.svg'
import completedIcon from '../../../assets/icons/completed.svg'

import './DispatcherDashboard.css'

export default function DispatcherDashboard() {
  const stats = [
    {
      label: 'Total Orders',
      value: '126',
      subtext: '+8 from yesterday',
      icon: ordersIcon,
      iconBg: 'blue',
      dotColor: '#3b82f6',
    },
    {
      label: 'Pending Planning',
      value: '18',
      subtext: 'Needs assignment',
      icon: deferredOrdersIcon,
      iconBg: 'amber',
      dotColor: '#f59e0b',
    },
    {
      label: 'Planned Orders',
      value: '92',
      subtext: "73% of today's orders",
      icon: deliveryPlannerIcon,
      iconBg: 'green',
      dotColor: '#22c55e',
    },
    {
      label: 'Deferred Orders',
      value: '16',
      subtext: '4 moved from today',
      icon: deferredOrdersIcon,
      iconBg: 'blue',
      dotColor: '#3b82f6',
    },
    {
      label: 'Available Vehicles',
      value: '24',
      subtext: 'Capacity is sufficient',
      icon: fleetAvailabilityIcon,
      iconBg: 'green',
      dotColor: '#22c55e',
    },
    {
      label: 'Active Deliveries',
      value: '14',
      subtext: 'Across 11 routes',
      icon: liveDeliveriesIcon,
      iconBg: 'blue',
      dotColor: '#3b82f6',
    },
    {
      label: 'Delayed Deliveries',
      value: '2',
      subtext: 'Both under 20 min',
      icon: delayIcon,
      iconBg: 'red',
      dotColor: '#ef4444',
    },
    {
      label: 'Completed Deliveries',
      value: '42',
      subtext: '62% of 68 deliveries',
      icon: completedIcon,
      iconBg: 'green',
      dotColor: '#22c55e',
    },
  ]

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
              <h1 className="greeting-title">Good morning, Jordan</h1>
              <p className="greeting-subtitle">
                18 orders still need planning. Vehicle capacity is sufficient, but reefer space is tight.
              </p>
            </div>
            <button type="button" className="banner-action-btn">
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
            <NeedsAttentionCard />
          </section>

          {/* Orders Requiring Attention Table */}
          <section>
            <OrdersAttentionTable />
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
            <span>Operational data synced at 09:26 • West Hub timezone</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
