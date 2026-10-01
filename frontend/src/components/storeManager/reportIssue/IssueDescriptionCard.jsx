export default function IssueDescriptionCard({
  description,
  onChangeDescription,
  maxLength = 500,
}) {
  return (
    <div className="ri-section-card">
      {/* Section Header */}
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">3</div>
          <h2 className="ri-section-title">Describe the Issue</h2>
        </div>
        <span className="ri-badge-required">REQUIRED</span>
      </div>
      <p className="ri-section-subtitle">
        Dock observations, packaging condition, or driver confirmation
      </p>

      {/* Textarea */}
      <div className="ri-desc-textarea-wrap">
        <textarea
          className="ri-desc-textarea"
          rows={4}
          maxLength={maxLength}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder="Detail dock numbers, seals, and batch stamps..."
        />
        <div className="ri-desc-footer">
          <span className="ri-desc-hint">Detail dock numbers, seals, and batch stamps.</span>
          <span className="ri-desc-counter">
            {description.length} / {maxLength} characters
          </span>
        </div>
      </div>
    </div>
  )
}
