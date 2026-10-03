import { Link } from 'react-router-dom'
import attentionIcon from '../../../assets/icons/attention.svg'
import { DEFERRAL_REASONS, dispatchStatusOf, formatDayLabel, formatShortDate, outletLabel } from '../../../utils/orderFormat'

// Why this order needs the dispatcher, and how serious it is.
function describe(order) {
  if (order.status === 'deferred') {
    const count = order.consecutive_deferral_count || 1
    return {
      reason: `${DEFERRAL_REASONS[order.deferral_reason] || 'Deferred'} — due ${formatShortDate(order.next_scheduled_date)}`,
      statusText: count > 1 ? `Deferred ${count}× — serve next run` : 'Deferred once',
      statusType: count > 1 ? 'red' : 'amber',
    }
  }
  if (['shortfall', 'failed', 'disputed'].includes(order.status)) {
    return { reason: dispatchStatusOf(order.status).label, statusText: 'Needs review', statusType: 'red' }
  }
  return {
    reason: `Urgent — delivery ${formatShortDate(order.target_delivery_date)}`,
    statusText: order.status === 'submitted' ? 'Awaiting cutoff' : 'Not yet planned',
    statusType: 'amber',
  }
}

const formatCutoff = (iso) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: 'Asia/Colombo', weekday: 'short', hour: '2-digit', minute: '2-digit' })

export default function OrdersAttentionSection({ attention = [], intake = [], isClosing = null, onCloseIntake }) {
  return (
    <div className="orders-bottom-grid">
      {/* Left Attention Card */}
      <div className="orders-card-panel attention-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Orders Requiring Attention</h3>
            <span className="panel-subtitle">Repeat deferrals, exceptions and urgent orders not yet planned</span>
          </div>
          <span className="attention-item-count">
            {attention.length} attention item{attention.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="attention-items-list">
          {attention.length === 0 && (
            <div className="attention-empty">Nothing needs attention for the current filters.</div>
          )}
          {attention.map((order) => {
            const item = describe(order)
            return (
              <div key={order.order_id} className="attention-row-item">
                <div className="attention-row-left">
                  <img
                    src={attentionIcon}
                    alt=""
                    className={`attention-row-icon icon-${item.statusType}`}
                    aria-hidden="true"
                  />
                  <div className="attention-order-meta">
                    <span className="attention-order-id">{order.order_id}</span>
                    <span className="attention-order-outlet">{outletLabel(order)}</span>
                  </div>
                </div>

                <div className="attention-reason-col">
                  <span>{item.reason}</span>
                </div>

                <div className="attention-action-col">
                  <Link
                    to={`/dispatcher/orders/${order.order_id}`}
                    className={`attention-status-link link-${item.statusType}`}
                  >
                    <span>{item.statusText}</span>
                    <span className="link-arrow">&rsaquo;</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Order intake — closing a date confirms its orders for planning */}
      <div className="orders-card-panel intake-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Order Intake</h3>
            <span className="panel-subtitle">Orders close at 4:00 PM the operating day before delivery</span>
          </div>
        </div>

        <div className="intake-list">
          {intake.map((d) => (
            <div key={d.date} className="intake-row">
              <div className="intake-date-col">
                <span className="intake-date">{formatDayLabel(d.date)}</span>
                <span className="intake-meta">
                  {d.open
                    ? `Open until ${formatCutoff(d.cutoff_at)} • ${d.submitted} awaiting cutoff`
                    : `Closed • ${d.confirmed} confirmed for planning`}
                </span>
              </div>
              {d.open ? (
                <button
                  type="button"
                  className="intake-close-btn"
                  disabled={isClosing === d.date}
                  onClick={() => onCloseIntake(d.date, d.submitted)}
                >
                  {isClosing === d.date ? 'Closing…' : 'Close intake'}
                </button>
              ) : (
                <span className="intake-closed-tag">{d.closed_by_dispatcher ? 'Closed early' : 'Cutoff passed'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
