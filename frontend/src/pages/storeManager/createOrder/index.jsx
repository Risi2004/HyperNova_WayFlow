import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import AssignedOutletCard from '../../../components/storeManager/createOrder/AssignedOutletCard'
import OrderScheduleCard from '../../../components/storeManager/createOrder/OrderScheduleCard'
import OrderItemsCard from '../../../components/storeManager/createOrder/OrderItemsCard'
import OrderSummaryCard from '../../../components/storeManager/createOrder/OrderSummaryCard'
import MultiTempInfoCard from '../../../components/storeManager/createOrder/MultiTempInfoCard'
import AddProductModal from '../../../components/storeManager/createOrder/AddProductModal'
import './CreateOrder.css'

export default function CreateOrder() {
  const navigate = useNavigate()

  // Form State
  const [deliveryDate, setDeliveryDate] = useState('Sep 29, 2026')
  const [deliveryWindow, setDeliveryWindow] = useState(
    'Morning (10:30 AM - 11:00 AM - Recommended Standard)'
  )
  const [priority, setPriority] = useState('normal')
  const [outletRef, setOutletRef] = useState('STORE-05-WK40-RESTOCK')
  const [orderNotes, setOrderNotes] = useState(
    'Cold storage bay 2 open from 10:00 AM. Unloading team prepared with hydraulic pallet jacks.'
  )

  // Items State (matches exact design in screenshot: 10 ambient, 8 chilled, 6 frozen = 24 cases total)
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Premium White Rice 5kg',
      category: 'Ambient',
      type: 'ambient',
      sku: 'SKU: GRD-RIC-90410 Bags / Case: Groceries',
      weightPerCase: 50,
      cases: 10,
    },
    {
      id: 2,
      name: 'Fresh Highland Milk 1L',
      category: 'Chilled (+4°C)',
      type: 'chilled',
      sku: 'Dairy Products   12 Bottles / Case   SKU: DAI-MLK-001',
      weightPerCase: 12,
      cases: 8,
    },
    {
      id: 3,
      name: 'Frozen Farm Mixed Vegetables 1kg',
      category: 'Frozen (-18°C)',
      type: 'frozen',
      sku: 'Frozen Foods/FRZ   FRZ-VEG-999-10 Packs / Case',
      weightPerCase: 10,
      cases: 6,
    },
  ])

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Item Handlers
  const handleUpdateQty = (itemId, delta) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const newCases = Math.max(1, it.cases + delta)
          return { ...it, cases: newCases }
        }
        return it
      })
    )
  }

  const handleRemoveItem = (itemId) => {
    const itemToRemove = items.find((i) => i.id === itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    showToast(`Removed "${itemToRemove?.name || 'Item'}" from order`)
  }

  const handleAddProduct = (newProd) => {
    setItems((prev) => [...prev, newProd])
    showToast(`Added "${newProd.name}" (${newProd.cases} Cases) to order`)
  }

  const handleDiscard = () => {
    setItems([
      {
        id: 1,
        name: 'Premium White Rice 5kg',
        category: 'Ambient',
        type: 'ambient',
        sku: 'SKU: GRD-RIC-90410 Bags / Case: Groceries',
        weightPerCase: 50,
        cases: 10,
      },
    ])
    setOutletRef('STORE-05-WK40-RESTOCK')
    setPriority('normal')
    showToast('Order draft reset to default items.')
  }

  const handleSaveDraft = () => {
    showToast('Draft ORD-1043 saved successfully!')
  }

  const handleSubmitOrder = () => {
    showToast('Order ORD-1043 submitted to Peliyagoda DC for Dispatch Run #04!')
    setTimeout(() => {
      navigate('/store-manager/dashboard')
    }, 1800)
  }

  return (
    <div className="sm-create-order-page">
      {/* Left Navigation Sidebar */}
      <StoreManagerSidebar activeItem="Create Order" />

      {/* Main Content Area */}
      <main className="sm-create-order-main">
        {/* Top Header & Breadcrumb */}
        <div className="co-top-header-section">
          <div>
            <nav className="co-breadcrumb-row">
              <span
                className="co-breadcrumb-link"
                onClick={() => navigate('/store-manager/dashboard')}
              >
                Store Dashboard
              </span>
              <span className="co-breadcrumb-sep">&gt;</span>
              <span className="co-breadcrumb-current">Create Order</span>
            </nav>

            <div className="co-title-row">
              <h1 className="co-page-title">Create New Order</h1>
              <span className="co-order-draft-badge">ORD-1043 (Draft)</span>
            </div>

            <p className="co-page-subtitle">
              Create and submit a stock replenishment order for your outlet.
            </p>
          </div>

          <div className="co-header-actions-right">
            <button
              type="button"
              className="btn-co-header-draft"
              onClick={handleSaveDraft}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              className="btn-co-help-circle"
              title="Help and replenishment ordering guidelines"
              onClick={() => showToast('Replenishment guideline: Cut-off 18:00 PM for next morning linehaul.')}
            >
              ?
            </button>
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="co-main-grid-layout">
          {/* Left Column */}
          <div className="co-left-column">
            {/* 1. Assigned Outlet Card */}
            <AssignedOutletCard />

            {/* 2. Order Details & Delivery Schedule Card */}
            <OrderScheduleCard
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              deliveryWindow={deliveryWindow}
              setDeliveryWindow={setDeliveryWindow}
              priority={priority}
              setPriority={setPriority}
              outletRef={outletRef}
              setOutletRef={setOutletRef}
              orderNotes={orderNotes}
              setOrderNotes={setOrderNotes}
              onDiscard={handleDiscard}
              onSaveDraft={handleSaveDraft}
              onSubmitOrder={handleSubmitOrder}
            />

            {/* 3. Order Items Card */}
            <OrderItemsCard
              items={items}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>

          {/* Right Column */}
          <div className="co-right-column">
            {/* Order Summary Card */}
            <OrderSummaryCard
              orderCode="ORD-1043"
              items={items}
              deliveryDate={deliveryDate}
              deliveryWindow={deliveryWindow}
              onSubmitOrder={handleSubmitOrder}
              onSaveDraft={handleSaveDraft}
            />

            {/* Multi-Temp Palletizing Info Card */}
            <MultiTempInfoCard />
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="co-toast-notification">
          <span>{toastMessage}</span>
          <button
            type="button"
            className="btn-co-toast-close"
            onClick={() => setToastMessage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
