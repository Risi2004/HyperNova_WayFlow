import delayIcon from '../../assets/icons/delay.svg'
import attentionIcon from '../../assets/icons/attention.svg'

export default function DeliveryWindowCard({
  date = '26 September 2026',
  window = '10:00 AM – 12:00 PM',
  countdown = '1h 25m until delivery window',
  status = 'At Risk',
}) {
  return (
    <div className="order-details-card window-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Delivery Window</h2>
        <span className="details-card-subtitle">Requested service timing</span>
      </div>

      <div className="window-details-list">
        <div className="window-detail-row">
          <span className="window-detail-label">Date</span>
          <span className="window-detail-val">{date}</span>
        </div>
        <div className="window-detail-row">
          <span className="window-detail-label">Requested time</span>
          <span className="window-detail-val font-bold">{window}</span>
        </div>
      </div>

      {/* Amber Countdown Box */}
      <div className="window-countdown-box">
        <img src={delayIcon} alt="" className="countdown-icon" aria-hidden="true" />
        <span className="countdown-text">{countdown}</span>
      </div>

      {/* Window Status Row */}
      <div className="window-status-row">
        <span className="window-status-label">Window Status</span>
        <span className="window-status-badge badge-at-risk">
          <img src={attentionIcon} alt="" className="status-badge-icon" aria-hidden="true" />
          <span>{status}</span>
        </span>
      </div>

      <span className="window-footnote">
        This order has not yet been assigned to a delivery plan.
      </span>
    </div>
  )
}
