import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import DispatcherDashboard from './pages/dispatcher/dashboard'
import DispatcherOrders from './pages/dispatcher/orders'
import OrderDetails from './pages/dispatcher/orders/orderDetails'
import DeliveryPlanner from './pages/dispatcher/deliveryPlanner'
import FleetAvailability from './pages/dispatcher/fleetAvailability'
import DispatcherRoutes from './pages/dispatcher/routes'
import RouteDetails from './pages/dispatcher/routes/routerDetails'
import DeferredOrders from './pages/dispatcher/deferredOrders'
import LiveDeliveries from './pages/dispatcher/liveDeliveries'
import DeliveryHistory from './pages/dispatcher/deliveryHistory'
import DispatcherSettings from './pages/dispatcher/settings'
import LoaderDashboard from './pages/loader/dashboard'
import TodayLoads from './pages/loader/todayLoads'
import TodayOrders from './pages/loader/todayOrders'
import ReportIssue from './pages/loader/reportIssue'
import LoadingHistory from './pages/loader/loadingHistory'
import LoaderSettings from './pages/loader/settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dispatcher/dashboard" element={<DispatcherDashboard />} />
        <Route path="/dispatcher/daashboard" element={<Navigate to="/dispatcher/dashboard" replace />} />
        <Route path="/dispatcher/orders" element={<DispatcherOrders />} />
        <Route path="/dispatcher/orders/:order_code" element={<OrderDetails />} />
        <Route path="/dispatcher/delivery-planner" element={<DeliveryPlanner />} />
        <Route path="/dispatcher/orders/delivery-planner" element={<Navigate to="/dispatcher/delivery-planner" replace />} />
        <Route path="/dispatcher/fleet-availability" element={<FleetAvailability />} />
        <Route path="/dispatcher/fleetAvailability" element={<FleetAvailability />} />
        <Route path="/dispatcher/routes" element={<DispatcherRoutes />} />
        <Route path="/dispatcher/routes/:route_id" element={<RouteDetails />} />
        <Route path="/dispatcher/routes/route_id" element={<RouteDetails />} />
        <Route path="/dispatcher/deferred-orders" element={<DeferredOrders />} />
        <Route path="/dispatcher/live-deliveries" element={<LiveDeliveries />} />
        <Route path="/dispatcher/delivery-history" element={<DeliveryHistory />} />
        <Route path="/dispatcher/delivery-history/:delivery_id" element={<DeliveryHistory />} />
        <Route path="/dispatcher/delivery-history/delivery_id" element={<DeliveryHistory />} />
        <Route path="/dispatcher/deliveryHiastory" element={<Navigate to="/dispatcher/delivery-history" replace />} />
        <Route path="/dispatcher/deliveryHiastory/:delivery_id" element={<DeliveryHistory />} />
        <Route path="/dispatcher/settings" element={<DispatcherSettings />} />
        <Route path="/loader/dashboard" element={<LoaderDashboard />} />
        <Route path="/loader/today-loads" element={<TodayLoads />} />
        <Route path="/loader/todayLoads" element={<Navigate to="/loader/today-loads" replace />} />
        <Route path="/loader/today-loads/:orderId/report-issue" element={<ReportIssue />} />
        <Route path="/loader/today-orders/:orderId/report-issue" element={<ReportIssue />} />
        <Route path="/loader/today-loads/report-issue" element={<ReportIssue />} />
        <Route path="/loader/today-orders/:orderId" element={<TodayOrders />} />
        <Route path="/loader/today-orders" element={<TodayOrders />} />
        <Route path="/loader/loading-history" element={<LoadingHistory />} />
        <Route path="/loader/loadingHistory" element={<Navigate to="/loader/loading-history" replace />} />
        <Route path="/loader/settings" element={<LoaderSettings />} />
        <Route path="/loader/Settings" element={<Navigate to="/loader/settings" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
