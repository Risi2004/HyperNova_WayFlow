import { useState } from 'react'
import { DEFERRAL_REASONS } from '../../../utils/orderFormat'
import './DeferOrdersModal.css'

// Records why orders are moved to a later run. The reason is shown to the store manager
// and kept in the deferral history so repeat skips of the same outlet are visible.
export default function DeferOrdersModal({ orderIds = [], isOpen, isBusy, onClose, onConfirm }) {
  const [reason, setReason] = useState('capacity_exceeded')
  const [explanation, setExplanation] = useState('')

  if (!isOpen) return null

  return (
    <div className="defer-modal-overlay" onClick={onClose}>
      <div className="defer-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="defer-modal-header">
          <h3>Defer {orderIds.length === 1 ? orderIds[0] : `${orderIds.length} orders`}</h3>
          <button type="button" className="defer-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="defer-modal-desc">
          Deferred orders move to the next operating day and the store manager is told why.
        </p>

        <label className="defer-modal-label" htmlFor="defer-reason">Reason</label>
        <select
          id="defer-reason"
          className="defer-modal-input"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {Object.entries(DEFERRAL_REASONS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label className="defer-modal-label" htmlFor="defer-explanation">Explanation (optional)</label>
        <textarea
          id="defer-explanation"
          className="defer-modal-input defer-modal-textarea"
          rows={3}
          placeholder="e.g. All reefers committed to Fresh chilled runs before 8 AM."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />

        <div className="defer-modal-actions">
          <button type="button" className="defer-btn-secondary" onClick={onClose} disabled={isBusy}>
            Cancel
          </button>
          <button
            type="button"
            className="defer-btn-primary"
            disabled={isBusy}
            onClick={() => onConfirm(reason, explanation)}
          >
            {isBusy ? 'Deferring…' : 'Defer Orders'}
          </button>
        </div>
      </div>
    </div>
  )
}
