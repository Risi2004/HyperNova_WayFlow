import attentionIcon from '../../../assets/icons/attention.svg'

export default function PlanningStatusCard({ statusLabel, actionRequired = false, plan, steps = [] }) {
  const assigned = (value) =>
    value ? <span className="assignment-val">{value}</span> : <span className="assignment-val-muted">Not Assigned</span>

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
          <span className="callout-value">{statusLabel}</span>
        </div>
        {actionRequired && (
          <div className="callout-badge-action">
            <img src={attentionIcon} alt="" className="callout-badge-icon" aria-hidden="true" />
            <span>Action Required</span>
          </div>
        )}
      </div>

      {/* 4 Assignment Boxes */}
      <div className="planning-assignments-grid">
        <div className="assignment-tile">
          <span className="assignment-label">Vehicle</span>
          {assigned(plan && `${plan.vehicle_id} (${plan.vehicle_type}, ${plan.vehicle_temp})`)}
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Route</span>
          {assigned(plan && `${plan.trip_id} • stop ${plan.stop_sequence}`)}
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Driver</span>
          {assigned(plan?.driver_name)}
        </div>
        <div className="assignment-tile">
          <span className="assignment-label">Load Position</span>
          {assigned(plan && `Load #${plan.loading_sequence} (last off first on)`)}
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
