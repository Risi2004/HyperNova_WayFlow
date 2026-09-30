import attentionIcon from '../../../assets/icons/attention.svg'

export default function PlanningStatusCard() {
  const steps = [
    { label: 'Order Received', state: 'completed' },
    { label: 'Planning', state: 'current', subtext: 'Current' },
    { label: 'Vehicle Assigned', state: 'pending' },
    { label: 'Loading', state: 'pending' },
    { label: 'In Transit', state: 'pending' },
    { label: 'Delivered', state: 'pending' },
  ]

  return (
    <div className="order-details-card planning-status-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Planning Status</h2>
        <span className="details-card-subtitle">Assignments required before loading</span>
      </div>

      {/* Amber Callout Box */}
      <div className="planning-callout-banner">
        <div className="callout-left">
          <span className="callout-label">Current status</span>
          <span className="callout-value">Pending Planning</span>
        </div>
        <div className="callout-badge-action">
          <img src={attentionIcon} alt="" className="callout-badge-icon" aria-hidden="true" />
          <span>Action Required</span>
        </div>
      </div>

      {/* 4 Assignment Boxes */}
      <div className="planning-assignments-grid">
        <div className="assignment-tile">
          <span className="assignment-label">Vehicle</span>
          <span className="assignment-val-muted">Not Assigned</span>
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Route</span>
          <span className="assignment-val-muted">Not Assigned</span>
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Driver</span>
          <span className="assignment-val-muted">Not Assigned</span>
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Loader</span>
          <span className="assignment-val-muted">Not Assigned</span>
        </div>
      </div>

      {/* Mini Stepper */}
      <div className="planning-stepper-track">
        {steps.map((step, idx) => (
          <div key={step.label} className={`planning-node node-${step.state}`}>
            <div className="planning-circle-wrap">
              {idx > 0 && (
                <div
                  className={`planning-line-left ${
                    step.state === 'completed' || step.state === 'current' ? 'line-done' : ''
                  }`}
                />
              )}
              <div className="planning-circle">
                {step.state === 'completed' ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : null}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`planning-line-right ${
                    step.state === 'completed' ? 'line-done' : ''
                  }`}
                />
              )}
            </div>
            <span className="planning-label">{step.label}</span>
            {step.subtext && <span className="planning-subtext">{step.subtext}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
