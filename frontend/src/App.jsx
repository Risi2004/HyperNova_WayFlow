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
import DriverDashboard from './pages/driver/dashboard'
import MyTrips from './pages/driver/myTrips'
import TripDetails from './pages/driver/tripDetails'
import DeliveryStop from './pages/driver/deliveryStop'
import RecordDelivery from './pages/driver/recordDelivery'
import ProofOfDelivery from './pages/driver/proofOfDelivery'
import ReportProblem from './pages/driver/reportProblem'
import StoreManagerDashboard from './pages/storeManager/dashboard'
import CreateOrder from './pages/storeManager/createOrder'
import MyOrders from './pages/storeManager/myOrders'
import TrackDelivery from './pages/storeManager/trackDelivery'
import ConfirmReceipt from './pages/storeManager/confirmReceipt'
import StoreManagerReportIssue from './pages/storeManager/reportIssue'
import OrderHistory from './pages/storeManager/orderHistory'

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
        <Route path="/driver" element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/my-trips" element={<MyTrips />} />
        <Route path="/driver/my-trips/:tripId" element={<TripDetails />} />
        <Route path="/driver/my-trips/:tripId/delivery-stop" element={<DeliveryStop />} />
        <Route path="/driver/my-trips/:tripId/devilery-stop" element={<Navigate to="/driver/my-trips/:tripId/delivery-stop" replace />} />
        <Route path="/driver/my-trips/:tripId/record-delivery" element={<RecordDelivery />} />
        <Route path="/driver/my-trips/:tripId/recordDelivery" element={<Navigate to="/driver/my-trips/:tripId/record-delivery" replace />} />
        <Route path="/driver/my-trips/:tripId/proof-of-delivery" element={<ProofOfDelivery />} />
        <Route path="/driver/my-trips/:tripId/proofOfDelivery" element={<Navigate to="/driver/my-trips/:tripId/proof-of-delivery" replace />} />
        <Route path="/driver/my-trips/:tripId/report-problem" element={<ReportProblem />} />
        <Route path="/driver/my-trips/:tripId/reportProblem" element={<Navigate to="/driver/my-trips/:tripId/report-problem" replace />} />
        <Route path="/driver/record-delivery" element={<RecordDelivery />} />
        <Route path="/driver/proof-of-delivery" element={<ProofOfDelivery />} />
        <Route path="/driver/report-problem" element={<ReportProblem />} />
        <Route path="/driver/myTrips" element={<Navigate to="/driver/my-trips" replace />} />
        <Route path="/driver/myTrips/:tripId" element={<TripDetails />} />
        <Route path="/driver/myTrips/:tripId/delivery-stop" element={<Navigate to="/driver/my-trips/:tripId/delivery-stop" replace />} />
        <Route path="/driver/myTrips/:tripId/devilery-stop" element={<Navigate to="/driver/my-trips/:tripId/delivery-stop" replace />} />
        <Route path="/driver/myTrips/:tripId/record-delivery" element={<Navigate to="/driver/my-trips/:tripId/record-delivery" replace />} />
        <Route path="/driver/myTrips/:tripId/proof-of-delivery" element={<Navigate to="/driver/my-trips/:tripId/proof-of-delivery" replace />} />
        <Route path="/driver/myTrips/:tripId/report-problem" element={<Navigate to="/driver/my-trips/:tripId/report-problem" replace />} />
        <Route path="/store-manager" element={<Navigate to="/store-manager/dashboard" replace />} />
        <Route path="/store-manager/dashboard" element={<StoreManagerDashboard />} />
        <Route path="/store-manager/create-order" element={<CreateOrder />} />
        <Route path="/store-manager/createOrder" element={<Navigate to="/store-manager/create-order" replace />} />
        <Route path="/store-manager/my-orders" element={<MyOrders />} />
        <Route path="/store-manager/myOrders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/store-manager/orders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/store-manager/track-delivery" element={<TrackDelivery />} />
        <Route path="/store-manager/track-delivery/:tripId" element={<TrackDelivery />} />
        <Route path="/store-manager/trackDelivery" element={<Navigate to="/store-manager/track-delivery" replace />} />
        <Route path="/store-manager/trackDelivery/:tripId" element={<TrackDelivery />} />
        <Route path="/store-manager/confirm-receipt" element={<ConfirmReceipt />} />
        <Route path="/store-manager/confirmReceipt" element={<Navigate to="/store-manager/confirm-receipt" replace />} />
        <Route path="/store-manager/report-issue" element={<StoreManagerReportIssue />} />
        <Route path="/store-manager/reportIssue" element={<Navigate to="/store-manager/report-issue" replace />} />
        <Route path="/store-manager/order-history" element={<OrderHistory />} />
        <Route path="/store-manager/orderHistory" element={<Navigate to="/store-manager/order-history" replace />} />
        <Route path="/storeManager" element={<Navigate to="/store-manager/dashboard" replace />} />
        <Route path="/storeManager/dashboard" element={<Navigate to="/store-manager/dashboard" replace />} />
        <Route path="/storeManager/create-order" element={<Navigate to="/store-manager/create-order" replace />} />
        <Route path="/storeManager/createOrder" element={<Navigate to="/store-manager/create-order" replace />} />
        <Route path="/storeManager/my-orders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/storeManager/myOrders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/storeManager/orders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/storeManager/track-delivery" element={<Navigate to="/store-manager/track-delivery" replace />} />
        <Route path="/storeManager/track-delivery/:tripId" element={<Navigate to="/store-manager/track-delivery" replace />} />
        <Route path="/storeManager/trackDelivery" element={<Navigate to="/store-manager/track-delivery" replace />} />
        <Route path="/storeManager/trackDelivery/:tripId" element={<Navigate to="/store-manager/track-delivery" replace />} />
        <Route path="/storeManager/confirm-receipt" element={<Navigate to="/store-manager/confirm-receipt" replace />} />
        <Route path="/storeManager/confirmReceipt" element={<Navigate to="/store-manager/confirm-receipt" replace />} />
        <Route path="/storeManager/report-issue" element={<Navigate to="/store-manager/report-issue" replace />} />
        <Route path="/storeManager/reportIssue" element={<Navigate to="/store-manager/report-issue" replace />} />
        <Route path="/storeManager/order-history" element={<Navigate to="/store-manager/order-history" replace />} />
        <Route path="/storeManager/orderHistory" element={<Navigate to="/store-manager/order-history" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
