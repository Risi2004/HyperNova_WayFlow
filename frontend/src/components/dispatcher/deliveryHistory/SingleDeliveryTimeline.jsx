export default function SingleDeliveryTimeline() {
  const events = [
    {
      time: '08:15 AM',
      title: 'Order Loaded at Peliyagoda DC',
      desc: 'Reefer temperature verified at 3.8Â°C prior to hub departure.',
      status: 'completed',
    },
    {
      time: '08:30 AM',
      title: 'Departed Hub on Route TR-024',
      desc: 'Vehicle WP-CB-4521 entered Colombo transport corridor.',
      status: 'completed',
    },
    {
      time: '08:58 AM',
      title: 'Arrived at OUT042 (Geofence Entry)',
      desc: 'Automated GPS geofence handshake recorded within 15m radius.',
      status: 'completed',
    },
    {
      time: '09:12 AM',
      title: 'Unloading & Quality Verification',
      desc: '36 chilled units checked and accepted by store receiving clerk.',
      status: 'completed',
    },
    {
      time: '09:14 AM',
      title: 'Proof of Delivery Completed',
      desc: 'Electronic signature and cargo photo signed and uploaded to WayFlow.',
      status: 'completed',
    },
  ]

  return (
    <div className="single-card single-timeline-card">
      <div className="single-card-header">
        <h2 className="single-card-title">Delivery Milestones</h2>
        <p className="single-card-subtitle">
          End-to-end audit trail from hub loading to final handover
        </p>
      </div>

      <div className="timeline-nodes-horizontal">
        <div className="timeline-horizontal-bar"></div>
        <div className="timeline-steps-flex">
          {events.map((evt, idx) => (
            <div key={idx} className="timeline-step-node">
              <div className="node-icon-circle green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="step-time-tag">{evt.time}</div>
              <div className="step-title-text bold">{evt.title}</div>
              <div className="step-desc-text">{evt.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
