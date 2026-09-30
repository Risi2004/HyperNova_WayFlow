import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import DeliveryPlannerHeader from '../../../components/dispatcher/deliveryPlanner/DeliveryPlannerHeader'
import PlannerStatCards from '../../../components/dispatcher/deliveryPlanner/PlannerStatCards'
import OrdersToPlanColumn from '../../../components/dispatcher/deliveryPlanner/OrdersToPlanColumn'
import TodaysPlanColumn from '../../../components/dispatcher/deliveryPlanner/TodaysPlanColumn'
import RouteDetailsColumn from '../../../components/dispatcher/deliveryPlanner/RouteDetailsColumn'
import UnscheduledOrdersSection from '../../../components/dispatcher/deliveryPlanner/UnscheduledOrdersSection'
import PlannerBottomBar from '../../../components/dispatcher/deliveryPlanner/PlannerBottomBar'

import './DeliveryPlanner.css'

export default function DeliveryPlanner() {
  return (
    <div className="planner-page-container">
      {/* Sidebar with Delivery Planner Active */}
      <Sidebar activeItem="Delivery Planner" />

      {/* Main Content Area */}
      <div className="planner-main-wrapper">
        <Header />

        <main className="planner-content">
          {/* Header Row & Advisory Banner */}
          <DeliveryPlannerHeader />

          {/* 6 Summary Stat Cards */}
          <PlannerStatCards />

          {/* 3-Column Core Planning Workspace */}
          <div className="planner-three-col-workspace">
            {/* Left: Orders to Plan */}
            <OrdersToPlanColumn />

            {/* Center: Today's Delivery Plan Main Stage */}
            <TodaysPlanColumn />

            {/* Right: Route Details */}
            <RouteDetailsColumn />
          </div>

          {/* Collapsible Unscheduled Orders Section */}
          <UnscheduledOrdersSection />

          {/* Sticky Bottom Action Bar */}
          <PlannerBottomBar />

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
