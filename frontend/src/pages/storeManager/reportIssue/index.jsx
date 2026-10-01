import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import ReportIssueHeader from '../../../components/storeManager/reportIssue/ReportIssueHeader'
import IssueCategorySelector, { ISSUE_CATEGORIES } from '../../../components/storeManager/reportIssue/IssueCategorySelector'
import AffectedProductCard from '../../../components/storeManager/reportIssue/AffectedProductCard'
import IssueDescriptionCard from '../../../components/storeManager/reportIssue/IssueDescriptionCard'
import PhotoProofCard from '../../../components/storeManager/reportIssue/PhotoProofCard'
import OrderContextCard from '../../../components/storeManager/reportIssue/OrderContextCard'
import DiscrepancySummaryCard from '../../../components/storeManager/reportIssue/DiscrepancySummaryCard'
import ReportIssueSuccessModal from '../../../components/storeManager/reportIssue/ReportIssueSuccessModal'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [ticketId, setTicketId] = useState('ISSUE-2026-0941')

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

  const handleSubmitIssue = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const randomTicket = 'ISSUE-2026-' + Math.floor(1000 + Math.random() * 9000)
      setTicketId(randomTicket)
      setShowSuccessModal(true)
    }, 700)
  }

  const handleCancel = () => {
    navigate('/store-manager/confirm-receipt')
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
              orderId="ORD-1042"
              store="Colombo 05 (OUT043)"
              arrivalTime="28 Sep, 10:52 AM"
              dockBay="Bay 02 Ramp"
              tripId="Trip TR-024"
              driverName="Marcus Vance"
              status="Completed"
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
          orderId="ORD-1042"
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
