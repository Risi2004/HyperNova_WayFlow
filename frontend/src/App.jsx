import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
import AdminDashboard from './pages/admin/dashboard'
import AdminUsers from './pages/admin/users'
import AdminProducts from './pages/admin/products'
import LandingPage from './pages/Landing/LandingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Dispatcher Routes */}
        <Route path="/dispatcher/dashboard" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DispatcherDashboard /></ProtectedRoute>} />
        <Route path="/dispatcher/daashboard" element={<Navigate to="/dispatcher/dashboard" replace />} />
        <Route path="/dispatcher/orders" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DispatcherOrders /></ProtectedRoute>} />
        <Route path="/dispatcher/orders/:order_code" element={<ProtectedRoute allowedRoles={['Dispatcher']}><OrderDetails /></ProtectedRoute>} />
        <Route path="/dispatcher/delivery-planner" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DeliveryPlanner /></ProtectedRoute>} />
        <Route path="/dispatcher/orders/delivery-planner" element={<Navigate to="/dispatcher/delivery-planner" replace />} />
        <Route path="/dispatcher/fleet-availability" element={<ProtectedRoute allowedRoles={['Dispatcher']}><FleetAvailability /></ProtectedRoute>} />
        <Route path="/dispatcher/fleetAvailability" element={<Navigate to="/dispatcher/fleet-availability" replace />} />
        <Route path="/dispatcher/routes" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DispatcherRoutes /></ProtectedRoute>} />
        <Route path="/dispatcher/routes/:route_id" element={<ProtectedRoute allowedRoles={['Dispatcher']}><RouteDetails /></ProtectedRoute>} />
        <Route path="/dispatcher/deferred-orders" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DeferredOrders /></ProtectedRoute>} />
        <Route path="/dispatcher/live-deliveries" element={<ProtectedRoute allowedRoles={['Dispatcher']}><LiveDeliveries /></ProtectedRoute>} />
        <Route path="/dispatcher/delivery-history" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DeliveryHistory /></ProtectedRoute>} />
        <Route path="/dispatcher/delivery-history/:delivery_id" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DeliveryHistory /></ProtectedRoute>} />
        <Route path="/dispatcher/settings" element={<ProtectedRoute allowedRoles={['Dispatcher']}><DispatcherSettings /></ProtectedRoute>} />

        {/* Loader Routes */}
        <Route path="/loader/dashboard" element={<ProtectedRoute allowedRoles={['Loader']}><LoaderDashboard /></ProtectedRoute>} />
        <Route path="/loader/today-loads" element={<ProtectedRoute allowedRoles={['Loader']}><TodayLoads /></ProtectedRoute>} />
        <Route path="/loader/todayLoads" element={<Navigate to="/loader/today-loads" replace />} />
        <Route path="/loader/today-loads/:orderId/report-issue" element={<ProtectedRoute allowedRoles={['Loader']}><ReportIssue /></ProtectedRoute>} />
        <Route path="/loader/today-orders/:orderId/report-issue" element={<ProtectedRoute allowedRoles={['Loader']}><ReportIssue /></ProtectedRoute>} />
        <Route path="/loader/today-loads/report-issue" element={<ProtectedRoute allowedRoles={['Loader']}><ReportIssue /></ProtectedRoute>} />
        <Route path="/loader/today-orders/:orderId" element={<ProtectedRoute allowedRoles={['Loader']}><TodayOrders /></ProtectedRoute>} />
        <Route path="/loader/today-orders" element={<ProtectedRoute allowedRoles={['Loader']}><TodayOrders /></ProtectedRoute>} />
        <Route path="/loader/loading-history" element={<ProtectedRoute allowedRoles={['Loader']}><LoadingHistory /></ProtectedRoute>} />
        <Route path="/loader/settings" element={<ProtectedRoute allowedRoles={['Loader']}><LoaderSettings /></ProtectedRoute>} />

        {/* Driver Routes */}
        <Route path="/driver" element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="/driver/dashboard" element={<ProtectedRoute allowedRoles={['Driver']}><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/my-trips" element={<ProtectedRoute allowedRoles={['Driver']}><MyTrips /></ProtectedRoute>} />
        <Route path="/driver/my-trips/:tripId" element={<ProtectedRoute allowedRoles={['Driver']}><TripDetails /></ProtectedRoute>} />
        <Route path="/driver/my-trips/:tripId/delivery-stop" element={<ProtectedRoute allowedRoles={['Driver']}><DeliveryStop /></ProtectedRoute>} />
        <Route path="/driver/my-trips/:tripId/record-delivery" element={<ProtectedRoute allowedRoles={['Driver']}><RecordDelivery /></ProtectedRoute>} />
        <Route path="/driver/my-trips/:tripId/proof-of-delivery" element={<ProtectedRoute allowedRoles={['Driver']}><ProofOfDelivery /></ProtectedRoute>} />
        <Route path="/driver/my-trips/:tripId/report-problem" element={<ProtectedRoute allowedRoles={['Driver']}><ReportProblem /></ProtectedRoute>} />
        <Route path="/driver/myTrips" element={<Navigate to="/driver/my-trips" replace />} />
        <Route path="/driver/myTrips/:tripId" element={<ProtectedRoute allowedRoles={['Driver']}><TripDetails /></ProtectedRoute>} />

        {/* Store Manager Routes */}
        <Route path="/store-manager" element={<Navigate to="/store-manager/dashboard" replace />} />
        <Route path="/store-manager/dashboard" element={<ProtectedRoute allowedRoles={['Store Manager']}><StoreManagerDashboard /></ProtectedRoute>} />
        <Route path="/store-manager/create-order" element={<ProtectedRoute allowedRoles={['Store Manager']}><CreateOrder /></ProtectedRoute>} />
        <Route path="/store-manager/createOrder" element={<Navigate to="/store-manager/create-order" replace />} />
        <Route path="/store-manager/my-orders" element={<ProtectedRoute allowedRoles={['Store Manager']}><MyOrders /></ProtectedRoute>} />
        <Route path="/store-manager/myOrders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/store-manager/orders" element={<Navigate to="/store-manager/my-orders" replace />} />
        <Route path="/store-manager/track-delivery" element={<ProtectedRoute allowedRoles={['Store Manager']}><TrackDelivery /></ProtectedRoute>} />
        <Route path="/store-manager/track-delivery/:tripId" element={<ProtectedRoute allowedRoles={['Store Manager']}><TrackDelivery /></ProtectedRoute>} />
        <Route path="/store-manager/confirm-receipt" element={<ProtectedRoute allowedRoles={['Store Manager']}><ConfirmReceipt /></ProtectedRoute>} />
        <Route path="/store-manager/report-issue" element={<ProtectedRoute allowedRoles={['Store Manager']}><StoreManagerReportIssue /></ProtectedRoute>} />
        <Route path="/store-manager/order-history" element={<ProtectedRoute allowedRoles={['Store Manager']}><OrderHistory /></ProtectedRoute>} />

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['Admin']}><AdminProducts /></ProtectedRoute>} />

        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
