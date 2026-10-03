import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import AssignedOutletCard from '../../../components/storeManager/createOrder/AssignedOutletCard'
import OrderScheduleCard from '../../../components/storeManager/createOrder/OrderScheduleCard'
import OrderItemsCard from '../../../components/storeManager/createOrder/OrderItemsCard'
import OrderSummaryCard from '../../../components/storeManager/createOrder/OrderSummaryCard'
import MultiTempInfoCard from '../../../components/storeManager/createOrder/MultiTempInfoCard'
import AddProductModal from '../../../components/storeManager/createOrder/AddProductModal'
import { orderService } from '../../../services/orderService'
import { productCategory, formatDate } from '../../../utils/orderFormat'
import './CreateOrder.css'

const trimTime = (t) => (t ? String(t).slice(0, 5) : '')

// Converts a catalog product (or saved draft line) into a cart line.
function toCartItem(source, quantity) {
  const category = productCategory(source)
  return {
    id: source.product_id || source.product_code,
    name: source.product_name,
    type: category.type,
    category: category.label,
    unit: source.unit,
    sku: `${source.product_id || source.product_code} • per ${source.unit}`,
    weightPerCase: Number(source.weight_per_unit),
    volumePerCase: Number(source.volume_per_unit),
    cases: quantity,
  }
}

