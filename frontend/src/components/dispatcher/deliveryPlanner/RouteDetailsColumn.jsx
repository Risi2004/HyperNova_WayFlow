import deleteIcon from '../../../assets/icons/delete.svg'
import { formatTime } from '../../../utils/orderFormat'

const pct = (value, cap) => (cap ? Math.min(100, Math.round((value / cap) * 100)) : 0)
const hm = (min) => `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`

function Meter({ name, value, cap, unit }) {
  const p = pct(value, cap)
  return (
    <div className="load-meter-group">
      <div className="load-meter-header">
        <span className="meter-name">{name}</span>
        <span className="meter-val">
          {value.toLocaleString()} / {cap.toLocaleString()} {unit} • {p}%
        </span>
      </div>
      <div className="meter-track">
        <div className="meter-fill" style={{ width: `${p}%` }}></div>
      </div>
      <div className="meter-sub-rem">
        <span>Remaining {name.toLowerCase()}</span>
        <span className="bold-rem">
          {Math.max(0, Math.round((cap - value) * 100) / 100).toLocaleString()} {unit}
        </span>
      </div>
    </div>
  )
}

export default function RouteDetailsColumn({ vehicle, trip, isPublished, isBusy, onRemoveRoute }) {
  if (!vehicle) {
    return (
      <div className="route-details-column">
        <div className="route-details-top-header">
          <div className="details-header-text">
            <h2 className="column-title">Route Details</h2>
            <p className="column-subtitle">Select a route to see its load, checks and timings</p>
          </div>
        </div>
      </div>
    )
  }

  const checks = vehicle.validation.checks
  const stops = trip?.stops || []
  const chilled = vehicle.trips.some((t) => t.stops.some((s) => s.temp === 'chilled'))
  const vanOnly = vehicle.trips.reduce((n, t) => n + t.stops.filter((s) => s.parking === 'van_only').length, 0)
  const requirements = [
    [checks.temperature, `Refrigeration - ${vehicle.temp === 'reefer' ? 'Supported' : chilled ? 'Missing' : 'Not needed'}`],
    [checks.access, `Van-only stops - ${vanOnly ? `${vanOnly} on a ${vehicle.type}` : 'None'}`],
    [checks.depot, `Depot - ${vehicle.depot}${vehicle.available ? '' : ' (vehicle unavailable)'}`],
    [checks.fuel, `Fuel - ${vehicle.fuel_planned_l} of ${vehicle.fuel_remaining_l} L left this week`],
    [checks.windows, `Time budget - Fresh ${vehicle.fresh_minutes}/270 min, Style+Tech ${vehicle.day_minutes}/480 min`],
  ]

  return (
    <div className="route-details-column">
      {/* Header */}
      <div className="route-details-top-header">
        <div className="details-header-text">
          <h2 className="column-title">Route Details</h2>
          <p className="column-subtitle">
            {vehicle.vehicle_id}
            {trip ? ` • Trip ${trip.trip_number} • ${trip.status === 'draft' ? 'draft' : trip.status}` : ' • no trip selected'}
          </p>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="route-details-card">
        {/* Vehicle Identity Header */}
        <div className="vehicle-info-header">
          <div className="vehicle-title-strip">
            <h3 className="vehicle-reg-number">{vehicle.vehicle_id}</h3>
            <span className="trip-fraction-badge">
              {vehicle.trips.length} / 2 TRIPS
            </span>
          </div>
          <span className="vehicle-type-label">
            {vehicle.temp === 'reefer' ? 'Refrigerated' : 'Dry'} {vehicle.type === 'van' ? 'Van' : 'Truck'}
          </span>
          <div className="vehicle-meta-two-col">
            <div className="meta-pair">
              <span className="meta-pair-label">Depot</span>
              <span className="meta-pair-val">{vehicle.depot}</span>
            </div>
            <div className="meta-pair">
              <span className="meta-pair-label">Driver</span>
              <span className="meta-pair-val">{vehicle.driver_name || 'Depot driver'}</span>
            </div>
          </div>
        </div>

        {/* Load Section */}
        {trip && (
          <div className="details-section-block">
            <div className="section-title-between">
              <span className="section-heading">LOAD • TRIP {trip.trip_number}</span>
              <span className="badge-utilized-green">{trip.utilization}% UTILIZED</span>
            </div>
            <Meter name="Weight" value={Math.round(trip.weight)} cap={vehicle.weight_cap} unit="kg" />
            <Meter name="Volume" value={trip.volume} cap={vehicle.volume_cap} unit="m³" />
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="details-section-block">
          <span className="section-heading">REQUIREMENTS</span>
          <div className="req-check-list">
            {requirements.map(([ok, text]) => (
              <div key={text} className="req-check-row">
                <div className="req-item-left">
                  <span className="req-check-icon">{ok === false ? '✖' : '✔'}</span>
                  <span className="req-item-title">{text}</span>
                </div>
                <span className={`req-status-pill ${ok === false ? 'req-failed' : ''}`}>{ok === false ? 'FAILED' : 'PASSED'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Totals */}
        {trip && (
          <div className="details-section-block">
            <span className="section-heading">ROUTE TOTALS</span>
            <div className="totals-key-values">
              <div className="totals-row">
                <span className="total-key">Stop count</span>
                <span className="total-val">{stops.length} stops • {trip.brand} {trip.district}</span>
              </div>
              <div className="totals-row">
                <span className="total-key">Distance (round trip)</span>
                <span className="total-val">{trip.distance_km} km • {trip.fuel_l} L</span>
              </div>
              <div className="totals-row">
                <span className="total-key">Trip time (budget)</span>
                <span className="total-val">{hm(trip.budget_minutes)}</span>
              </div>
              <div className="totals-row">
                <span className="total-key">Departure</span>
                <span className="total-val">{formatTime(trip.departure)}</span>
              </div>
              <div className="totals-row">
                <span className="total-key">Back at depot</span>
                <span className="total-val">{formatTime(trip.return_time)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Policy Notice Box */}
        <div className="route-policy-note">
          <p className="policy-text">
            Every assignment is checked against vehicle limits, temperature, outlet restrictions, delivery window, depot, trip budget
            and fuel. Loaders load in reverse stop order, so the first stop comes off first.
          </p>
        </div>

        {/* Actions */}
        {!isPublished && vehicle.trips.length > 0 && (
          <div className="route-bottom-actions">
            <button type="button" className="btn-remove-route-danger" onClick={() => onRemoveRoute(vehicle.vehicle_id)} disabled={isBusy}>
              <img src={deleteIcon} alt="" className="btn-icon-svg" />
              <span>Remove route</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
