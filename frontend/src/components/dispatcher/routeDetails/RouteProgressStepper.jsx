export default function RouteProgressStepper() {
  const steps = [
    {
      title: 'PLANNED',
      desc: 'Route created',
      time: '02:12 AM',
      status: 'completed',
    },
    {
      title: 'LOADING',
      desc: 'Loading scheduled',
      time: '04:00 AM',
      status: 'pending',
    },
    {
      title: 'DEPARTED',
      desc: 'Planned departure',
      time: '05:30 AM',
      status: 'pending',
    },
    {
      title: 'IN PROGRESS',
      desc: '8 delivery stops',
      time: '05:45 AM onward',
      status: 'pending',
    },
    {
      title: 'COMPLETED',
      desc: 'Estimated completion',
      time: '10:45 AM',
      status: 'pending',
    },
  ]

  return (
    <div className="route-card route-progress-card">
      <div className="route-card-header">
        <h2 className="route-card-title">Route Progress</h2>
        <p className="route-card-subtitle">Planned operational milestones</p>
      </div>

      <div className="progress-stepper-track-wrap">
        <div className="stepper-horizontal-line"></div>
        <div className="stepper-items-row">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`stepper-node ${step.status === 'completed' ? 'node-completed' : 'node-pending'}`}
            >
              <div className="node-icon-dot">
                {step.status === 'completed' ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="inner-dot"></span>
                )}
              </div>
              <div className="node-meta">
                <span className="node-title">{step.title}</span>
                <span className="node-desc">{step.desc}</span>
                <span className="node-time">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
