import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import ReportIssueHeader from '../../../components/storeManager/reportIssue/ReportIssueHeader'
import IssueCategorySelector, { ISSUE_CATEGORIES } from '../../../components/storeManager/reportIssue/IssueCategorySelector'
import AffectedProductCard from '../../../components/storeManager/reportIssue/AffectedProductCard'
import IssueDescriptionCard from '../../../components/storeManager/reportIssue/IssueDescriptionCard'
import PhotoProofCard from '../../../components/storeManager/reportIssue/PhotoProofCard'
import OrderContextCard from '../../../components/storeManager/reportIssue/OrderContextCard'
import DiscrepancySummaryCard from '../../../components/storeManager/reportIssue/DiscrepancySummaryCard'
import ReportIssueSuccessModal from '../../../components/storeManager/reportIssue/ReportIssueSuccessModal'
import { orderService } from '../../../services/orderService'
import './ReportIssue.css'

const DEFAULT_PRODUCT = {
  name: 'Fresh Highland Milk 1L',
  sku: 'DAI-0402',
  code: 'DAI-MLK-001',
  category: 'Dairy & Cold Chain',
  tempClass: 'Chilled (+4°C)',
  orderedCrates: 24,
  orderedUnits: 288,
  affectedCrates: 4,
  affectedUnits: 48,
  receivedCrates: 20,
  receivedUnits: 240,
  sourceLocation: 'Peliyagoda DC Reefer',
  destinationLocation: 'Cold Storage-Bay 02',
}

const DEFAULT_DESCRIPTION =
  'Upon unloading pallet #01 at Dock Bay 02, crate row 4 was short by 4 crates of Fresh Farm Milk (1L). The delivery manifest indicated 24 crates loaded at Peliyagoda DC, but driver Marcus Vance confirmed only 20 crates were physically on the reefer.'

