import { formatDate, formatTime, formatWindow } from '../../../utils/orderFormat'

export default function DeliverySlaCard({ order, plan, trip, delivery }) {
  const deliveryDate = trip?.delivery_date || order.target_delivery_date
  const windowClose = String(order.requested_window_close).slice(0, 5)
  const plannedLate = plan && String(plan.planned_arrival_time).slice(0, 5) > windowClose
  const plannedEarly = plan && String(plan.planned_arrival_time).slice(0, 5) < String(order.requested_window_open).slice(0, 5)
  const compliance = delivery
    ? delivery.is_late ? { cls: 'delayed', text: `Late by ${delivery.lateness_minutes} min` } : { cls: 'on-time', text: 'On time' }
    : plan
      ? plannedLate ? { cls: 'delayed', text: 'Planned after window' } : plannedEarly ? { cls: 'on-time', text: 'Arrives early, unloads at window open' } : { cls: 'on-time', text: 'Planned within window' }
      : { cls: 'delayed', text: 'Not planned yet' }

  return (
    <div className="td-sla-card">
      <div className="td-sla-header">
        <h4 className="td-sla-title">DELIVERY WINDOW</h4>
      </div>

      <div className="td-sla-list">
        <div className="td-sla-row">
          <span className="td-sla-label">Delivery date:</span>
          <span className="td-sla-val">
            {formatDate(deliveryDate)}
            {deliveryDate !== order.target_delivery_date && ` (requested ${formatDate(order.target_delivery_date)})`}
          </span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">Your window:</span>
          <span className="td-sla-val">{formatWindow(order.requested_window_open, order.requested_window_close)}</span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">{delivery ? 'Arrived:' : 'Planned arrival:'}</span>
          <span className={`td-sla-val bold ${compliance.cls === 'delayed' ? 'red' : 'blue'}`}>
            {delivery ? formatTime(delivery.actual_arrival_time) : plan ? formatTime(plan.planned_arrival_time) : '—'}
          </span>
        </div>
        <div className="td-sla-row">
          <span className="td-sla-label">Status:</span>
          <span className={`td-sla-compliance-pill ${compliance.cls}`}>{compliance.text}</span>
        </div>
      </div>

      <div className="td-sla-notice-box">
        <p>Planned times come from the published delivery plan; arrival is recorded by the driver at your store.</p>
      </div>
    </div>
  )
}
