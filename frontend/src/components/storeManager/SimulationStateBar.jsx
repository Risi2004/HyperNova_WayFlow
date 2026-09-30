export default function SimulationStateBar({
  currentState = 'active',
  onSelectState,
}) {
  const states = [
    { id: 'active', label: '● Active View' },
    { id: 'loading', label: 'Loading Skeleton', icon: null },
    { id: 'empty', label: 'Empty State', icon: null },
    {
      id: 'alerts',
      label: 'High Alerts (3 Deferred)',
      isAlert: true,
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ]

  return (
    <div className="sm-sim-state-bar">
      <div className="sm-sim-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span>DASHBOARD SIMULATION STATE:</span>
      </div>

      <div className="sm-sim-buttons-group">
        {states.map((st) => {
          const isActive = currentState === st.id
          return (
            <button
              key={st.id}
              type="button"
              className={`sm-sim-pill-btn ${isActive ? 'active' : ''} ${st.isAlert ? 'alert-pill' : ''}`}
              onClick={() => onSelectState && onSelectState(st.id)}
            >
              {st.icon && <span className="sim-btn-icon">{st.icon}</span>}
              <span>{st.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
