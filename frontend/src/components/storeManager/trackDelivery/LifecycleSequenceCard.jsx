export default function LifecycleSequenceCard({ simState = 'in_delivery' }) {
  const isDelivered = simState === 'delivered'
  const isArriving = simState === 'arriving_soon'

  return (
    <div className="td-lifecycle-card">
      <div className="td-lifecycle-header">
        <div className="td-lifecycle-title-group">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span className="td-lifecycle-title">DELIVERY LIFECYCLE SEQUENCE</span>
        </div>
        <span className="td-lifecycle-dispatched-sub">
          Dispatched via Peliyagoda Cold-Chain DC
        </span>
      </div>

      <div className="td-lifecycle-stepper-wrap">
        <div className="td-stepper-line-track">
          <div
            className="td-stepper-line-fill"
            style={{ width: isDelivered ? '100%' : isArriving ? '80%' : '56%' }}
          />
        </div>

        <div className="td-stepper-steps-row">
          {/* Step 1: Scheduled */}
          <div className="td-step-item completed">
            <div className="td-step-circle completed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="td-step-name">Scheduled</span>
            <span className="td-step-time">09:00 AM</span>
          </div>

          {/* Step 2: Loaded at Depot */}
          <div className="td-step-item completed">
            <div className="td-step-circle completed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="td-step-name">Loaded at Depot</span>
            <span className="td-step-time">09:20 AM</span>
          </div>

          {/* Step 3: In Transit */}
          <div className={`td-step-item ${isDelivered ? 'completed' : 'active'}`}>
            <div className={`td-step-circle ${isDelivered ? 'completed' : 'active'}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className={`td-step-name ${!isDelivered ? 'blue-bold' : ''}`}>In Transit</span>
            <span className="td-step-time">10:05 AM (Current)</span>
          </div>

          {/* Step 4: Arriving Soon */}
          <div className={`td-step-item ${isDelivered ? 'completed' : isArriving ? 'active' : 'upcoming'}`}>
            <div className={`td-step-circle ${isDelivered ? 'completed' : isArriving ? 'active' : 'upcoming'}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="td-step-name">Arriving Soon</span>
            <span className="td-step-time">~10:42 AM</span>
          </div>

          {/* Step 5: Delivered */}
          <div className={`td-step-item ${isDelivered ? 'active' : 'upcoming'}`}>
            <div className={`td-step-circle ${isDelivered ? 'active' : 'upcoming'}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <span className="td-step-name">Delivered</span>
            <span className="td-step-time">{isDelivered ? 'Ready for Dock Intake' : 'Pending Sign-off'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
