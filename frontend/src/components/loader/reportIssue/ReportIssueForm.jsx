import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportIssueUpload from './ReportIssueUpload'
import ReportIssueSummaryCard from './ReportIssueSummaryCard'
import IssueSuccessModal from './IssueSuccessModal'

export default function ReportIssueForm({ loadId = 'LD-025' }) {
  const navigate = useNavigate()

  const [issueType, setIssueType] = useState('Quantity Mismatch')
  const [affectedStop, setAffectedStop] = useState('02 — Bambalapitiya · Waypoint Style')
  const [affectedOrder, setAffectedOrder] = useState('ORD-1048')
  const [affectedItem, setAffectedItem] = useState('Rice 5kg')
  const [plannedQty] = useState(60)
  const [actualQty, setActualQty] = useState(52)
  const [description, setDescription] = useState(
    'Only 52 units of Rice 5kg were available at the loading bay. The planned quantity was 60 units. 8 units appear to be missing from the warehouse stock.'
  )
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const diff = Number(actualQty) - plannedQty

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSuccessModalOpen(true)
  }

  const handleCancel = () => {
    navigate(`/loader/today-loads`)
  }

  return (
    <form className="record-loading-issue-card" onSubmit={handleSubmit}>
      {/* Card Title & Subhead */}
      <div className="record-issue-card-header">
        <h2 className="record-issue-title">Record Loading Issue</h2>
        <p className="record-issue-subtitle">
          Report physical discrepancies or quality issues found at the warehouse dispatch bay.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="record-issue-grid">
        {/* Left Column: Form Fields */}
        <div className="record-issue-fields-col">
          {/* Row 1: Issue Type & Affected Stop */}
          <div className="form-fields-two-col">
            <div className="form-field-group">
              <label className="form-label">
                Issue Type <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  className="form-select"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  required
                >
                  <option value="Quantity Mismatch">Quantity Mismatch</option>
                  <option value="Damaged Goods">Damaged Goods</option>
                  <option value="Missing Carton / Box">Missing Carton / Box</option>
                  <option value="Temperature Abuse">Temperature Abuse</option>
                  <option value="Packaging Defect">Packaging Defect</option>
                  <option value="Other">Other</option>
                </select>
                <svg className="form-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">
                Affected Stop <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  className="form-select"
                  value={affectedStop}
                  onChange={(e) => setAffectedStop(e.target.value)}
                  required
                >
                  <option value="01 — Colombo 03 · Waypoint Fresh">01 — Colombo 03 · Waypoint Fresh</option>
                  <option value="02 — Bambalapitiya · Waypoint Style">02 — Bambalapitiya · Waypoint Style</option>
                  <option value="03 — Wellawatte · Waypoint Tech">03 — Wellawatte · Waypoint Tech</option>
                  <option value="04 — Dehiwala · Waypoint Fresh">04 — Dehiwala · Waypoint Fresh</option>
                  <option value="05 — Mount Lavinia · Waypoint Fresh">05 — Mount Lavinia · Waypoint Fresh</option>
                </select>
                <svg className="form-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 2: Affected Order & Affected Item */}
          <div className="form-fields-two-col">
            <div className="form-field-group">
              <label className="form-label">
                Affected Order <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  className="form-select"
                  value={affectedOrder}
                  onChange={(e) => setAffectedOrder(e.target.value)}
                  required
                >
                  <option value="ORD-1048">ORD-1048</option>
                  <option value="ORD-1042">ORD-1042</option>
                  <option value="ORD-1043">ORD-1043</option>
                  <option value="ORD-1051">ORD-1051</option>
                  <option value="ORD-1057">ORD-1057</option>
                </select>
                <svg className="form-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            <div className="form-field-group">
              <label className="form-label">
                Affected Item <span className="req-star">*</span>
              </label>
              <div className="form-select-wrapper">
                <select
                  className="form-select"
                  value={affectedItem}
                  onChange={(e) => setAffectedItem(e.target.value)}
                  required
                >
                  <option value="Rice 5kg">Rice 5kg</option>
                  <option value="Cooking Oil 1L">Cooking Oil 1L</option>
                  <option value="Sugar 1kg">Sugar 1kg</option>
                  <option value="Flour 1kg">Flour 1kg</option>
                  <option value="Fresh Milk 1L">Fresh Milk 1L</option>
                </select>
                <svg className="form-select-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 3: Planned Quantity & Actual Quantity Loaded */}
          <div className="form-fields-two-col">
            <div className="form-field-group">
              <label className="form-label">Planned Quantity</label>
              <input
                type="text"
                className="form-input form-input-disabled"
                value={`${plannedQty} units`}
                disabled
              />
            </div>

            <div className="form-field-group">
              <label className="form-label">
                Actual Quantity Loaded <span className="req-star">*</span>
              </label>
              <input
                type="number"
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
              <svg
                className="difference-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
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
              placeholder="Provide specific details about the issue observed..."
              required
            />
          </div>
        </div>

        {/* Right Column: Upload Box + Summary Preview */}
        <div className="record-issue-side-col">
          <ReportIssueUpload />
          <ReportIssueSummaryCard
            issueType={issueType}
            stop={affectedStop.split(' · ')[0]}
            item={affectedItem}
            order={affectedOrder}
            discrepancy={diff}
          />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="record-issue-footer">
        <button
          type="button"
          className="btn-cancel-issue"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn-submit-issue">
          Submit Issue
        </button>
      </div>

      {/* Success Modal Popup */}
      <IssueSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        issueData={{
          issueId: 'ISS-0042',
          associatedLoad: `${loadId} (WP-REF-007)`,
          issueClass: issueType,
          affectedProduct: `${affectedItem} (${affectedOrder})`,
          discrepancy: diff > 0 ? `+${diff} units` : `${diff} units`,
          status: 'Reported',
          loggedTime: '09:42 AM, 27 Sep 2026',
          loadId: loadId,
        }}
      />
    </form>
  )
}