export default function CreateOrder() {
  const navigate = useNavigate()

  // Reference data from the API
  const [schedule, setSchedule] = useState(null)
  const [loadError, setLoadError] = useState(null)

  // Form State
  const [draftId, setDraftId] = useState(null)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryWindow, setDeliveryWindow] = useState('')
  const [priority, setPriority] = useState('normal')
  const [outletRef, setOutletRef] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [items, setItems] = useState([])

  // UI state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [formError, setFormError] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  useEffect(() => {
    let cancelled = false
    Promise.all([orderService.getSchedule(), orderService.getDraft()])
      .then(([sched, { draft }]) => {
        if (cancelled) return
        const outletWindow = `${sched.outlet.window_open}-${sched.outlet.window_close}`
        const optionDates = sched.delivery_options.map((o) => o.date)
        setSchedule(sched)
        setDeliveryWindow(outletWindow)
        setDeliveryDate(optionDates[0] || '')

        if (draft) {
          setDraftId(draft.order_id)
          if (optionDates.includes(draft.target_delivery_date)) setDeliveryDate(draft.target_delivery_date)
          setDeliveryWindow(`${trimTime(draft.requested_window_open)}-${trimTime(draft.requested_window_close)}`)
          setPriority(draft.priority || 'normal')
          setOutletRef(draft.outlet_reference || '')
          setOrderNotes(draft.order_notes || '')
          setItems(draft.items.map((it) => toCartItem(it, it.quantity)))
        }
      })
      .catch((err) => !cancelled && setLoadError(err.message))
    return () => {
      cancelled = true
    }
  }, [])

  const buildPayload = () => {
    const [windowOpen, windowClose] = deliveryWindow.split('-')
    return {
      draft_id: draftId || undefined,
      delivery_date: deliveryDate,
      window_open: windowOpen,
      window_close: windowClose,
      priority,
      outlet_reference: outletRef,
      notes: orderNotes,
      items: items.map((it) => ({ product_id: it.id, quantity: it.cases })),
    }
  }

  // Item Handlers
  const handleSetQty = (itemId, quantity) => {
    const next = Math.min(10000, Math.max(1, Math.floor(Number(quantity) || 1)))
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, cases: next } : it)))
  }

  const handleUpdateQty = (itemId, delta) => {
    const item = items.find((it) => it.id === itemId)
    if (item) handleSetQty(itemId, item.cases + delta)
  }

  const handleRemoveItem = (itemId) => {
    const itemToRemove = items.find((i) => i.id === itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
    showToast(`Removed "${itemToRemove?.name || 'Item'}" from order`)
  }

  const handleAddProduct = (product, quantity) => {
    const existing = items.find((it) => it.id === product.product_id)
    if (existing) {
      handleSetQty(existing.id, existing.cases + quantity)
      showToast(`Added ${quantity} more "${product.product_name}"`)
      return
    }
    setItems((prev) => [...prev, toCartItem(product, quantity)])
    showToast(`Added "${product.product_name}" (${quantity} ${product.unit}) to order`)
  }

  const handleDiscard = async () => {
    if (draftId) {
      try {
        await orderService.cancelOrder(draftId, 'Draft discarded')
      } catch (err) {
        showToast(err.message)
        return
      }
    }
    setDraftId(null)
    setItems([])
    setOutletRef('')
    setOrderNotes('')
    setPriority('normal')
    setFormError(null)
    showToast(draftId ? `Draft ${draftId} discarded.` : 'Order form cleared.')
  }

  const handleSaveDraft = async () => {
    setIsBusy(true)
    setFormError(null)
    try {
      const res = await orderService.saveDraft(buildPayload())
      setDraftId(res.draft.order_id)
      showToast(res.message)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      setFormError('Add at least one product before submitting.')
      return
    }
    if (!deliveryDate) {
      setFormError('Choose a delivery date.')
      return
    }
    setIsBusy(true)
    setFormError(null)
    try {
      const res = await orderService.submitOrder(buildPayload())
      showToast(res.message)
      setTimeout(() => {
        navigate('/store-manager/my-orders')
      }, 2200)
    } catch (err) {
      const next = err.data?.next_available_date
      setFormError(next ? `${err.message} The next available delivery date is ${formatDate(next)}.` : err.message)
      if (next) setDeliveryDate(next)
      setIsBusy(false)
    }
  }

  const deliveryOption = useMemo(
    () => schedule?.delivery_options.find((o) => o.date === deliveryDate) || null,
    [schedule, deliveryDate]
  )

  if (loadError || !schedule) {
    return (
      <div className="sm-create-order-page">
        <StoreManagerSidebar activeItem="Create Order" />
        <main className="sm-create-order-main">
          <div className={`co-page-state ${loadError ? 'error' : ''}`}>
            {loadError ? `Unable to open the order form: ${loadError}` : 'Loading your outlet and delivery schedule…'}
          </div>
        </main>
      </div>
    )
  }

  const draftLabel = draftId ? `${draftId} (Draft)` : 'New Order'

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
              <span className="co-order-draft-badge">{draftLabel}</span>
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
              disabled={isBusy}
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
              onClick={() => showToast(`Orders close at ${schedule.cutoff_hour}:00 on the operating day before delivery. Later orders move to the next run.`)}
            >
              ?
            </button>
          </div>
        </div>

        {formError && (
          <div className="co-form-error-banner" role="alert">
            <span>{formError}</span>
            <button type="button" onClick={() => setFormError(null)} aria-label="Dismiss">✕</button>
          </div>
        )}

        {/* Two-Column Grid Layout */}
        <div className="co-main-grid-layout">
          {/* Left Column */}
          <div className="co-left-column">
            {/* 1. Assigned Outlet Card */}
            <AssignedOutletCard
              outlet={schedule.outlet}
              manager={schedule.manager}
              cutoffHour={schedule.cutoff_hour}
            />

            {/* 2. Order Details & Delivery Schedule Card */}
            <OrderScheduleCard
              outlet={schedule.outlet}
              deliveryOptions={schedule.delivery_options}
              deliveryOption={deliveryOption}
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
              isBusy={isBusy}
              onDiscard={handleDiscard}
              onSaveDraft={handleSaveDraft}
              onSubmitOrder={handleSubmitOrder}
            />

            {/* 3. Order Items Card */}
            <OrderItemsCard
              items={items}
              onUpdateQty={handleUpdateQty}
              onSetQty={handleSetQty}
              onRemoveItem={handleRemoveItem}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          </div>

          {/* Right Column */}
          <div className="co-right-column">
            {/* Order Summary Card */}
            <OrderSummaryCard
              orderCode={draftLabel}
              items={items}
              outlet={schedule.outlet}
              managerName={schedule.manager.name}
              deliveryDate={deliveryDate}
              deliveryWindow={deliveryWindow}
              isBusy={isBusy}
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
        brand={schedule.outlet.brand}
        orderLabel={draftLabel}
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
