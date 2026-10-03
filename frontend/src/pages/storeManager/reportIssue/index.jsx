import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StoreManagerSidebar from '../../../components/storeManager/StoreManagerSidebar'
import OrderPicker from '../../../components/storeManager/OrderPicker'
import ReportIssueHeader from '../../../components/storeManager/reportIssue/ReportIssueHeader'
import IssueCategorySelector from '../../../components/storeManager/reportIssue/IssueCategorySelector'
import { ISSUE_CATEGORIES } from '../../../components/storeManager/reportIssue/issueCategories'
import AffectedProductCard from '../../../components/storeManager/reportIssue/AffectedProductCard'
import IssueDescriptionCard from '../../../components/storeManager/reportIssue/IssueDescriptionCard'
import PhotoProofCard from '../../../components/storeManager/reportIssue/PhotoProofCard'
import OrderContextCard from '../../../components/storeManager/reportIssue/OrderContextCard'
import DiscrepancySummaryCard from '../../../components/storeManager/reportIssue/DiscrepancySummaryCard'
import ReportIssueSuccessModal from '../../../components/storeManager/reportIssue/ReportIssueSuccessModal'
import { orderService } from '../../../services/orderService'
import { dispatchStatusOf, formatShortDate, formatTime } from '../../../utils/orderFormat'
import './ReportIssue.css'

// Issues are about goods on their way or already at the store.
const REPORTABLE = ['loading', 'loaded', 'shortfall', 'dispatched', 'delivered', 'partial', 'failed', 'received', 'disputed']

export default function ReportIssue() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [detail, setDetail] = useState(null)
  const [candidates, setCandidates] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [itemId, setItemId] = useState('')
  const [affectedQty, setAffectedQty] = useState(0)
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    let active = true
    const request = orderId ? orderService.getOrder(orderId) : orderService.getMyOrders()
    request
      .then((res) => {
        if (!active) return
        setLoadError(null)
        if (orderId) setDetail(res)
        else setCandidates(res.orders.filter((o) => REPORTABLE.includes(o.status)).slice(0, 30))
      })
      .catch((err) => active && setLoadError(err.message))
    return () => {
      active = false
    }
  }, [orderId])

  const category = ISSUE_CATEGORIES.find((c) => c.id === selectedCategory)
  const item = detail?.items.find((i) => String(i.item_id) === String(itemId))

  const handleSubmitIssue = async () => {
    if (!selectedCategory) return setSubmitError('Choose what kind of issue this is.')
    if (!description.trim()) return setSubmitError('Describe the issue so dispatch can act on it.')
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await orderService.reportIssue(orderId, {
        category: selectedCategory,
        description: description.trim(),
        item_id: item ? item.item_id : undefined,
        affected_qty: item ? affectedQty : undefined,
        photo: photo?.dataUrl,
      })
      setTicket(res)
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const order = detail?.order
  const plan = detail?.plan
  const delivery = detail?.delivery

  let body
  if (loadError) {
    body = <p className="sm-page-state error">{loadError}</p>
  } else if (!orderId) {
    body = candidates ? (
      <OrderPicker
        title="Report an Issue"
        hint="Choose the order the problem is about."
        orders={candidates}
        path="/store-manager/report-issue"
        emptyText="None of your orders are on the way or delivered yet, so there is nothing to report against."
      />
    ) : (
      <p className="sm-page-state">Loading your orders…</p>
    )
  } else if (!detail) {
    body = <p className="sm-page-state">Loading {orderId}…</p>
  } else {
    body = (
      <>
        <ReportIssueHeader orderId={order.order_id} status={dispatchStatusOf(order.status).label} onBackToOrders={() => navigate('/store-manager/my-orders')} />

        {detail.issues?.length > 0 && (
          <p className="sm-page-state">
            Already reported on this order:{' '}
            {detail.issues.map((i) => `#${i.issue_id} ${i.issue_category} (${i.resolution_status.replace('_', ' ')})`).join(' • ')}
          </p>
        )}

        <div className="ri-layout-body">
          <div className="ri-col-main">
            <IssueCategorySelector selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            <AffectedProductCard
              items={detail.items}
              itemId={itemId}
              onChangeItem={(id) => {
                setItemId(id)
                setAffectedQty(0)
              }}
              affectedQty={affectedQty}
              onChangeAffectedQty={setAffectedQty}
            />

            <IssueDescriptionCard description={description} onChangeDescription={setDescription} maxLength={500} />

            <PhotoProofCard photo={photo} onChangePhoto={setPhoto} />
          </div>

          <div className="ri-col-side">
            <OrderContextCard
              orderId={order.order_id}
              store={`${order.district} (${order.outlet_id})`}
              arrivalTime={delivery ? `${formatShortDate(order.target_delivery_date)}, ${formatTime(delivery.actual_arrival_time)}` : `${formatShortDate(order.target_delivery_date)} (planned ${formatTime(plan?.planned_arrival_time)})`}
              arrivalLabel={delivery ? 'Arrived' : 'Delivery'}
              receivedBy={delivery?.received_by_name || '—'}
              tripId={plan?.trip_id || 'Not on a trip'}
              driverName={plan?.driver_name || '—'}
              status={dispatchStatusOf(order.status).label}
            />

            <DiscrepancySummaryCard
              categoryLabel={category ? category.label : 'Not chosen'}
              skuName={item ? item.product_name : 'Whole order'}
              discrepancyText={item ? `${affectedQty} of ${item.quantity} ${item.unit.toLowerCase()}${item.quantity === 1 ? '' : 's'}` : '—'}
              evidenceCount={photo ? 1 : 0}
              onSubmit={handleSubmitIssue}
              onCancel={() => navigate(-1)}
              isSubmitting={isSubmitting}
              error={submitError}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="ri-page-wrapper">
      <StoreManagerSidebar activeItem="Report Issue" />
      <main className="ri-main-content">{body}</main>

      {ticket && (
        <ReportIssueSuccessModal
          orderId={orderId}
          ticketId={`#${ticket.issue_id}`}
          categoryLabel={category?.label}
          skuName={item ? item.product_name : 'Whole order'}
          onClose={() => navigate(0)}
          onGoToDashboard={() => navigate('/store-manager/dashboard')}
          onGoToOrders={() => navigate('/store-manager/my-orders')}
        />
      )}
    </div>
  )
}
