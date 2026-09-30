export default function RouteValidationCard() {
  const checks = [
    {
      title: 'Vehicle weight capacity',
      desc: '3,050 kg capacity / 3,820 kg assigned',
      passed: true,
    },
    {
      title: 'Vehicle volume capacity',
      desc: '28 mÂ³ capacity / 21.4 mÂ³ assigned',
      passed: true,
    },
    {
      title: 'Temperature compatibility',
      desc: 'All chilled/frozen goods assigned to refrigerated vehicle',
      passed: true,
    },
    {
      title: 'Outlet access',
      desc: 'All assigned outlets accessible by this vehicle',
      passed: true,
    },
    {
      title: 'Delivery windows',
      desc: 'All planned stops currently fit their delivery windows',
      passed: true,
    },
    {
      title: 'Fuel availability',
      desc: "Route is within the vehicle's available weekly fuel quota",
      passed: true,
    },
  ]

  return (
    <div className="route-card route-validation-card">
      <div className="route-card-header flex-between">
        <div>
          <h2 className="route-card-title">Route Validation</h2>
          <p className="route-card-subtitle">All operational constraints passed</p>
        </div>
        <span className="validation-passed-pill">6 / 6 passed</span>
      </div>

      <div className="validation-checklist">
        {checks.map((item, idx) => (
          <div key={idx} className="validation-check-row">
            <div className="check-left-group">
              <div className="check-circle-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="check-text-meta">
                <span className="check-item-title">{item.title}</span>
                <span className="check-item-desc">{item.desc}</span>
              </div>
            </div>
            <span className="passed-text-tag">PASSED</span>
          </div>
        ))}
      </div>
    </div>
  )
}
