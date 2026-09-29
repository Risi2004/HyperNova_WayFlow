import { useParams } from 'react-router-dom'
import Sidebar from '../../../../components/layout/Sidebar'
import Header from '../../../../components/layout/Header'
import RouteHeader from '../../../../components/routeDetails/RouteHeader'
import RouteSummaryCard from '../../../../components/routeDetails/RouteSummaryCard'
import RouteProgressStepper from '../../../../components/routeDetails/RouteProgressStepper'
import VehicleLoadCard from '../../../../components/routeDetails/VehicleLoadCard'
import RouteMapCard from '../../../../components/routeDetails/RouteMapCard'
import StopSequenceSection from '../../../../components/routeDetails/StopSequenceSection'
import OrdersOnRouteSection from '../../../../components/routeDetails/OrdersOnRouteSection'
import RouteValidationCard from '../../../../components/routeDetails/RouteValidationCard'
import RouteActivityCard from '../../../../components/routeDetails/RouteActivityCard'
import RouteSystemStates from '../../../../components/routeDetails/RouteSystemStates'

import './RouteDetails.css'

export default function RouteDetails() {
  const { route_id } = useParams()
  const currentRouteId = route_id || 'TR-024'

  return (
    <div className="route-details-page-container">
      {/* Sidebar with Routes highlighted */}
      <Sidebar activeItem="Routes" />

      {/* Main Content Area */}
      <div className="route-details-main-wrapper">
        <Header />

        <main className="route-details-content">
          {/* Top Header & Action Controls */}
          <RouteHeader routeId={currentRouteId} />

          {/* 12-metric Route Summary Grid */}
          <RouteSummaryCard routeId={currentRouteId} />

          {/* 5-Step Operational Progress Stepper */}
          <RouteProgressStepper />

          {/* Middle Row: Vehicle & Load + React Leaflet Route Map */}
          <div className="route-middle-two-col">
            <VehicleLoadCard />
            <RouteMapCard />
          </div>

          {/* Stop Sequence with Collapsible Detail */}
          <StopSequenceSection />

          {/* Orders on Route Listing Table */}
          <OrdersOnRouteSection />

          {/* Bottom Row: Validation Checklist & Activity Timeline */}
          <div className="route-bottom-two-col">
            <RouteValidationCard />
            <RouteActivityCard />
          </div>

          {/* Concise System States Showcase */}
          <RouteSystemStates />
        </main>
      </div>
    </div>
  )
}
