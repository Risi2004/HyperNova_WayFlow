export default function StopInstructionsCard({
  instructions = 'Use the rear receiving entrance. Ask for the outlet manager before unloading. Keep refrigerated items inside the cold storage area.',
}) {
  return (
    <div className="stop-detail-card stop-instructions-card">
      <div className="instructions-title-row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <h3 className="card-section-title">Delivery Instructions</h3>
      </div>

      <p className="stop-instructions-paragraph">
        {instructions}
      </p>
    </div>
  )
}
