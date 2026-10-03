import { formatTime } from '../../../utils/orderFormat'

const LABEL = { delivered: 'DELIVERED', partial: 'PART DELIVERED', failed: 'NOT DELIVERED', scheduled: 'UPCOMING' }

// Other outlets on the trip are shown by position only — their names and goods stay private.
export default function RouteStopManifestCard({ stops, tripId, vehicleId, outletName }) {
  return (
    <div className="td-manifest-card">
      <div className="td-manifest-header">
        <div>
          <h3 className="td-manifest-title">Stops on this trip</h3>
          <p className="td-manifest-sub">
            {tripId} &bull; {vehicleId}
          </p>
        </div>
        <span className="td-manifest-auto-tag">Updated as the driver records each stop</span>
      </div>

      <div className="td-manifest-stops-list">
        {stops.map((s) => {
          const done = s.status !== 'scheduled'
          const n = String(s.stop_sequence).padStart(2, '0')
          return (
            <div key={s.stop_sequence} className={`td-stop-row ${s.is_this_order ? 'active-target' : done ? 'completed' : 'upcoming'}`}>
              <div className="td-stop-left-col">
                {done && !s.is_this_order ? (
                  <div className="td-stop-check-circle">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="td-stop-number-circle">{n}</div>
                )}
                <div className="td-stop-details">
                  <div className="td-stop-title-line">
                    <span className={`td-stop-name ${s.is_this_order ? 'bold-blue' : done ? '' : 'gray'}`}>
                      Stop {n}: {s.is_this_order ? `${outletName} (your store)` : 'Another outlet'}
                    </span>
                    <span className={`td-stop-badge ${s.is_this_order ? 'active-target-pill' : done ? 'dock-signed' : 'upcoming-badge'}`}>
                      {LABEL[s.status] || s.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="td-stop-right-col">
                <span className={`td-stop-time ${done ? '' : 'gray'}`}>
                  {s.actual_arrival_time ? formatTime(s.actual_arrival_time) : `Plan ${formatTime(s.planned_arrival_time)}`}
                </span>
                <span className={`td-stop-sla-tag ${done ? '' : 'gray'}`}>{s.actual_arrival_time ? 'Arrived' : 'Planned'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
