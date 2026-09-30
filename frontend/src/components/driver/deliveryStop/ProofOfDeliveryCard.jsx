export default function ProofOfDeliveryCard({
  onContinueProof,
}) {
  return (
    <div className="stop-sidebar-card proof-of-delivery-card">
      <h4 className="sidebar-card-title">PROOF OF DELIVERY</h4>

      <p className="proof-sub-text">
        Proof will be recorded after completing the delivery.
      </p>

      <button
        type="button"
        className="btn-continue-proof-outline"
        onClick={onContinueProof}
      >
        Continue to Proof of Delivery
      </button>
    </div>
  )
}
