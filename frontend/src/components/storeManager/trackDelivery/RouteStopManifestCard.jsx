export default function RouteStopManifestCard({
  simState = 'in_delivery',
}) {
  const isDelayed = simState === 'delayed'
  const isDelivered = simState === 'delivered'
  const currentEta = isDelayed ? '11:20 AM' : '10:45 AM'

  return (
    <div className="td-manifest-card">
      <div className="td-manifest-header">
        <div>
          <h3 className="td-manifest-title">Route Stop Manifest</h3>
          <p className="td-manifest-sub">
            Chronological dock intake log for Delivery Unit WP-REF-007
          </p>
        </div>
        <span className="td-manifest-auto-tag">Auto-recalculated with traffic</span>
      </div>

      <div className="td-manifest-stops-list">
        {/* Stop 01 */}
        <div className="td-stop-row completed">
          <div className="td-stop-left-col">
            <div className="td-stop-check-circle">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name">Stop 01: Colombo 01 Store</span>
                <span className="td-stop-badge dock-signed">DOCK SIGNED</span>
              </div>
              <span className="td-stop-meta">York Street Central &bull; 14 Crates Unloaded</span>
            </div>
          </div>
          <div className="td-stop-right-col">
            <span className="td-stop-time">09:25 AM</span>
            <span className="td-stop-sla-tag">Completed on SLA</span>
          </div>
        </div>

        {/* Stop 02 */}
        <div className="td-stop-row completed">
          <div className="td-stop-left-col">
            <div className="td-stop-check-circle">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name">Stop 02: Colombo 02 Store</span>
                <span className="td-stop-badge dock-signed">DOCK SIGNED</span>
              </div>
              <span className="td-stop-meta">Union Place Corner &bull; 19 Crates Unloaded</span>
            </div>
          </div>
          <div className="td-stop-right-col">
            <span className="td-stop-time">09:48 AM</span>
            <span className="td-stop-sla-tag">Completed on SLA</span>
          </div>
        </div>

        {/* Stop 03 */}
        <div className="td-stop-row completed">
          <div className="td-stop-left-col">
            <div className="td-stop-check-circle">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name">Stop 03: Colombo 03 Store</span>
                <span className="td-stop-badge dock-signed">DOCK SIGNED</span>
              </div>
              <span className="td-stop-meta">Kollupitiya Junction &bull; 22 Crates Unloaded</span>
            </div>
          </div>
          <div className="td-stop-right-col">
            <span className="td-stop-time">10:12 AM</span>
            <span className="td-stop-sla-tag">Completed on SLA</span>
          </div>
        </div>

        {/* Stop 04: YOUR OUTLET (ACTIVE TARGET) */}
        <div className={`td-stop-row active-target ${isDelivered ? 'arrived-target' : ''}`}>
          <div className="td-stop-left-col">
            <div className="td-stop-truck-icon-circle">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name bold-blue">
                  Stop 04: Colombo 05 Store (YOUR OUTLET)
                </span>
                <span className="td-stop-badge active-target-pill">
                  {isDelivered ? 'DOCK BAY 02 ARRIVED' : 'ACTIVE TARGET'}
                </span>
              </div>
              <div className="td-stop-cargo-spec">
                <strong>Cargo:</strong> 18 Crates Dairy Chilled + 10 Cases Ambient (107 Units Total)
              </div>
              <div className="td-stop-approach-sub">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>Approaching via Station Road Alley towards Receiving Dock Bay 02</span>
              </div>
            </div>
          </div>

          <div className="td-stop-right-col active-eta">
            <span className="td-live-eta-label">LIVE ETA</span>
            <span className={`td-live-eta-val ${isDelayed ? 'delayed-text' : ''}`}>
              {currentEta}
            </span>
            <span className={`td-live-eta-sub ${isDelayed ? 'delayed-sub' : 'green-sub'}`}>
              {isDelayed ? 'Delayed: Traffic' : 'Within SLA Window'}
            </span>
          </div>
        </div>

        {/* Stop 05 */}
        <div className="td-stop-row upcoming">
          <div className="td-stop-left-col">
            <div className="td-stop-number-circle">05</div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name gray">Stop 05: Colombo 06 Store</span>
                <span className="td-stop-badge upcoming-badge">Upcoming</span>
              </div>
              <span className="td-stop-meta">Wellawatte Strip &bull; 16 Crates</span>
            </div>
          </div>
          <div className="td-stop-right-col">
            <span className="td-stop-time gray">Est. 11:15 AM</span>
            <span className="td-stop-sla-tag gray">Next in Line</span>
          </div>
        </div>

        {/* Stop 06 */}
        <div className="td-stop-row upcoming">
          <div className="td-stop-left-col">
            <div className="td-stop-number-circle">06</div>
            <div className="td-stop-details">
              <div className="td-stop-title-line">
                <span className="td-stop-name gray">Stop 06: Colombo 07 Store</span>
                <span className="td-stop-badge upcoming-badge">Upcoming</span>
              </div>
              <span className="td-stop-meta">Cinnamon Gardens &bull; 18 Crates</span>
            </div>
          </div>
          <div className="td-stop-right-col">
            <span className="td-stop-time gray">Est. 11:45 AM</span>
            <span className="td-stop-sla-tag gray">En Route</span>
          </div>
        </div>

        {/* Bottom summary strip */}
        <div className="td-stops-remaining-footer">
          <span>+ 2 subsequent stops scheduled (Colombo 08 &amp; Boralasgamuwa 09 Final)</span>
        </div>
      </div>
    </div>
  )
}
