export default function MultiTempInfoCard() {
  return (
    <div className="co-multi-temp-card">
      <div className="co-multi-temp-header">
        <div className="co-multi-temp-icon">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <h4 className="co-multi-temp-title">Multi-Temp Palletizing</h4>
      </div>
      <p className="co-multi-temp-desc">
        Orders with chilled and frozen SKUs will be automatically segregated into sealed insulated thermal roll-cages for transit.
      </p>
    </div>
  )
}
