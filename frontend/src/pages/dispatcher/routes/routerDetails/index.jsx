import { useParams } from 'react-router-dom'
import Sidebar from '../../../../components/dispatcher/layout/Sidebar'
import Header from '../../../../components/dispatcher/layout/Header'
import RouteHeader from '../../../../components/dispatcher/routeDetails/RouteHeader'
import RouteSummaryCard from '../../../../components/dispatcher/routeDetails/RouteSummaryCard'
import RouteProgressStepper from '../../../../components/dispatcher/routeDetails/RouteProgressStepper'
import VehicleLoadCard from '../../../../components/dispatcher/routeDetails/VehicleLoadCard'
import RouteMapCard from '../../../../components/dispatcher/routeDetails/RouteMapCard'
import StopSequenceSection from '../../../../components/dispatcher/routeDetails/StopSequenceSection'
import OrdersOnRouteSection from '../../../../components/dispatcher/routeDetails/OrdersOnRouteSection'
import RouteValidationCard from '../../../../components/dispatcher/routeDetails/RouteValidationCard'
import RouteActivityCard from '../../../../components/dispatcher/routeDetails/RouteActivityCard'
import RouteSystemStates from '../../../../components/dispatcher/routeDetails/RouteSystemStates'

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
