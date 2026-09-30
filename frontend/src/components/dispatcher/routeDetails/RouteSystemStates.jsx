export default function RouteSystemStates() {
  const states = [
    {
      title: 'Route not found',
      desc: 'Check the route ID or return to Routes.',
      type: 'neutral',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
    },
    {
      title: 'Route has no assigned orders',
      desc: 'Add orders before confirming this route.',
      type: 'neutral',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      title: 'Route data unavailable',
      desc: 'Route data could not be loaded. Try again.',
      type: 'amber',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      title: 'Validation failed',
      desc: 'Route exceeds refrigerated vehicle volume capacity by 2.4 mÂ³.',
      type: 'red',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  ]

  return (
    <div className="route-system-states-section">
      <div className="states-header-meta">
        <h3 className="states-title">System states</h3>
        <p className="states-subtitle">Concise state treatments for Route Details</p>
      </div>

      <div className="system-states-grid">
        {states.map((st, idx) => (
          <div key={idx} className={`system-state-card state-card-${st.type}`}>
            <div className="state-card-icon-wrap">{st.icon}</div>
            <div className="state-card-content">
              <span className="state-title">{st.title}</span>
              <p className="state-desc">{st.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
