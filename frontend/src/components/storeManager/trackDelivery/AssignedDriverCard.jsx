export default function AssignedDriverCard() {
  return (
    <div className="td-driver-card">
      <div className="td-driver-header">
        <h4 className="td-driver-title">ASSIGNED DRIVER &amp; VEHICLE</h4>
        <button
          type="button"
          className="btn-driver-external"
          title="Open telematics and driver profile"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>

      {/* Driver Identity */}
      <div className="td-driver-profile-row">
        <div className="td-driver-avatar">MV</div>
        <div className="td-driver-meta-col">
          <div className="td-driver-name-row">
            <span className="td-driver-name">Marcus Vance</span>
            <span className="td-verified-badge">Verified</span>
          </div>
          <span className="td-driver-id-sub">
            Driver ID: DRV-091 &bull; WayFlow Dedicated Logistics
          </span>
        </div>
      </div>

      {/* Vehicle Specs */}
      <div className="td-driver-specs-list">
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Vehicle:</span>
          <span className="td-spec-val">WP-REF-007 (Isuzu 5T)</span>
        </div>
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Compartment:</span>
          <span className="td-spec-val blue-cold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.4">
              <path d="m20 16-4-4 4-4" />
              <path d="m4 8 4 4-4 4" />
            </svg>
            Dual-Zone Reefer
          </span>
        </div>
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Direct Dispatch Radio:</span>
          <span className="td-spec-val radio-val">+94 11 234 5678</span>
        </div>
      </div>

      {/* Driver Note Box */}
      <div className="td-driver-note-box">
        <span className="td-note-title">Driver Pre-Arrival Note:</span>
        <p className="td-note-quote">
          &ldquo;Dock Bay 02 access via Station Road Alley verified. Ramp clear for reverse approach.&rdquo;
        </p>
      </div>
    </div>
  )
}
