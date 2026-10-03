import { useEffect, useRef, useState } from 'react'
import { tripService } from '../../../services/tripService'
import { formatTime, formatTimestamp } from '../../../utils/orderFormat'
import { vehicleTypeLabel } from '../../../utils/tripFormat'

const OUTCOME = { delivered: 'Delivered', partial: 'Part delivered', failed: 'Not delivered', scheduled: 'Upcoming' }

// Stop-by-stop view of one trip: what was planned, what the driver recorded, and how it got here.
export default function LiveTripPanel({ tripId, reloadKey, onClose }) {
  const [state, setState] = useState({ tripId: null, data: null, error: null })
  const panelRef = useRef(null)

  // Opened from the attention banner or the issues list: bring the panel into view.
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [tripId])

  useEffect(() => {
    let active = true
    tripService
      .getTrip(tripId)
      .then((data) => active && setState({ tripId, data, error: null }))
      .catch((err) => active && setState({ tripId, data: null, error: err.message }))
    return () => {
      active = false
    }
  }, [tripId, reloadKey])

  const { data, error } = state.tripId === tripId ? state : { data: null, error: null }
  const trip = data?.trip

  return (
    <section ref={panelRef} className="live-table-card live-trip-panel" aria-label={`Trip ${tripId}`}>
      <div className="live-table-top-header">
        <div className="table-header-left">
          <h2 className="live-table-title">{tripId}</h2>
          {trip && (
            <p className="live-table-subtitle">
              {trip.vehicle_id} ({vehicleTypeLabel(trip)}) · {trip.driver_name || 'no driver'}{trip.driver_phone ? ` (${trip.driver_phone})` : ''} · {trip.depot} → {trip.district} · Waypoint {trip.brand}
              {trip.dispatched_at ? ` · departed ${formatTimestamp(trip.dispatched_at).time}` : ` · departs ${formatTime(trip.planned_departure_time)}`}
            </p>
          )}
        </div>
        <button type="button" className="btn-clear-live-filters" onClick={onClose}>
          Close
        </button>
      </div>

      {error && <p className="live-page-state error">{error}</p>}
      {!data && !error && <p className="live-page-state">Loading trip…</p>}

      {data && (
        <div className="table-responsive-container">
          <table className="live-deliveries-grid-table">
            <thead>
              <tr>
                <th>#</th>
                <th>OUTLET</th>
                <th>ORDER</th>
                <th>WINDOW</th>
                <th>PLANNED</th>
                <th>ARRIVED</th>
                <th>OUTCOME</th>
                <th>NOTES</th>
              </tr>
            </thead>
            <tbody>
              {data.stops.map((s) => (
                <tr key={s.order_id}>
                  <td className="bold">{s.stop_sequence}</td>
                  <td>
                    <span className="bold">{s.outlet_id}</span>
                    <div className="status-reason-subtext">{s.district}{s.parking_constraint === 'van_only' ? ' · van only' : ''}</div>
                  </td>
                  <td>
                    {s.order_id}
                    <div className="status-reason-subtext">{s.total_units} units · {s.temp_requirement}</div>
                  </td>
                  <td>{formatTime(s.requested_window_open)} – {formatTime(s.requested_window_close)}</td>
                  <td>{formatTime(s.planned_arrival_time)}</td>
                  <td>
                    {s.actual_arrival_time ? formatTime(s.actual_arrival_time) : '—'}
                    {s.is_late && <div className="status-reason-subtext live-text-red">{s.lateness_minutes} min late</div>}
                  </td>
                  <td>
                    <span className={`status-pill-badge pill-${s.stop_status === 'delivered' ? 'completed' : s.stop_status === 'scheduled' ? 'pending' : 'problem'}`}>
                      <span className="dot"></span>
                      {(OUTCOME[s.stop_status] || s.stop_status).toUpperCase()}
                    </span>
                    {s.recorded_offline && <div className="status-reason-subtext">Recorded offline, synced {formatTimestamp(s.synced_at).time}</div>}
                  </td>
                  <td className="status-reason-subtext">
                    {[
                      s.shortfall_flag && `Loaded short${s.shortfall_units ? ` ${s.shortfall_units}` : ''}${s.shortfall_item ? ` (${s.shortfall_item})` : ''}`,
                      s.received_by_name && `Received by ${s.received_by_name}`,
                      s.has_photo && 'POD photo',
                      s.driver_notes,
                    ].filter(Boolean).join(' · ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
