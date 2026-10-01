export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  isReceiptMode = false,
}) {
  if (!isOpen || !order) return null

  return (
    <div className="mo-modal-backdrop" onClick={onClose}>
      <div className="mo-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mo-modal-header">
          <div className="mo-modal-title-wrap">
            <span className="mo-modal-code">{order.id}</span>
            <span className={`mo-modal-status-badge ${order.status.toLowerCase()}`}>
              {order.status.replace('_', ' ')}
            </span>
            {order.priority && (
              <span className={`mo-modal-priority-pill ${order.priority.toLowerCase()}`}>
                {order.priority}
              </span>
            )}
          </div>
          <button type="button" className="btn-mo-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="mo-modal-body">
          {/* Summary grid */}
          <div className="mo-modal-info-grid">
            <div className="mo-modal-info-item">
              <span className="info-label">Assigned Hub / Route</span>
              <span className="info-val">{order.hubOrRoute}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Placed Timestamp</span>
              <span className="info-val">{order.placedDate} at {order.placedTime}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Requested Delivery</span>
              <span className="info-val">{order.requestedDate}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Delivery Window</span>
              <span className="info-val">{order.deliveryWindow}</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">Items &amp; Weight</span>
              <span className="info-val">{order.itemCount} items — {order.weightKg} kg</span>
            </div>
            <div className="mo-modal-info-item">
              <span className="info-label">SKUs Composition</span>
              <span className="info-val">{order.skusSummary}</span>
            </div>
          </div>

          {/* If receipt mode */}
          {isReceiptMode && (
            <div className="mo-receipt-section">
              <div className="mo-receipt-box">
                <div className="mo-receipt-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <h4>Electronic Proof of Delivery (e-POD)</h4>
                </div>
                <div className="mo-receipt-details">
                  <p><strong>Store:</strong> Colombo 05 Store (OUT043)</p>
                  <p><strong>Signed by:</strong> {order.statusSub || 'Sarah Perera (Store Manager)'}</p>
                  <p><strong>Receipt Status:</strong> Verified &amp; Confirmed Intact</p>
                  <p><strong>Seal Barcode:</strong> SEC-SEAL-88391-OK</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Manifest items preview */}
          <div className="mo-modal-manifest-section">
            <h4 className="mo-manifest-heading">Order Manifest (Preview)</h4>
            <div className="mo-manifest-list">
              <div className="mo-manifest-item">
                <span>Premium White Rice 5kg (10 Cases)</span>
                <span className="manifest-cat">Ambient</span>
              </div>
              <div className="mo-manifest-item">
                <span>Fresh Highland Milk 1L (8 Cases)</span>
                <span className="manifest-cat chilled">Chilled (+4°C)</span>
              </div>
              <div className="mo-manifest-item">
                <span>Frozen Farm Mixed Vegetables 1kg (6 Cases)</span>
                <span className="manifest-cat frozen">Frozen (-18°C)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mo-modal-footer">
          <button type="button" className="btn-mo-modal-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-mo-modal-primary"
            onClick={() => {
              window.print()
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span>Print Manifest</span>
          </button>
        </div>
      </div>
    </div>
  )
}
