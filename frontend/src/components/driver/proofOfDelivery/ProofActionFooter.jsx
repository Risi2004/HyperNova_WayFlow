import { useNavigate } from 'react-router-dom'

export default function ProofActionFooter({
  tripId = 'TR-024',
  isSaveEnabled = false,
  onSaveProof,
  isSaving = false,
}) {
  const navigate = useNavigate()

  return (
    <div className="proof-action-footer-row">
      <button
        type="button"
        className="btn-footer-back-link"
        onClick={() => navigate(`/driver/my-trips/${tripId}/delivery-stop`)}
      >
        Back to Stop Details
      </button>

      <button
        type="button"
        className={`btn-save-proof-action ${isSaveEnabled ? 'active' : 'disabled'}`}
        onClick={onSaveProof}
        disabled={isSaving}
      >
        {isSaving ? 'Saving Proof...' : 'Save Proof of Delivery'}
      </button>
    </div>
  )
}
