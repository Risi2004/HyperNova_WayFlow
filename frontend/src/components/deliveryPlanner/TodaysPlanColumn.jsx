import { useState } from 'react'
import fuelIcon from '../../assets/icons/fuel.svg'
import depotIcon from '../../assets/icons/depot.svg'
import refrigeratedIcon from '../../assets/icons/refrigerated.svg'
import moreIcon from '../../assets/icons/more.svg'
import deleteIcon from '../../assets/icons/delete.svg'

export default function TodaysPlanColumn() {
  const [activeTrip, setActiveTrip] = useState(1)

  const stops = [
    {
      num: '01',
      outlet: 'Waypoint Fresh – Colombo 03',
      window: '10:00 AM – 12:00 PM',
    },
    {
      num: '02',
      outlet: 'Waypoint Fresh – Colombo 05',
      window: '10:30 AM – 12:30 PM',
    },
    {
      num: '03',
      outlet: 'Waypoint Fresh – Colombo 07',
      window: '11:00 AM – 1:00 PM',
    },
    {
      num: '04',
      outlet: 'Waypoint Style – Colombo 08',
      window: '1:30 PM – 3:00 PM',
    },
  ]

  return (
    <div className="todays-plan-column">
      {/* Top Header */}
      <div className="plan-column-top-header">
        <div className="plan-title-group">
          <h2 className="column-title">Today's Delivery Plan</h2>
          <p className="column-subtitle">12 routes • 18 vehicles available</p>
        </div>
        <button type="button" className="btn-add-route-top">
          <span>+</span>
          <span>Add route</span>
        </button>
      </div>

      {/* Main Route 01 Card */}
      <div className="planner-route-card">
        {/* Route Top Row */}
        <div className="route-card-top-bar">
          <div className="route-main-identity">
            <div className="route-title-wrap">
              <span className="route-bold-name">Route 01</span>
              <span className="route-selected-pill">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>SELECTED</span>
              </span>
            </div>
            <span className="route-vehicle-subtitle">
              WP-CA-2847 - Refrigerated Truck
            </span>
          </div>

          <button type="button" className="btn-route-more-action">
            <img src={moreIcon} alt="" className="icon-more-svg" />
            <span>More</span>
          </button>
        </div>

        {/* Route Quick Meta Strip */}
        <div className="route-meta-strip">
          <div className="meta-item-strip">
            <img src={depotIcon} alt="" className="meta-strip-icon" />
            <div>
              <span className="strip-label">DEPOT</span>
              <span className="strip-value">Peliyagoda</span>
            </div>
          </div>

          <div className="meta-item-strip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="meta-strip-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <div>
              <span className="strip-label">DRIVER</span>
              <span className="strip-value">Assigned Driver</span>
            </div>
          </div>

          <div className="meta-item-strip">
            <img src={refrigeratedIcon} alt="" className="meta-strip-icon" />
            <div>
              <span className="strip-label">TEMPERATURE</span>
              <span className="strip-value">Refrigerated</span>
            </div>
          </div>

          <div className="fuel-available-badge">
            <img src={fuelIcon} alt="" className="fuel-badge-icon" />
            <span>FUEL AVAILABLE</span>
          </div>
        </div>

        {/* Trip Tabs */}
        <div className="trip-tabs-container">
          <button
            type="button"
            className={`trip-tab-btn ${activeTrip === 1 ? 'trip-active' : ''}`}
            onClick={() => setActiveTrip(1)}
          >
            <div className="trip-tab-left">
              <span className="trip-tab-title">TRIP 1 - Morning Route</span>
              <span className="trip-tab-sub">06:30 AM → 02:45 PM • 4 stops</span>
            </div>
            <span className="trip-util-badge">78%</span>
          </button>

          <button
            type="button"
            className={`trip-tab-btn ${activeTrip === 2 ? 'trip-active' : ''}`}
            onClick={() => setActiveTrip(2)}
          >
            <div className="trip-tab-left">
              <span className="trip-tab-title">TRIP 2 - Afternoon Route</span>
              <span className="trip-tab-sub">03:30 PM → 07:00 PM • 2 stops</span>
            </div>
            <span className="trip-util-badge util-dim">42%</span>
          </button>
        </div>

        {/* Capacity Gauges */}
        <div className="trip-capacity-section">
          <div className="capacity-bar-row">
            <div className="cap-bar-label-group">
              <span className="cap-type">Weight</span>
              <span className="cap-numbers">1,850 / 2,500 kg • 74%</span>
            </div>
            <div className="cap-track">
              <div className="cap-fill-bar" style={{ width: '74%' }}></div>
            </div>
          </div>

          <div className="capacity-bar-row">
            <div className="cap-bar-label-group">
              <span className="cap-type">Volume</span>
              <span className="cap-numbers">18.2 / 22 m³ • 83%</span>
            </div>
            <div className="cap-track">
              <div className="cap-fill-bar" style={{ width: '83%' }}></div>
            </div>
          </div>

          <div className="capacity-overall-row">
            <span className="overall-label">Utilization</span>
            <span className="overall-percent">74%</span>
          </div>
        </div>

        {/* Valid Drop Zone Banner */}
        <div className="planner-dropzone-valid">
          <div className="dropzone-text-group">
            <div className="dropzone-status-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="dropzone-status-text">Valid - requirements satisfied</span>
            </div>
            <span className="dropzone-subtext">Release ORD-2026-1048 to add it to Trip 1</span>
          </div>
          <span className="dropzone-badge-tag">DROP HERE</span>
        </div>

        {/* Stop Sequence Header */}
        <div className="stop-sequence-header">
          <span className="stop-sequence-title">STOP SEQUENCE</span>
          <span className="stop-sequence-hint">Drag to reorder • move or remove each stop</span>
        </div>

        {/* Stops List */}
        <div className="stop-items-stack">
          {stops.map((stop) => (
            <div key={stop.num} className="stop-sequence-card">
              <div className="stop-card-left">
                <span className="stop-number-badge">{stop.num}</span>
                <div className="stop-identity">
                  <h4 className="stop-outlet-title">{stop.outlet}</h4>
                  <span className="stop-timing-text">{stop.window}</span>
                </div>
              </div>

              <div className="stop-card-actions">
                <button type="button" className="btn-stop-action" title="Reorder stop">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="7 10 12 15 17 10" />
                    <polyline points="17 14 12 9 7 14" />
                  </svg>
                </button>
                <button type="button" className="btn-stop-action action-delete" title="Remove stop">
                  <img src={deleteIcon} alt="Delete" className="icon-trash-svg" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Route Flow Curve Diagram */}
        <div className="route-flow-diagram-container">
          <svg className="route-flow-svg" viewBox="0 0 600 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background territory shaded clouds */}
            <path d="M40 70 Q140 20 250 50 Q360 80 470 40 Q550 20 580 80 L580 120 L40 120 Z" fill="#f0fdf4" opacity="0.6" />
            <path d="M300 80 Q400 40 500 70 Q580 100 600 80 L600 120 L300 120 Z" fill="#eff6ff" opacity="0.5" />

            {/* Bezier Route Spline */}
            <path
              d="M60 95 C140 10, 200 40, 280 75 C360 110, 420 50, 500 40"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Origin Depot Node */}
            <g transform="translate(60, 95)">
              <circle r="12" fill="#1e293b" />
              <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#ffffff" />
              <rect x="-4" y="-4" width="8" height="8" rx="1" fill="#1e293b" />
            </g>

            {/* Stop 1 Node */}
            <g transform="translate(180, 50)">
              <circle r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">1</text>
            </g>

            {/* Stop 2 Node */}
            <g transform="translate(290, 78)">
              <circle r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">2</text>
            </g>

            {/* Stop 3 Node */}
            <g transform="translate(395, 72)">
              <circle r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">3</text>
            </g>

            {/* Stop 4 Node */}
            <g transform="translate(485, 42)">
              <circle r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">4</text>
            </g>
          </svg>

          <div className="flow-diagram-caption">
            <span className="depot-key-legend">■ Peliyagoda Depot</span>
            <span className="caption-text">Numbered markers show grouping and stop order</span>
          </div>
        </div>

        {/* Trip Timing Metric Row */}
        <div className="trip-metrics-row">
          <div className="metric-box">
            <span className="metric-tag">DEPARTURE</span>
            <span className="metric-stat">6:30 AM</span>
          </div>
          <div className="metric-box">
            <span className="metric-tag">FINAL ARRIVAL</span>
            <span className="metric-stat">2:45 PM</span>
          </div>
          <div className="metric-box">
            <span className="metric-tag">DISTANCE</span>
            <span className="metric-stat">68 km</span>
          </div>
          <div className="metric-box">
            <span className="metric-tag">DURATION</span>
            <span className="metric-stat">8h 15m</span>
          </div>
        </div>

        {/* Route Validation Checklist */}
        <div className="route-validation-card">
          <div className="validation-top-row">
            <span className="validation-title">ROUTE VALIDATION</span>
            <span className="validation-badge-passed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>7 / 7 PASSED</span>
            </span>
          </div>

          <div className="validation-grid">
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Weight capacity OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Delivery windows OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Volume capacity OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Depot assignment OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Refrigeration requirement OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Fuel availability OK</span>
              <span className="val-pill">PASSED</span>
            </div>
            <div className="validation-item">
              <span className="check-bullet">✔</span>
              <span className="val-text">Outlet access OK</span>
              <span className="val-pill">PASSED</span>
            </div>
          </div>
        </div>

        {/* Invalid Drop Zone Demo Alert (Weight Capacity Exceeded) */}
        <div className="invalid-dropzone-alert">
          <div className="invalid-title-row">
            <div className="invalid-status-group">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span className="invalid-main-text">Cannot add order</span>
            </div>
            <span className="invalid-tag-pill">INVALID DROP ZONE</span>
          </div>
          <p className="invalid-bold-reason">
            Weight capacity would exceed vehicle limit by 240 kg.
          </p>
          <p className="invalid-subtext">
            Move the order to a vehicle with at least 240 kg remaining, place it on a later run, or defer with a reason.
          </p>
        </div>

        {/* Maximum Daily Trips Alert */}
        <div className="trips-limit-row">
          <div className="trips-limit-left">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            <span>Maximum daily trips reached</span>
          </div>
          <span className="trips-fraction">2 / 2 TRIPS</span>
        </div>

        {/* Unresolved Error State Preview Banner */}
        <div className="unresolved-error-banner">
          <div className="error-banner-left">
            <span className="error-preview-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              UNRESOLVED-ERROR STATE PREVIEW
            </span>
            <span className="error-routes-count">3 routes require attention</span>
          </div>
          <button type="button" className="btn-review-example">
            <span>Review example</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
