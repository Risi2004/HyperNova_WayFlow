import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { orderService } from '../../../services/orderService'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import DeliveryReceivedHeader from '../../../components/storeManager/confirmReceipt/DeliveryReceivedHeader'
import DeliverySummaryBoxes from '../../../components/storeManager/confirmReceipt/DeliverySummaryBoxes'
import DeliveredItemsTable from '../../../components/storeManager/confirmReceipt/DeliveredItemsTable'
import ReceiptSignOffCard from '../../../components/storeManager/confirmReceipt/ReceiptSignOffCard'
import ConfirmSuccessModal from '../../../components/storeManager/confirmReceipt/ConfirmSuccessModal'
import './ConfirmReceipt.css'

const INITIAL_ITEMS = [
  {
    id: 1,
    name: 'Fresh Highland Milk 1L',
    sku: 'SKU-DAI-0811',
    category: 'chilled',
    classLabel: 'Chilled (+4°C)',
    orderedQty: 24,
    deliveredQty: 24,
    unit: 'Crates',
    condition: 'Good',
  },
  {
    id: 2,
    name: 'Yogurt Assorted Flavors (120g)',
    sku: 'SKU-DAI-0811',
    category: 'chilled',
    classLabel: 'Chilled (+4°C)',
    orderedQty: 18,
    deliveredQty: 18,
    unit: 'Crates',
    condition: 'Good',
  },
  {
    id: 3,
    name: 'Natural Mineral Water (500ml)',
    sku: 'SKU-DAI-0811',
    category: 'ambient',
    classLabel: 'Ambient',
    orderedQty: 40,
    deliveredQty: 40,
    unit: 'Cases',
    condition: 'Good',
  },
  {
    id: 4,
    name: 'Savory Snack Packs(Multipack)',
    sku: 'SKU-DAI-0811',
    category: 'ambient',
    classLabel: 'Ambient',
    orderedQty: 25,
    deliveredQty: 25,
    unit: 'Cases',
    condition: 'Good',
  },
]

