import { useParams } from 'react-router-dom'
import Sidebar from '../../../../components/dispatcher/layout/Sidebar'
import Header from '../../../../components/dispatcher/layout/Header'
import OrderHeader from '../../../../components/dispatcher/orderDetails/OrderHeader'
import OrderSummaryCard from '../../../../components/dispatcher/orderDetails/OrderSummaryCard'
import DeliveryDestinationCard from '../../../../components/dispatcher/orderDetails/DeliveryDestinationCard'
import DeliveryRequirementsCard from '../../../../components/dispatcher/orderDetails/DeliveryRequirementsCard'
import CapacityRequirementsCard from '../../../../components/dispatcher/orderDetails/CapacityRequirementsCard'
import DeliveryWindowCard from '../../../../components/dispatcher/orderDetails/DeliveryWindowCard'
import OrderItemsTable from '../../../../components/dispatcher/orderDetails/OrderItemsTable'
import PlanningStatusCard from '../../../../components/dispatcher/orderDetails/PlanningStatusCard'
import OrderActivityTimeline from '../../../../components/dispatcher/orderDetails/OrderActivityTimeline'
import OrderBottomBar from '../../../../components/dispatcher/orderDetails/OrderBottomBar'

import './OrderDetails.css'

export default function OrderDetails() {
  const { orderId, order_code } = useParams()
  const currentOrderId = orderId || order_code || 'ORD-2026-1048'

  return (
    <div className="order-details-page-container">
      {/* Sidebar with Orders active */}
      <Sidebar activeItem="Orders" />

      {/* Main Content Area */}
      <div className="order-details-main-wrapper">
        <Header />

        <main className="order-details-content">
          {/* Header row with back link and actions */}
          <OrderHeader orderId={currentOrderId} status="Pending Planning" />

          {/* Order Summary & Fulfillment Progress */}
          <OrderSummaryCard orderId={currentOrderId} />

          {/* Delivery Destination & Requirements */}
          <div className="order-details-two-col">
            <DeliveryDestinationCard />
            <DeliveryRequirementsCard />
          </div>

          {/* Capacity Requirements & Delivery Window */}
          <div className="order-details-two-col">
            <CapacityRequirementsCard weight="420 kg" volume="3.8 m³" />
            <DeliveryWindowCard />
          </div>

          {/* Order Items Table */}
          <OrderItemsTable />

          {/* Planning Status & Order Activity Timeline */}
          <div className="order-details-two-col">
            <PlanningStatusCard />
            <OrderActivityTimeline />
          </div>

          {/* Bottom Action Bar */}
          <OrderBottomBar />

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
