import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportIssueUpload from './ReportIssueUpload'
import ReportIssueSummaryCard from './ReportIssueSummaryCard'
import IssueSuccessModal from './IssueSuccessModal'
import { tripService } from '../../../services/tripService'
import { compressImage } from '../../../utils/tripFormat'
import { formatTimestamp } from '../../../utils/orderFormat'

const readAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })

// Records a loading shortfall / damage for one order on a load. The order is marked short,
// the dispatcher gets an issue, and the store manager sees it on the order's history.
export default function ReportIssueForm({ trip, stops = [], initialOrderId }) {
  const navigate = useNavigate()
  const firstStop = stops.find((s) => s.order_id === initialOrderId) || stops[0]
  const [orderId, setOrderId] = useState(firstStop?.order_id || '')
  const stop = stops.find((s) => s.order_id === orderId) || firstStop
  const [issueType, setIssueType] = useState('Quantity Mismatch')
  const [itemId, setItemId] = useState(firstStop?.items[0]?.item_id ? String(firstStop.items[0].item_id) : '')
  const item = stop?.items.find((i) => String(i.item_id) === itemId) || stop?.items[0]
  const plannedQty = item?.quantity ?? 0
  const [actualQty, setActualQty] = useState(plannedQty)
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const diff = Number(actualQty) - plannedQty

  const handleOrderChange = (id) => {
    const next = stops.find((s) => s.order_id === id)
    setOrderId(id)
    setItemId(next?.items[0] ? String(next.items[0].item_id) : '')
    setActualQty(next?.items[0]?.quantity ?? 0)
  }

  const handleItemChange = (id) => {
    setItemId(id)
    setActualQty(stop?.items.find((i) => String(i.item_id) === id)?.quantity ?? 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description.trim()) {
      setError('Describe what is missing or damaged.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const photoData = photo ? await compressImage(await readAsDataUrl(photo)) : null
      await tripService.verifyOrder(trip.trip_id, {
        order_id: orderId,
        result: 'shortfall',
        issue_type: issueType,
        item_name: item?.product_name,
        planned_units: plannedQty,
        actual_units: Number(actualQty),
        description,
        photo: photoData,
      })
      const t = formatTimestamp(new Date().toISOString())
      setResult({
        issueId: orderId,
        associatedLoad: `${trip.trip_id} (${trip.vehicle_id})`,
        issueClass: issueType,
        affectedProduct: `${item?.product_name || 'Order'} (${orderId})`,
        discrepancy: `${diff > 0 ? '+' : ''}${diff} units`,
        status: 'Reported to dispatch',
        loggedTime: `${t.time}, ${t.date}`,
        loadId: trip.trip_id,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="record-loading-issue-card" onSubmit={handleSubmit}>
      {/* Card Title & Subhead */}
      <div className="record-issue-card-header">
        <h2 className="record-issue-title">Record Loading Issue</h2>
        <p className="record-issue-subtitle">
          Report missing or damaged goods before the vehicle leaves. Dispatch and the store manager are notified.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="record-issue-grid">
        {/* Left Column: Form Fields */}
        <div className="record-issue-fields-col">
          {/* Row 1: Issue Type & Affected Order (stop) */}
          <div className="form-fields-two-col">
            <div className="form-field-group">
              <label className="form-label">
                Issue Type <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select className="form-select" value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                  <option value="Quantity Mismatch">Quantity Mismatch</option>
                  <option value="Damaged Goods">Damaged Goods</option>
                  <option value="Missing Carton / Box">Missing Carton / Box</option>
                  <option value="Temperature Abuse">Temperature Abuse</option>
                  <option value="Packaging Defect">Packaging Defect</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">
                Affected Stop / Order <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select className="form-select" value={orderId} onChange={(e) => handleOrderChange(e.target.value)} required>
                  {stops.map((s) => (
                    <option key={s.order_id} value={s.order_id}>
                      {String(s.stop_sequence).padStart(2, '0')} — {s.outlet_id} · {s.order_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Affected Item */}
          <div className="form-field-group">
            <label className="form-label">
              Affected Item <span className="req-star">*</span>
            </label>
            <div className="form-select-wrapper">
              <select className="form-select" value={item ? String(item.item_id) : ''} onChange={(e) => handleItemChange(e.target.value)} required>
                {(stop?.items || []).map((i) => (
                  <option key={i.item_id} value={String(i.item_id)}>
                    {i.product_name} ({i.quantity} × {i.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Planned Quantity & Actual Quantity Loaded */}
          <div className="form-fields-two-col">
            <div className="form-field-group">
              <label className="form-label">Planned Quantity</label>
              <input type="text" className="form-input form-input-disabled" value={`${plannedQty} units`} disabled />
            </div>
            <div className="form-field-group">
              <label className="form-label">
                Actual Quantity Loaded <span className="req-star">*</span>
              </label>
              <input
                type="number"
                min="0"
                className="form-input form-input-active"
                value={actualQty}
                onChange={(e) => setActualQty(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Difference Warning Tag */}
          <div className="difference-tag-container">
            <div className="difference-tag">
              <span>
                Difference: {diff > 0 ? `+${diff}` : diff} units
              </span>
            </div>
          </div>

          {/* Row 4: Describe the issue */}
          <div className="form-field-group">
            <label className="form-label">
              Describe the issue <span className="req-star">*</span>
            </label>
            <textarea
              className="form-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Only 34 bottles in the chiller bay; 6 missing from stock."
              required
            />
          </div>
          {error && <p className="record-issue-error">{error}</p>}
        </div>

        {/* Right Column: Upload Box + Summary Preview */}
        <div className="record-issue-side-col">
          <ReportIssueUpload onPhotoChange={setPhoto} />
          <ReportIssueSummaryCard
            issueType={issueType}
            stop={stop ? `Stop ${String(stop.stop_sequence).padStart(2, '0')} — ${stop.outlet_id}` : '—'}
            item={item?.product_name || '—'}
            order={orderId}
            discrepancy={diff}
          />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="record-issue-footer">
        <button type="button" className="btn-cancel-issue" onClick={() => navigate(`/loader/today-orders/${trip.trip_id}`)}>
          Cancel
        </button>
        <button type="submit" className="btn-submit-issue" disabled={isSubmitting || !orderId}>
          {isSubmitting ? 'Submitting…' : 'Submit Issue'}
        </button>
      </div>

      {/* Success Modal Popup */}
      <IssueSuccessModal isOpen={Boolean(result)} onClose={() => setResult(null)} issueData={result || undefined} />
    </form>
  )
}