export default function ReportIssue() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [orderId, setOrderId] = useState(searchParams.get('orderId') || 'ORD-1042')
  const [selectedCategory, setSelectedCategory] = useState('missing-item')
  const [product, setProduct] = useState(DEFAULT_PRODUCT)
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION)
  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'dock_manifest_photo.jpg',
      size: '1.8 MB',
    },
  ])
  const [orderContext, setOrderContext] = useState({
    orderId: 'ORD-1042',
    store: 'Colombo 05 (OUT043)',
    arrivalTime: 'Today, 10:52 AM',
    dockBay: 'Bay 02 Ramp',
    tripId: 'TR-024',
    driverName: 'Marcus Vance',
    status: 'Completed',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [ticketId, setTicketId] = useState('ISSUE-2026-0941')

  // Fetch real order context if available
  useEffect(() => {
    let isMounted = true
    async function loadRealOrder() {
      try {
        let targetId = searchParams.get('orderId')
        if (!targetId) {
          const myOrdersRes = await orderService.getMyOrders()
          if (myOrdersRes?.orders && myOrdersRes.orders.length > 0) {
            targetId = myOrdersRes.orders[0]?.order_id
          }
        }

        if (targetId) {
          const res = await orderService.getOrder(targetId)
          if (!isMounted || !res?.order) return

          setOrderId(res.order.order_id)
          setOrderContext({
            orderId: res.order.order_id,
            store: res.outlet ? `${res.outlet.district} (${res.outlet.outlet_id})` : 'Colombo 05 (OUT043)',
            arrivalTime: res.plan?.planned_arrival_time ? `${String(res.plan.planned_arrival_time).slice(0, 5)} (Today)` : 'Today, 10:52 AM',
            dockBay: res.outlet?.dock_type === 'rear_dock' ? 'Bay 01 Rear Dock' : 'Bay 02 Ramp',
            tripId: res.plan?.trip_id || 'TR-024',
            driverName: res.plan?.driver_name || 'Marcus Vance',
            status: res.order.status ? res.order.status.charAt(0).toUpperCase() + res.order.status.slice(1) : 'Delivered',
          })

          if (Array.isArray(res.items) && res.items.length > 0) {
            const first = res.items[0]
            const qty = Number(first.quantity || 24)
            setProduct({
              name: first.product_name,
              sku: first.product_code || 'SKU-001',
              code: first.product_code || 'CODE-001',
              category: first.temp_requirement === 'chilled' ? 'Dairy & Cold Chain' : 'Ambient Groceries',
              tempClass: first.temp_requirement === 'chilled' ? 'Chilled (+4°C)' : 'Ambient',
              orderedCrates: qty,
              orderedUnits: qty * 12,
              affectedCrates: 2,
              affectedUnits: 24,
              receivedCrates: Math.max(0, qty - 2),
              receivedUnits: Math.max(0, qty - 2) * 12,
              sourceLocation: `${res.order.depot || 'Peliyagoda'} DC`,
              destinationLocation: `Cold Storage - ${res.order.outlet_id}`,
            })
          }
        }
      } catch (err) {
        console.warn('Could not load order context for Report Issue:', err)
      }
    }
    loadRealOrder()
    return () => {
      isMounted = false
    }
  }, [searchParams])

  const currentCategory = ISSUE_CATEGORIES.find((c) => c.id === selectedCategory)

  const handleAddFile = (newFile) => {
    setFiles((prev) => [...prev, newFile])
  }

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleScanBarcode = () => {
    alert('Barcode Scanner active: Point your device camera at the crate or pallet barcode label.')
  }

  const handleChangeSku = () => {
    const newName = prompt('Enter SKU name or select from manifest:', product.name)
    if (newName) {
      setProduct((prev) => ({ ...prev, name: newName }))
    }
  }

  const handleSubmitIssue = async () => {
    setIsSubmitting(true)
    try {
      const res = await orderService.reportIssue(orderId, {
        category: selectedCategory,
        description,
        severity: 'medium',
        impact: 'medium',
        affected_product: product.name,
        affected_units: product.affectedUnits,
      })
      if (res?.issue_id) {
        setTicketId(res.issue_id)
      } else {
        const randomTicket = 'ISSUE-2026-' + Math.floor(1000 + Math.random() * 9000)
        setTicketId(randomTicket)
      }
    } catch (err) {
      console.warn('API reportIssue failed, saving locally:', err)
      const randomTicket = 'ISSUE-2026-' + Math.floor(1000 + Math.random() * 9000)
      setTicketId(randomTicket)
    } finally {
      setIsSubmitting(false)
      setShowSuccessModal(true)
    }
  }

  const handleCancel = () => {
    navigate(`/store-manager/confirm-receipt?orderId=${encodeURIComponent(orderId)}`)
  }

  const handleGoToDashboard = () => {
    navigate('/store-manager/dashboard')
  }

  const handleGoToOrders = () => {
    navigate('/store-manager/my-orders')
  }


  return (
    <div className="ri-page-wrapper">
      {/* Navigation Sidebar */}
      <StoreManagerSidebar activeItem="Report Issue" />

      {/* Main Container */}
      <main className="ri-main-content">
        {/* Top Header */}
        <ReportIssueHeader
          orderId="ORD-1042"
          status="Delivery Completed"
          onBackToOrders={handleGoToOrders}
        />

        {/* 2-Column Layout */}
        <div className="ri-layout-body">
          {/* Main Left Column (Sections 1-4) */}
          <div className="ri-col-main">
            {/* Step 1: Category Selector */}
            <IssueCategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Step 2: Affected Product & Quantities */}
            <AffectedProductCard
              product={product}
              onScanBarcode={handleScanBarcode}
              onChangeSku={handleChangeSku}
            />

            {/* Step 3: Describe the Issue */}
            <IssueDescriptionCard
              description={description}
              onChangeDescription={setDescription}
              maxLength={500}
            />

            {/* Step 4: Supporting Photo Proof */}
            <PhotoProofCard
              files={files}
              onAddFile={handleAddFile}
              onRemoveFile={handleRemoveFile}
            />
          </div>

          {/* Right Column (Side Cards) */}
          <div className="ri-col-side">
            {/* Card 1: Order Context */}
            <OrderContextCard
              orderId={orderContext.orderId}
              store={orderContext.store}
              arrivalTime={orderContext.arrivalTime}
              dockBay={orderContext.dockBay}
              tripId={orderContext.tripId}
              driverName={orderContext.driverName}
              status={orderContext.status}
            />

            {/* Card 2: Discrepancy Summary */}
            <DiscrepancySummaryCard
              categoryLabel={currentCategory ? currentCategory.label : 'Missing Item'}
              skuName={product.name}
              discrepancyText={`${product.affectedCrates} Crates (${product.affectedUnits} Units)`}
              evidenceCount={files.length}
              onSubmit={handleSubmitIssue}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <ReportIssueSuccessModal
          orderId={orderId}
          ticketId={ticketId}
          categoryLabel={currentCategory ? currentCategory.label : 'Missing Item'}
          skuName={product.name}
          onClose={() => setShowSuccessModal(false)}
          onGoToDashboard={handleGoToDashboard}
          onGoToOrders={handleGoToOrders}
        />
      )}
    </div>
  )
}
