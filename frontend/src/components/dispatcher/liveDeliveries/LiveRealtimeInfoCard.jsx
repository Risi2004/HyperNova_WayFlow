export default function LiveRealtimeInfoCard() {
  const points = [
    { title: 'Explicit progress values' },
    { title: 'Text-bearing status states' },
    { title: 'Actionable exception reasons' },
  ]

  return (
    <div className="live-realtime-info-card">
      <div className="realtime-header-group">
        <h3 className="realtime-title">Real-time network visibility</h3>
        <p className="realtime-subtitle">
          Each trip keeps its current stop, ETA, route progress, last report, and exception state visible to Dispatchers.
        </p>
      </div>

      <div className="realtime-pills-row">
        {points.map((p, idx) => (
          <div key={idx} className="realtime-pill-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="realtime-pill-icon">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="realtime-pill-text">{p.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
