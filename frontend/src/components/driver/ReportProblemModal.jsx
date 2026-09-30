import { useState } from 'react'

export default function ReportProblemModal({ isOpen, onClose, onSubmit }) {
  const [issueType, setIssueType] = useState('traffic')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSubmit && onSubmit({ issueType, details })
      onClose()
    }, 500)
  }

  return (
    <div className="driver-modal-backdrop" onClick={onClose}>
      <div className="driver-modal-box" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="driver-modal-header">
          <div className="modal-title-with-icon">
            <span className="modal-icon-badge red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div>
              <h3 className="driver-modal-title">Report Driver Problem</h3>
              <p className="driver-modal-sub">Alert dispatch controller for vehicle TR-024</p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="driver-modal-form">
          <div className="modal-form-group">
            <label className="modal-form-label">Problem Category</label>
            <select
              className="modal-form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="traffic">Traffic Congestion / Severe Delay</option>
              <option value="access">Store Receiving Gate Locked / Access Denied</option>
              <option value="breakdown">Vehicle Mechanical / Reefer Temperature Warning</option>
              <option value="package">Damaged Package / Missing Seal</option>
              <option value="customer">Customer Unavailable</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label className="modal-form-label">Notes & Circumstances</label>
            <textarea
              className="modal-form-textarea"
              rows={3}
              placeholder="Describe current road or store situation..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="driver-modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit-red"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Transmitting Alert...' : 'Broadcast to Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
