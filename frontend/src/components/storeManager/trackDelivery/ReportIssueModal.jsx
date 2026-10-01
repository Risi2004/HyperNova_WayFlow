import { useState } from 'react'

export default function ReportIssueModal({
  isOpen,
  onClose,
  onSubmitIssue,
  orderId = 'ORD-1042',
  tripId = 'TR-024',
}) {
  const [issueType, setIssueType] = useState('DOCK_BLOCKED')
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  return (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="td-modal-header">
          <div className="td-modal-title-col">
            <h3 className="td-modal-title">Report Dock Gate / Delivery Issue</h3>
            <span className="td-modal-sub">Escalation for Order {orderId} &bull; Trip {tripId}</span>
          </div>
          <button type="button" className="btn-td-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="td-modal-content">
          <div className="td-issue-form">
            <label className="td-form-label">Issue Category</label>
            <select
              className="td-form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option value="DOCK_BLOCKED">Bay 02 Access Blocked / Obstruction</option>
              <option value="DELAY_ESCALATION">Delivery Delay Exceeding SLA Window</option>
              <option value="DRIVER_UNREACHABLE">Driver Unreachable via Radio/Phone</option>
              <option value="TEMPERATURE_CONCERN">Reefer Temperature Spike Concern</option>
              <option value="OTHER">Other Route / Operational Exception</option>
            </select>

            <label className="td-form-label" style={{ marginTop: 12 }}>
              Description &amp; Operational Notes
            </label>
            <textarea
              className="td-form-textarea"
              rows={4}
              placeholder="Describe the issue at Colombo 05 Store dock or en route..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="td-modal-footer">
          <button type="button" className="btn-td-secondary" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn-td-danger"
            onClick={() => {
              onSubmitIssue(issueType, notes)
              onClose()
            }}
          >
            Submit Escalation to Dispatch
          </button>
        </div>
      </div>
    </div>
  )
}
