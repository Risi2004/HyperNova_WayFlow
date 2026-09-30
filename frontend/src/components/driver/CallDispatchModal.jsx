export default function CallDispatchModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="driver-modal-backdrop" onClick={onClose}>
      <div className="driver-modal-box" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="driver-modal-header">
          <div className="modal-title-with-icon">
            <span className="modal-icon-badge blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div>
              <h3 className="driver-modal-title">Peliyagoda Central Dispatch</h3>
              <p className="driver-modal-sub">Direct hotline for live delivery assistance</p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="dispatch-contact-card">
          <div className="dispatch-controller-meta">
            <span className="controller-role">Active Route Controller</span>
            <span className="controller-name">Dinesh Fernando (Desk 04)</span>
            <span className="controller-channel">Radio Frequency: CH-08 (Colombo South)</span>
          </div>

          <div className="dispatch-numbers-list">
            <div className="dispatch-number-row">
              <span className="number-label">Emergency Line:</span>
              <a href="tel:+94112945500" className="number-link">+94 11 294 5500</a>
            </div>
            <div className="dispatch-number-row">
              <span className="number-label">Mobile Direct:</span>
              <a href="tel:+94771234567" className="number-link">+94 77 123 4567</a>
            </div>
          </div>
        </div>

        <div className="driver-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onClose}>
            Close
          </button>
          <a href="tel:+94112945500" className="btn-modal-submit-blue">
            Dial Dispatch Now
          </a>
        </div>
      </div>
    </div>
  )
}
