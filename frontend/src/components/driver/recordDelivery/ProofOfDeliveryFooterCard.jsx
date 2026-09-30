export default function ProofOfDeliveryFooterCard({
  onContinueProof,
}) {
  return (
    <div className="proof-of-delivery-footer-card">
      <div className="proof-footer-text-block">
        <h4 className="proof-footer-title">Next: Capture Proof of Delivery</h4>
        <p className="proof-footer-description">
          After recording the delivery outcome, capture the required proof of delivery.
        </p>
      </div>

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
