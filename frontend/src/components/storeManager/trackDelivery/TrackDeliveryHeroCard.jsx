import { formatKg, formatShortDate, formatTime, formatWindow } from '../../../utils/orderFormat'
import { vehicleTypeLabel } from '../../../utils/tripFormat'

const DONE = ['delivered', 'partial', 'failed']

// ETA and trip position come from the published plan and the driver's stop records (no GPS feed).
export default function TrackDeliveryHeroCard({ order, plan, trip, progress, mine, delivery, outletName }) {
  const done = progress.filter((s) => DONE.includes(s.status)).length
  const total = progress.length
  const ahead = progress.filter((s) => s.stop_sequence < (mine?.stop_sequence || 0) && !DONE.includes(s.status)).length
  const arrived = Boolean(delivery) || DONE.includes(mine?.status)
  const onRoad = ['dispatched', 'in_progress'].includes(trip?.status)
  const windowClose = String(order.requested_window_close).slice(0, 5)
  const plannedAt = String(plan.planned_arrival_time).slice(0, 5)
  const lateRisk = !arrived && plannedAt > windowClose
  const early = !arrived && plannedAt < String(order.requested_window_open).slice(0, 5)

  const headline = arrived ? formatTime(delivery?.actual_arrival_time || mine?.actual_arrival_time) : formatTime(plan.planned_arrival_time)
  const label = arrived ? 'ARRIVED AT YOUR STORE' : 'PLANNED ARRIVAL'
  const banner = arrived
    ? delivery?.is_late
      ? `Arrived ${delivery.lateness_minutes} min after the window closed`
      : 'Arrived — count the goods and confirm receipt'
    : lateRisk
      ? `Planned after your window closes (${formatWindow(order.requested_window_open, order.requested_window_close)})`
      : early
        ? `Arrives early — unloading starts when your window opens at ${formatTime(order.requested_window_open)}`
        : `Within your window (${formatWindow(order.requested_window_open, order.requested_window_close)})`
  const where = arrived
    ? 'Delivered'
    : onRoad
      ? ahead === 0 ? 'Your store is the next stop' : `${ahead} stop${ahead === 1 ? '' : 's'} before yours`
      : trip?.status === 'completed' ? 'Trip completed' : `Departs ${formatTime(plan.planned_departure_time)} on ${formatShortDate(trip?.delivery_date || order.target_delivery_date)}`

  return (
    <div className="td-hero-card">
      <div className="td-hero-top-row">
        <div className="td-hero-eta-section">
          <div className="td-hero-eta-header">
            <span className="td-hero-eta-label">{label}</span>
            <span className={`td-gps-status-badge ${onRoad ? 'live' : 'offline'}`}>
              <span className={`gps-dot ${onRoad ? 'green' : 'gray'}`} />
              <span>{onRoad ? 'On the road' : arrived ? 'Delivered' : 'At depot'}</span>
            </span>
          </div>

          <div className={`td-hero-eta-big ${lateRisk || delivery?.is_late ? 'delayed' : ''}`}>{headline}</div>

          <div className={`td-hero-window-banner ${lateRisk || delivery?.is_late ? 'delayed' : arrived ? 'delivered' : 'on-time'}`}>
            <span>{banner}</span>
          </div>

          <div className="td-hero-trip-enroute">
            <span>Trip {plan.trip_id} &bull; {where}</span>
          </div>
        </div>

        <div className="td-hero-metrics-grid">
          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">YOUR STOP</span>
            </div>
            <div className="td-box-val-main">Stop {plan.stop_sequence} of {total}</div>
            <span className="td-box-sub-blue">{where}</span>
          </div>

          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">TEMPERATURE</span>
            </div>
            <div className="td-box-val-main">{order.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient'}</div>
            <span className="td-box-sub-gray">{plan.vehicle_temp === 'reefer' ? 'Refrigerated vehicle' : 'Dry vehicle'}</span>
          </div>

          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">PAYLOAD</span>
            </div>
            <div className="td-box-val-main">{order.total_units} units</div>
            <span className="td-box-sub-gray">{order.sku_count} lines &bull; {formatKg(order.total_weight_kg)}</span>
          </div>

          <div className="td-metric-box">
            <div className="td-metric-box-top">
              <span className="td-box-label">DRIVER</span>
            </div>
            <div className="td-box-val-main">{plan.driver_name || 'Not assigned'}</div>
            <span className="td-box-sub-gray">{plan.vehicle_id} ({vehicleTypeLabel(plan)})</span>
          </div>
        </div>
      </div>

      <div className="td-hero-progress-section">
        <div className="td-progress-label-row">
          <span className="td-progress-label">Trip progress &mdash; {order.depot} depot to {outletName}</span>
          <span className="td-progress-count">
            {done} of {total} stops ({total ? Math.round((done / total) * 100) : 0}%)
          </span>
        </div>
        <div className="td-progress-bar-bg">
          <div className="td-progress-bar-fill" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
        </div>
        <div className="td-progress-legend-row">
          <div className="td-legend-left">
            <div className="td-legend-item">
              <span className="legend-dot green" />
              <span>{done} recorded</span>
            </div>
            <div className="td-legend-item">
              <span className="legend-dot blue" />
              <span>Stop {plan.stop_sequence} is yours</span>
            </div>
            <div className="td-legend-item">
              <span className="legend-dot gray" />
              <span>{total - done} remaining</span>
            </div>
          </div>
          <span className="td-legend-ping">Refreshes every minute</span>
        </div>
      </div>
    </div>
  )
}
