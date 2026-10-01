export default function TelemetrySimulatorBar({
  currentState = 'in_delivery',
  onSelectState,
  tripId = 'TR-024',
}) {
  const states = [
    { id: 'in_delivery', label: '1. In Delivery (Default)' },
    { id: 'offline', label: '0. Offline / No Live Update' },
    { id: 'arriving_soon', label: '2. Arriving Soon' },
    { id: 'loading', label: '3. Loading Skeleton' },
    { id: 'delayed', label: '5. Delayed (>35m)' },
    { id: 'error', label: '6. Error State' },
    { id: 'delivered', label: '4. Delivered (Ready to Confirm)' },
    { id: 'scheduled', label: '5. Scheduled' },
  ]

  return (
    <div className="td-sim-bar">
      <div className="td-sim-header-row">
        <div className="td-sim-title-group">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="td-sim-title">PROTOTYPE TELEMETRY STATE SIMULATOR:</span>
          <span className="td-sim-sub">Simulate real-time vehicle dispatch engine telemetry events.</span>
        </div>
        <span className="td-sim-engine-tag">Trip {tripId} &bull; Dispatch Engine v2.4</span>
      </div>

      <div className="td-sim-buttons-row">
        {states.map((st) => (
          <button
            key={st.id}
            type="button"
            className={`td-sim-btn ${currentState === st.id ? 'active' : ''} ${st.id}`}
            onClick={() => onSelectState(st.id)}
          >
            {st.label}
          </button>
        ))}
      </div>
    </div>
  )
}
