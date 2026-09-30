export default function TraceableDecisionsCard() {
  const points = [
    {
      title: 'Explicit reason and measured shortfall',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      ),
    },
    {
      title: 'Repeat history and last served date',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: 'Return to Planner without bypassing constraints',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      ),
    },
  ]

  return (
    <div className="traceable-decisions-card">
      <div className="traceable-header-group">
        <h3 className="traceable-title">Traceable planning decisions</h3>
        <p className="traceable-subtitle">
          Every deferral keeps the exact constraint, next opportunity, and prior history visible.
        </p>
      </div>

      <div className="traceable-pills-row">
        {points.map((p, idx) => (
          <div key={idx} className="traceable-pill-item">
            <span className="traceable-pill-icon">{p.icon}</span>
            <span className="traceable-pill-text">{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
