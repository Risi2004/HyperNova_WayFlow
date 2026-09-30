export default function ImportantWarningsCard({
  warnings = [
    {
      id: 1,
      type: 'amber',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      text: '2 upcoming stops have narrow delivery windows',
    },
    {
      id: 2,
      type: 'blue',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="12" y1="12" x2="20" y2="7.38" />
          <line x1="12" y1="12" x2="4" y2="16.62" />
          <line x1="12" y1="12" x2="4" y2="7.38" />
          <line x1="12" y1="12" x2="20" y2="16.62" />
        </svg>
      ),
      text: 'Refrigerated vehicle — maintain cargo temperature below 4°C',
    },
    {
      id: 3,
      type: 'red',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      text: 'Stop 06 has special receiving gate access codes required',
    },
    {
      id: 4,
      type: 'green',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      text: 'All loaded dispatch items pre-verified by loading bay team',
    },
  ],
}) {
  return (
    <div className="driver-card important-warnings-card">
      <div className="driver-card-header">
        <h3 className="driver-card-title">Important Information & Warnings</h3>
      </div>

      <div className="warnings-list">
        {warnings.map((item) => (
          <div key={item.id} className="warning-item-row">
            <span className={`warning-icon-pill ${item.type}`}>
              {item.icon}
            </span>
            <span className="warning-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
