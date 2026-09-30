import editIcon from '../../../assets/icons/edit.svg'
import moveIcon from '../../../assets/icons/move.svg'
import deleteIcon from '../../../assets/icons/delete.svg'

export default function RouteDetailsColumn() {
  return (
    <div className="route-details-column">
      {/* Header */}
      <div className="route-details-top-header">
        <div className="details-header-text">
          <h2 className="column-title">Route Details</h2>
          <p className="column-subtitle">Selected Route 01 - details stay visible while planning</p>
        </div>
        <button type="button" className="btn-edit-route">
          <img src={editIcon} alt="" className="btn-edit-icon" />
          <span>Edit</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="route-details-card">
        {/* Vehicle Identity Header */}
        <div className="vehicle-info-header">
          <div className="vehicle-title-strip">
            <h3 className="vehicle-reg-number">WP-CA-2847</h3>
            <span className="trip-fraction-badge">TRIP 1 / 2</span>
          </div>
          <span className="vehicle-type-label">Refrigerated Truck</span>

          <div className="vehicle-meta-two-col">
            <div className="meta-pair">
              <span className="meta-pair-label">Depot</span>
              <span className="meta-pair-val">Peliyagoda</span>
            </div>
            <div className="meta-pair">
              <span className="meta-pair-label">Driver</span>
              <span className="meta-pair-val">Assigned Driver</span>
            </div>
          </div>
        </div>

        {/* Load Section */}
        <div className="details-section-block">
          <div className="section-title-between">
            <span className="section-heading">LOAD</span>
            <span className="badge-utilized-green">74% UTILIZED</span>
          </div>

          <div className="load-meter-group">
            <div className="load-meter-header">
              <span className="meter-name">Weight</span>
              <span className="meter-val">1,850 / 2,500 kg â€¢ 74%</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: '74%' }}></div>
            </div>
            <div className="meter-sub-rem">
              <span>Remaining weight</span>
              <span className="bold-rem">650 kg</span>
            </div>
          </div>

          <div className="load-meter-group">
            <div className="load-meter-header">
              <span className="meter-name">Volume</span>
              <span className="meter-val">18.2 / 22 mÂ³ â€¢ 83%</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: '83%' }}></div>
            </div>
            <div className="meter-sub-rem">
              <span>Remaining volume</span>
              <span className="bold-rem">3.8 mÂ³</span>
            </div>
          </div>
        </div>

        {/* Requirements Checklist */}
        <div className="details-section-block">
          <span className="section-heading">REQUIREMENTS</span>
          <div className="req-check-list">
            <div className="req-check-row">
              <div className="req-item-left">
                <span className="req-check-icon">âœ”</span>
                <span className="req-item-title">Refrigeration - Supported</span>
              </div>
              <span className="req-status-pill">PASSED</span>
            </div>

            <div className="req-check-row">
              <div className="req-item-left">
                <span className="req-check-icon">âœ”</span>
                <span className="req-item-title">Van-only stops - None</span>
              </div>
              <span className="req-status-pill">PASSED</span>
            </div>

            <div className="req-check-row">
              <div className="req-item-left">
                <span className="req-check-icon">âœ”</span>
                <span className="req-item-title">Depot - Valid</span>
              </div>
              <span className="req-status-pill">PASSED</span>
            </div>

            <div className="req-check-row">
              <div className="req-item-left">
                <span className="req-check-icon">âœ”</span>
                <span className="req-item-title">Fuel - Available</span>
              </div>
              <span className="req-status-pill">PASSED</span>
            </div>

            <div className="req-check-row">
              <div className="req-item-left">
                <span className="req-check-icon">âœ”</span>
                <span className="req-item-title">Delivery windows - Valid</span>
              </div>
              <span className="req-status-pill">PASSED</span>
            </div>
          </div>
        </div>

        {/* Route Totals */}
        <div className="details-section-block">
          <span className="section-heading">ROUTE TOTALS</span>
          <div className="totals-key-values">
            <div className="totals-row">
              <span className="total-key">Stop count</span>
              <span className="total-val">4 stops</span>
            </div>
            <div className="totals-row">
              <span className="total-key">Distance</span>
              <span className="total-val">68 km</span>
            </div>
            <div className="totals-row">
              <span className="total-key">Estimated duration</span>
              <span className="total-val">8h 15m</span>
            </div>
            <div className="totals-row">
              <span className="total-key">Estimated departure</span>
              <span className="total-val">6:30 AM</span>
            </div>
            <div className="totals-row">
              <span className="total-key">Final arrival</span>
              <span className="total-val">2:45 PM</span>
            </div>
          </div>
        </div>

        {/* Policy Notice Box */}
        <div className="route-policy-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" className="policy-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="policy-text">
            Every assignment is checked against vehicle limits, temperature, outlet restrictions, delivery window, depot, and fuel.
          </p>
        </div>

        {/* Actions */}
        <div className="route-bottom-actions">
          <button type="button" className="btn-move-trips">
            <img src={moveIcon} alt="" className="btn-icon-svg" />
            <span>Move orders between trips</span>
          </button>
          <button type="button" className="btn-remove-route-danger">
            <img src={deleteIcon} alt="" className="btn-icon-svg" />
            <span>Remove route</span>
          </button>
        </div>
      </div>
    </div>
  )
}
