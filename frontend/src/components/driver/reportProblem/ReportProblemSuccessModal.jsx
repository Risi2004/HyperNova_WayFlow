import { useNavigate } from 'react-router-dom'

export default function ReportProblemSuccessModal({
  isOpen,
  onClose,
  tripId = 'TR-024',
  problemType = 'Delivery Refused',
  outletName = 'Metro Grocers (OUT043)',
}) {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className="report-success-modal-backdrop" onClick={onClose}>
      <div className="report-success-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="report-success-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h3 className="report-modal-title">Problem Dispatched to Control</h3>
        <p className="report-modal-subtitle">
          An urgent alert regarding <strong>{problemType}</strong> at <strong>{outletName}</strong> has been logged with Dispatch for vehicle <strong>WP-REF-007</strong>.
        </p>

        <div className="report-modal-actions-row">
          <button
            type="button"
            className="btn-modal-back-stop"
            onClick={() => navigate(`/driver/my-trips/${tripId}/delivery-stop`)}
          >
            Back to Stop Details
          </button>
          <button
            type="button"
            className="btn-modal-back-trip"
            onClick={() => navigate(`/driver/my-trips/${tripId}`)}
          >
            Return to Trip Overview
          </button>
        </div>
      </div>
    </div>
  )
}
