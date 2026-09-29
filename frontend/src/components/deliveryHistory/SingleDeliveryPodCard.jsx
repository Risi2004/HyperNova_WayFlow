export default function SingleDeliveryPodCard() {
  return (
    <div className="single-card single-pod-card">
      <div className="single-card-header flex-between">
        <div>
          <h2 className="single-card-title">Proof of Delivery (POD)</h2>
          <p className="single-card-subtitle">
            Cryptographically logged recipient signature, geofence, and temperature compliance
          </p>
        </div>
        <span className="verified-security-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>VERIFIED POD</span>
        </span>
      </div>

      <div className="pod-details-grid">
        {/* Digital Signature Panel */}
        <div className="pod-signature-box">
          <span className="pod-section-label">Digital Signature</span>
          <div className="signature-canvas-mock">
            <svg viewBox="0 0 260 70" width="100%" height="70" fill="none">
              <path
                d="M15 45 C40 20, 60 55, 90 25 C120 5, 140 60, 175 35 C195 20, 210 50, 245 38"
                stroke="#1e3a8a"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="signature-meta-row">
            <span className="signer-name bold">M. Senanayake</span>
            <span className="signer-role">Store Receiving Manager</span>
          </div>
          <span className="signed-at-stamp">Signed 26 Sep 2026 at 09:14:22 AM</span>
        </div>

        {/* Audit Metrics Column */}
        <div className="pod-metrics-column">
          {/* Geolocation Verification */}
          <div className="pod-metric-row">
            <div className="pod-metric-icon-wrap green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="pod-metric-text">
              <span className="metric-title">GPS Geofence Handshake</span>
              <span className="metric-detail">6.9580° N, 79.8650° E · 8m from dock</span>
            </div>
            <span className="metric-tag-pill green">PASS</span>
          </div>

          {/* Temperature Logging */}
          <div className="pod-metric-row">
            <div className="pod-metric-icon-wrap green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            </div>
            <div className="pod-metric-text">
              <span className="metric-title">Cargo Temperature at Handover</span>
              <span className="metric-detail">4.2°C · Compliant with Chilled range (2–6°C)</span>
            </div>
            <span className="metric-tag-pill green">PASS</span>
          </div>

          {/* Photo Verification */}
          <div className="pod-metric-row">
            <div className="pod-metric-icon-wrap green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="pod-metric-text">
              <span className="metric-title">Cargo Dock Handover Photo</span>
              <span className="metric-detail">Uploaded & validated by AI vision check</span>
            </div>
            <span className="metric-tag-pill green">PASS</span>
          </div>

          {/* Digital Token */}
          <div className="pod-token-footer">
            <span className="token-label">Audit Token:</span>
            <code className="token-code">#WP-POD-8401-VERIFIED-44B9</code>
          </div>
        </div>
      </div>
    </div>
  )
}