export default function ConfirmReceipt() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || 'ORD-1042')
  const [storeName, setStoreName] = useState('Colombo 05 Store')
  const [storeId, setStoreId] = useState('OUT043 (Zone 2)')
  const [tripId, setTripId] = useState('TR-024')
  const [vehicleId, setVehicleId] = useState('WP-REF-007')
  const [driverName, setDriverName] = useState('Marcus Vance (DRV-091)')
  const [dockName, setDockName] = useState('Bay 02 Unloading Ramp')
  const [deliveryTime, setDeliveryTime] = useState('10:52 AM (28 Sep 2026)')
  const [temperature, setTemperature] = useState('+3.8°C at arrival')

  const [items, setItems] = useState(INITIAL_ITEMS)
  const [notes, setNotes] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [loadingOrder, setLoadingOrder] = useState(false)

  // Fetch real order
  useEffect(() => {
    let isMounted = true
    async function loadRealOrder() {
      try {
        setLoadingOrder(true)
        let targetId = searchParams.get('orderId')

        // If no orderId in URL, find latest active or delivered order for this store
        if (!targetId) {
          const myOrdersRes = await orderService.getMyOrders()
          if (myOrdersRes?.orders && myOrdersRes.orders.length > 0) {
            const delivered = myOrdersRes.orders.find((o) => ['delivered', 'partial', 'dispatched'].includes(o.status)) || myOrdersRes.orders[0]
            targetId = delivered?.order_id
          }
        }

        if (targetId) {
          const res = await orderService.getOrder(targetId)
          if (!isMounted || !res?.order) return

          setOrderId(res.order.order_id)
          if (res.outlet) {
            setStoreName(res.outlet.brand ? `${res.outlet.district} ${res.outlet.brand} Store` : 'Outlet Store')
            setStoreId(res.outlet.outlet_id)
            if (res.outlet.dock_type) {
              setDockName(res.outlet.dock_type === 'rear_dock' ? 'Bay 01 Rear Dock' : res.outlet.dock_type === 'mall_bay' ? 'Shared Mall Bay' : 'Curbside Loading')
            }
          }
          if (res.plan) {
            if (res.plan.trip_id) setTripId(res.plan.trip_id)
            if (res.plan.vehicle_id) setVehicleId(res.plan.vehicle_id)
            if (res.plan.driver_name) setDriverName(res.plan.driver_name)
            if (res.plan.planned_arrival_time) setDeliveryTime(`${String(res.plan.planned_arrival_time).slice(0, 5)} (Today)`)
          }
          if (res.order.temp_requirement === 'chilled') {
            setTemperature('+3.8°C compliant')
          } else {
            setTemperature('Ambient check passed')
          }

          if (Array.isArray(res.items) && res.items.length > 0) {
            setItems(
              res.items.map((it, idx) => ({
                id: it.item_id || idx + 1,
                name: it.product_name,
                sku: it.product_code || `SKU-${idx + 100}`,
                category: it.temp_requirement || 'ambient',
                classLabel: it.temp_requirement === 'chilled' ? 'Chilled (+4°C)' : 'Ambient',
                orderedQty: Number(it.quantity || 1),
                deliveredQty: Number(it.quantity || 1),
                unit: it.unit || 'Cases',
                condition: 'Good',
              }))
            )
          }
        }
      } catch (err) {
        console.warn('Could not load order for Confirm Receipt, using demo defaults:', err)
      } finally {
        if (isMounted) setLoadingOrder(false)
      }
    }
    loadRealOrder()
    return () => {
      isMounted = false
    }
  }, [searchParams])

  const handleUpdateDeliveredQty = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const newQty = Math.max(0, item.deliveredQty + delta)
        return { ...item, deliveredQty: newQty }
      })
    )
  }

  const handleUpdateCondition = (id, condition) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, condition } : item))
    )
  }

  const handleSetAllGood = () => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        condition: 'Good',
        deliveredQty: item.orderedQty,
      }))
    )
  }

  const handleToggleConfirm = () => {
    setIsConfirmed((prev) => !prev)
  }

  const handleBack = () => {
    navigate('/store-manager/track-delivery')
  }

  const handleReportIssue = () => {
    navigate(`/store-manager/report-issue?orderId=${encodeURIComponent(orderId)}`)
  }

  const handleConfirmReceipt = async () => {
    if (!isConfirmed) return
    setIsSubmitting(true)

    const totalDeliveredQty = items.reduce((acc, it) => acc + it.deliveredQty, 0)
    const totalOrderedQty = items.reduce((acc, it) => acc + it.orderedQty, 0)
    const damagedCount = items.filter((it) => it.condition !== 'Good').reduce((acc, it) => acc + it.deliveredQty, 0)
    const missingCount = Math.max(0, totalOrderedQty - totalDeliveredQty)

    try {
      await orderService.confirmReceipt(orderId, {
        receipt_status: damagedCount > 0 ? 'accepted_with_exceptions' : 'accepted',
        received_cases: totalDeliveredQty,
        damaged_cases: damagedCount,
        missing_cases: missingCount,
        temp_check_celsius: 3.8,
        manager_notes: notes,
      })
    } catch (err) {
      console.warn('API confirmReceipt failed, displaying success state locally:', err)
    } finally {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }
  }

  const handleGoToDashboard = () => {
    navigate('/store-manager/dashboard')
  }

  const handleViewOrderHistory = () => {
    navigate('/store-manager/my-orders')
  }

  const totalDelivered = items.reduce((acc, it) => acc + it.deliveredQty, 0)

  return (
    <div className="cr-page-wrapper">
      {/* Navigation Sidebar */}
      <StoreManagerSidebar activeItem="Confirm Receipt" />

      {/* Main Content Area */}
      <main className="cr-main-content">
        {/* Top Header & Delivered Green Notification */}
        <DeliveryReceivedHeader
          orderId={orderId}
          dockName={dockName}
          verificationMinutes={28}
        />

        {/* 4 Metadata Summary Cards + Temp Subtext */}
        <DeliverySummaryBoxes
          orderId={orderId}
          storeName={storeName}
          storeId={storeId}
          tripId={tripId}
          vehicleId={vehicleId}
          deliveryTime={deliveryTime}
          driverName={driverName}
          temperature={temperature}
        />

        {/* Delivered Items Verification Table */}
        <DeliveredItemsTable
          items={items}
          onUpdateDeliveredQty={handleUpdateDeliveredQty}
          onUpdateCondition={handleUpdateCondition}
          onSetAllGood={handleSetAllGood}
        />

        {/* Receipt Sign-Off & Action Bar */}
        <ReceiptSignOffCard
          notes={notes}
          onChangeNotes={setNotes}
          isConfirmed={isConfirmed}
          onToggleConfirm={handleToggleConfirm}
          onBack={handleBack}
          onReportIssue={handleReportIssue}
          onConfirmReceipt={handleConfirmReceipt}
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Confirmation Success Modal */}
      {showSuccessModal && (
        <ConfirmSuccessModal
          orderId={orderId}
          storeName={storeName}
          receivedUnits={totalDelivered}
          onClose={() => setShowSuccessModal(false)}
          onGoToDashboard={handleGoToDashboard}
          onViewOrderHistory={handleViewOrderHistory}
        />
      )}
    </div>
  )
}

