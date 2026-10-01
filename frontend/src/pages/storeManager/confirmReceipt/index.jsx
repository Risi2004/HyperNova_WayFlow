import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const [items, setItems] = useState(INITIAL_ITEMS)
  const [notes, setNotes] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
    navigate('/store-manager/report-issue')
  }

  const handleConfirmReceipt = () => {
    if (!isConfirmed) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }, 600)
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
          orderId="ORD-1042"
          dockName="Bay 02 Unloading Ramp"
          verificationMinutes={28}
        />

        {/* 4 Metadata Summary Cards + Temp Subtext */}
        <DeliverySummaryBoxes
          orderId="ORD-1042"
          storeName="Colombo 05 Store"
          storeId="OUT043 (Zone 2)"
          tripId="TR-024"
          vehicleId="WP-REF-007"
          deliveryTime="10:52 AM (28 Sep 2026)"
          driverName="Marcus Vance (DRV-089)"
          temperature="+3.8°C at arrival"
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
          orderId="ORD-1042"
          storeName="Colombo 05 Store"
          receivedUnits={totalDelivered}
          onClose={() => setShowSuccessModal(false)}
          onGoToDashboard={handleGoToDashboard}
          onViewOrderHistory={handleViewOrderHistory}
        />
      )}
    </div>
  )
}
