import { useState } from 'react'
import fuelIcon from '../../../assets/icons/fuel.svg'
import depotIcon from '../../../assets/icons/depot.svg'
import refrigeratedIcon from '../../../assets/icons/refrigerated.svg'
import deleteIcon from '../../../assets/icons/delete.svg'
import { formatDate, formatTime } from '../../../utils/orderFormat'

const vehicleLabel = (v) => `${v.vehicle_id} - ${v.temp === 'reefer' ? 'Refrigerated' : 'Dry'} ${v.type === 'van' ? 'Van' : 'Truck'}`
const hm = (min) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`
const pct = (value, cap) => (cap ? Math.min(100, Math.round((value / cap) * 100)) : 0)

const CHECKS = [
  ['weight', 'Weight capacity OK', 'Weight capacity exceeded'],
  ['windows', 'Delivery windows & time budget OK', 'Delivery window or time budget broken'],
  ['volume', 'Volume capacity OK', 'Volume capacity exceeded'],
  ['depot', 'Depot, grouping & availability OK', 'Depot, grouping or availability issue'],
  ['temperature', 'Refrigeration requirement OK', 'Chilled goods on a dry vehicle'],
  ['fuel', 'Fuel availability OK', 'Weekly fuel quota exceeded'],
  ['access', 'Outlet access OK', 'Van-only outlet on a truck'],
]

// Stop markers spread along a gentle curve for the route sketch.
function FlowDiagram({ stops, depot }) {
  const pts = stops.map((_, i) => {
    const x = stops.length === 1 ? 330 : 150 + (i * 410) / (stops.length - 1)
    return [Math.round(x), [50, 78, 66, 42, 70, 56][i % 6]]
  })
  const d = ['M60 95', ...pts.map(([x, y]) => `L${x} ${y}`)].join(' ')
  return (
    <div className="route-flow-diagram-container">
      <svg className="route-flow-svg" viewBox="0 0 600 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 70 Q140 20 250 50 Q360 80 470 40 Q550 20 580 80 L580 120 L40 120 Z" fill="#f0fdf4" opacity="0.6" />
        <path d="M300 80 Q400 40 500 70 Q580 100 600 80 L600 120 L300 120 Z" fill="#eff6ff" opacity="0.5" />
        <path d={d} stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <g transform="translate(60, 95)">
          <circle r="12" fill="#1e293b" />
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#ffffff" />
          <rect x="-4" y="-4" width="8" height="8" rx="1" fill="#1e293b" />
        </g>
        {pts.map(([x, y], i) => (
          <g key={i} transform={`translate(${x}, ${y})`}>
            <circle r="11" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <div className="flow-diagram-caption">
        <span className="depot-key-legend">■ {depot} Depot</span>
        <span className="caption-text">Numbered markers show stop order (tightest delivery window first)</span>
      </div>
    </div>
  )
}

export default function TodaysPlanColumn({
  date,
  routes = [],
  idleVehicles = [],
  vehicle,
  tripKey,
  trip,
  focusedOrder,
  dropCheck,
  isPublished,
  isBusy,
  constraintErrors = 0,
  onSelectVehicle,
  onSelectTrip,
  onAddFocused,
  onDropOrder,
  onRemoveStop,
  onMoveStop,
}) {
  const [dragOver, setDragOver] = useState(false)
  const checks = vehicle?.validation.checks || {}
  const passed = CHECKS.filter(([key]) => checks[key] !== false).length
  const canAddTrip = vehicle && vehicle.trips.length < 2 && !isPublished

  return (
    <div className="todays-plan-column">
      {/* Top Header */}
      <div className="plan-column-top-header">
        <div className="plan-title-group">
          <h2 className="column-title">Delivery Plan • {formatDate(date)}</h2>
          <p className="column-subtitle">
            {routes.length} vehicle{routes.length === 1 ? '' : 's'} routed • {idleVehicles.length} more available
          </p>
        </div>
        {!isPublished && idleVehicles.length > 0 && (
          <label className="btn-add-route-top">
            <span>+</span>
            <select
              className="planner-inline-input"
              value=""
              onChange={(e) => e.target.value && onSelectVehicle(e.target.value)}
              aria-label="Add a route on an idle vehicle"
            >
              <option value="">Add route</option>
              {idleVehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {vehicleLabel(v)} • {v.depot}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Route rail */}
      <div className="route-rail">
        {routes.map((v) => (
          <button
            key={v.vehicle_id}
            type="button"
            className={`route-chip ${vehicle?.vehicle_id === v.vehicle_id ? 'active' : ''} ${v.validation.ok ? '' : 'has-error'}`}
            onClick={() => onSelectVehicle(v.vehicle_id)}
            title={v.trips.map((t) => `Trip ${t.trip_number}: ${t.brand} ${t.district}, ${t.stops.length} stops`).join('\n')}
          >
            <span className="route-chip-id">{v.vehicle_id}</span>
            <span className="route-chip-sub">
              {v.trips.map((t) => `${t.brand} ${t.district}`).join(' + ')}
            </span>
          </button>
        ))}
        {routes.length === 0 && <p className="planner-empty-note">No routes yet. Press Suggest Plan or add a route on an idle vehicle.</p>}
      </div>

      {constraintErrors > 0 && (
        <div className="unresolved-error-banner">
          <div className="error-banner-left">
            <span className="error-preview-badge">UNRESOLVED CONSTRAINT ERRORS</span>
            <span className="error-routes-count">
              {constraintErrors} route{constraintErrors === 1 ? '' : 's'} must be fixed before publishing
            </span>
          </div>
        </div>
      )}

      {vehicle && (
        <div className="planner-route-card">
          {/* Route Top Row */}
          <div className="route-card-top-bar">
            <div className="route-main-identity">
              <div className="route-title-wrap">
                <span className="route-bold-name">{vehicle.vehicle_id}</span>
                <span className="route-selected-pill">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  <span>SELECTED</span>
                </span>
              </div>
              <span className="route-vehicle-subtitle">
                {vehicleLabel(vehicle)} • {vehicle.weight_cap.toLocaleString()} kg / {vehicle.volume_cap} m³
              </span>
            </div>
          </div>

          {/* Route Quick Meta Strip */}
          <div className="route-meta-strip">
            <div className="meta-item-strip">
              <img src={depotIcon} alt="" className="meta-strip-icon" />
              <div>
                <span className="strip-label">DEPOT</span>
                <span className="strip-value">{vehicle.depot}</span>
              </div>
            </div>
            <div className="meta-item-strip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="meta-strip-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <div>
                <span className="strip-label">DRIVER</span>
                <span className="strip-value">{vehicle.driver_name || 'Depot driver'}</span>
              </div>
            </div>
            <div className="meta-item-strip">
              <img src={refrigeratedIcon} alt="" className="meta-strip-icon" />
              <div>
                <span className="strip-label">TEMPERATURE</span>
                <span className="strip-value">{vehicle.temp === 'reefer' ? 'Refrigerated' : 'Ambient only'}</span>
              </div>
            </div>
            <div className={`fuel-available-badge ${checks.fuel === false ? 'fuel-short' : ''}`}>
              <img src={fuelIcon} alt="" className="fuel-badge-icon" />
              <span>
                {checks.fuel === false ? 'FUEL SHORT' : `${Math.round(vehicle.fuel_remaining_l - vehicle.fuel_planned_l)} L LEFT THIS WEEK`}
              </span>
            </div>
          </div>

          {/* Trip Tabs */}
          <div className="trip-tabs-container">
            {vehicle.trips.map((t) => (
              <button
                key={t.trip_number}
                type="button"
                className={`trip-tab-btn ${String(tripKey) === String(t.trip_number) ? 'trip-active' : ''}`}
                onClick={() => onSelectTrip(String(t.trip_number))}
              >
                <div className="trip-tab-left">
                  <span className="trip-tab-title">
                    TRIP {t.trip_number} - {t.brand} {t.district}
                  </span>
                  <span className="trip-tab-sub">
                    {formatTime(t.departure)} → {formatTime(t.return_time)} • {t.stops.length} stop{t.stops.length === 1 ? '' : 's'}
                  </span>
                </div>
                <span className={`trip-util-badge ${t.utilization < 50 ? 'util-dim' : ''}`}>{t.utilization}%</span>
              </button>
            ))}
            {canAddTrip && (
              <button
                type="button"
                className={`trip-tab-btn ${tripKey === 'new' ? 'trip-active' : ''}`}
                onClick={() => onSelectTrip('new')}
              >
                <div className="trip-tab-left">
                  <span className="trip-tab-title">+ NEW TRIP</span>
                  <span className="trip-tab-sub">Trip {vehicle.trips.length + 1} of 2 on this vehicle</span>
                </div>
              </button>
            )}
          </div>

          {/* Capacity Gauges */}
          {trip && (
            <div className="trip-capacity-section">
              <div className="capacity-bar-row">
                <div className="cap-bar-label-group">
                  <span className="cap-type">Weight</span>
                  <span className="cap-numbers">
                    {Math.round(trip.weight).toLocaleString()} / {vehicle.weight_cap.toLocaleString()} kg • {pct(trip.weight, vehicle.weight_cap)}%
                  </span>
                </div>
                <div className="cap-track">
                  <div className="cap-fill-bar" style={{ width: `${pct(trip.weight, vehicle.weight_cap)}%` }}></div>
                </div>
              </div>
              <div className="capacity-bar-row">
                <div className="cap-bar-label-group">
                  <span className="cap-type">Volume</span>
                  <span className="cap-numbers">
                    {trip.volume} / {vehicle.volume_cap} m³ • {pct(trip.volume, vehicle.volume_cap)}%
                  </span>
                </div>
                <div className="cap-track">
                  <div className="cap-fill-bar" style={{ width: `${pct(trip.volume, vehicle.volume_cap)}%` }}></div>
                </div>
              </div>
              <div className="capacity-overall-row">
                <span className="overall-label">Utilization</span>
                <span className="overall-percent">{trip.utilization}%</span>
              </div>
            </div>
          )}

          {/* Drop zone: live validation of the focused order against this trip */}
          {!isPublished && (
            <div
              className={dropCheck && !dropCheck.ok ? 'invalid-dropzone-alert' : 'planner-dropzone-valid'}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                const id = e.dataTransfer.getData('text/plain')
                if (id) onDropOrder(id)
              }}
              style={dragOver ? { outline: '2px dashed #2563eb' } : undefined}
            >
              {!focusedOrder && (
                <div className="dropzone-text-group">
                  <span className="dropzone-status-text">Drop an order here</span>
                  <span className="dropzone-subtext">
                    Select or drag an order from Orders to Plan to check it against {tripKey === 'new' ? 'a new trip' : `Trip ${tripKey}`} on {vehicle.vehicle_id}.
                  </span>
                </div>
              )}
              {focusedOrder && !dropCheck && (
                <div className="dropzone-text-group">
                  <span className="dropzone-status-text">Checking {focusedOrder.order_id}…</span>
                </div>
              )}
              {focusedOrder && dropCheck?.ok && (
                <>
                  <div className="dropzone-text-group">
                    <div className="dropzone-status-row">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="dropzone-status-text">Valid - requirements satisfied</span>
                    </div>
                    <span className="dropzone-subtext">
                      Add {focusedOrder.order_id} to {tripKey === 'new' ? 'a new trip' : `Trip ${tripKey}`}
                    </span>
                  </div>
                  <button type="button" className="dropzone-badge-tag dropzone-add-btn" onClick={onAddFocused} disabled={isBusy}>
                    ADD HERE
                  </button>
                </>
              )}
              {focusedOrder && dropCheck && !dropCheck.ok && (
                <>
                  <div className="invalid-title-row">
                    <div className="invalid-status-group">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                      <span className="invalid-main-text">Cannot add {focusedOrder.order_id}</span>
                    </div>
                    <span className="invalid-tag-pill">INVALID DROP ZONE</span>
                  </div>
                  <p className="invalid-bold-reason">{dropCheck.failures?.[0]?.message}</p>
                  <p className="invalid-subtext">
                    Try another trip or vehicle (Find Alternative), or record a deferral reason for this order.
                  </p>
                </>
              )}
            </div>
          )}

          {trip && (
            <>
              {/* Stop Sequence */}
              <div className="stop-sequence-header">
                <span className="stop-sequence-title">STOP SEQUENCE</span>
                <span className="stop-sequence-hint">Ordered by delivery window • move or remove each stop</span>
              </div>
              <div className="stop-items-stack">
                {trip.stops.map((stop, i) => {
                  const other = vehicle.trips.find((t) => t.trip_number !== trip.trip_number)
                  const moveTo = other ? String(other.trip_number) : vehicle.trips.length < 2 ? 'new' : null
                  return (
                    <div key={stop.order_id} className="stop-sequence-card">
                      <div className="stop-card-left">
                        <span className="stop-number-badge">{String(i + 1).padStart(2, '0')}</span>
                        <div className="stop-identity">
                          <h4 className="stop-outlet-title">
                            {stop.outlet_id} • {stop.order_id}
                            {stop.temp === 'chilled' ? ' • Chilled' : ''}
                            {stop.deferrals > 0 ? ` • Deferred ${stop.deferrals}×` : ''}
                          </h4>
                          <span className={`stop-timing-text ${stop.late ? 'stop-late' : ''}`}>
                            Arrive {formatTime(stop.arrival)} • window {stop.window} • {Math.round(stop.weight)} kg / {stop.volume} m³
                          </span>
                        </div>
                      </div>
                      {!isPublished && (
                        <div className="stop-card-actions">
                          {moveTo && (
                            <button
                              type="button"
                              className="btn-stop-action"
                              title={moveTo === 'new' ? 'Move to a new trip' : `Move to Trip ${moveTo}`}
                              onClick={() => onMoveStop(stop.order_id, moveTo)}
                              disabled={isBusy}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="7 10 12 15 17 10" />
                                <polyline points="17 14 12 9 7 14" />
                              </svg>
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-stop-action action-delete"
                            title="Remove stop (back to Orders to Plan)"
                            onClick={() => onRemoveStop(stop.order_id)}
                            disabled={isBusy}
                          >
                            <img src={deleteIcon} alt="Remove" className="icon-trash-svg" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <FlowDiagram stops={trip.stops} depot={vehicle.depot} />

              {/* Trip Timing Metric Row */}
              <div className="trip-metrics-row">
                <div className="metric-box">
                  <span className="metric-tag">DEPARTURE</span>
                  <span className="metric-stat">{formatTime(trip.departure)}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-tag">FINAL ARRIVAL</span>
                  <span className="metric-stat">{formatTime(trip.stops[trip.stops.length - 1].arrival)}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-tag">DISTANCE</span>
                  <span className="metric-stat">{trip.distance_km} km</span>
                </div>
                <div className="metric-box">
                  <span className="metric-tag">TRIP TIME</span>
                  <span className="metric-stat">{hm(trip.budget_minutes)}</span>
                </div>
              </div>
            </>
          )}

          {/* Route Validation Checklist */}
          <div className="route-validation-card">
            <div className="validation-top-row">
              <span className="validation-title">ROUTE VALIDATION</span>
              <span className={passed === CHECKS.length ? 'validation-badge-passed' : 'validation-badge-failed'}>
                <span>
                  {passed} / {CHECKS.length} PASSED
                </span>
              </span>
            </div>
            <div className="validation-grid">
              {CHECKS.map(([key, okText, failText]) => {
                const ok = checks[key] !== false
                return (
                  <div key={key} className={`validation-item ${ok ? '' : 'validation-failed'}`}>
                    <span className="check-bullet">{ok ? '✔' : '✖'}</span>
                    <span className="val-text">{ok ? okText : failText}</span>
                    <span className="val-pill">{ok ? 'PASSED' : 'FAILED'}</span>
                  </div>
                )
              })}
            </div>
            {!vehicle.validation.ok &&
              vehicle.validation.failures.slice(0, 3).map((f, i) => (
                <p key={i} className="validation-failure-text">
                  {f.message}
                </p>
              ))}
          </div>

          {/* Maximum Daily Trips */}
          {vehicle.trips.length >= 2 && (
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
          )}
        </div>
      )}
    </div>
  )
}
