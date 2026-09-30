import { useNavigate } from 'react-router-dom'

export default function IssueSuccessModal({
  isOpen,
  onClose,
  issueData = {
    issueId: 'ISS-0042',
    associatedLoad: 'LD-025 (WP-REF-007)',
    issueClass: 'Quantity Mismatch',
    affectedProduct: 'Rice 5kg (ORD-1048)',
    discrepancy: '-8 units',
    status: 'Reported',
    loggedTime: '09:42 AM, 27 Sep 2026',
    loadId: 'LD-025',
  },
}) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleBackToLoadDetails = () => {
    if (onClose) onClose()
    navigate(`/loader/today-orders/${issueData.loadId || 'LD-025'}`)
  }

  const handleViewChecklist = () => {
    if (onClose) onClose()
    navigate('/loader/loading-history')
  }

  return (
    <div className="issue-modal-backdrop" onClick={onClose}>
      <div className="issue-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Success Check Icon */}
        <div className="modal-success-icon-wrap">
          <svg
            className="modal-check-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        {/* Title & Description */}
        <h3 className="modal-title">Issue Reported Successfully</h3>
        <p className="modal-subtitle">
          The loading discrepancy has been logged and assigned to the dispatch controller.
        </p>

        {/* Summary Table Card */}
        <div className="modal-summary-card">
          <div className="modal-summary-row">
            <span className="modal-summary-label">Issue ID</span>
            <span className="modal-summary-value text-blue bold">
              {issueData.issueId}
            </span>
          </div>

          <div className="modal-summary-row">
            <span className="modal-summary-label">Associated Load</span>
            <span className="modal-summary-value bold">
              {issueData.associatedLoad}
            </span>
          </div>

          <div className="modal-summary-row">
            <span className="modal-summary-label">Issue Class</span>
            <span className="modal-summary-value bold">
              {issueData.issueClass}
            </span>
          </div>

          <div className="modal-summary-row">
            <span className="modal-summary-label">Affected Product</span>
            <span className="modal-summary-value bold">
              {issueData.affectedProduct}
            </span>
          </div>

          <div className="modal-summary-row">
            <span className="modal-summary-label">Discrepancy</span>
            <span className="modal-summary-value text-red bold">
              {issueData.discrepancy}
            </span>
          </div>

          <div className="modal-summary-divider" />

          <div className="modal-summary-row">
            <span className="modal-summary-label">Status</span>
            <span className="modal-status-pill">{issueData.status}</span>
          </div>

          <div className="modal-summary-row">
            <span className="modal-summary-label">Logged Time</span>
            <span className="modal-summary-value text-muted">
              {issueData.loggedTime}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action-buttons">
          <button
            type="button"
            className="btn-modal-primary"
            onClick={handleBackToLoadDetails}
          >
            Back to Load Details
          </button>
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={handleViewChecklist}
          >
            View Loading Checklist
          </button>
        </div>
      </div>
    </div>
  )
}
