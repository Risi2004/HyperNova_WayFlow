export default function SuitabilityChecksBanner() {
  const checks = [
    'Weight',
    'Volume',
    'Temperature',
    'Outlet access',
    'Depot',
    'Fuel',
    'Trip availability',
  ]

  return (
    <div className="suitability-checks-banner">
      <div className="suitability-top-row">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" className="suitability-shield-icon">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span className="suitability-heading-text">Suitability checks are required</span>
      </div>

      <p className="suitability-desc-text">
        Vehicle suitability is checked against: Weight, Volume, Temperature, Outlet access, Depot, Fuel, Trip availability.
      </p>

      <div className="suitability-checklist-row">
        {checks.map((item, idx) => (
          <div key={idx} className="suitability-check-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="suitability-item-name">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
