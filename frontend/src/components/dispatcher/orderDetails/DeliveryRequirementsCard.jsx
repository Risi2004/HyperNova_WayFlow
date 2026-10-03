import { formatWindow } from '../../../utils/orderFormat'

export default function DeliveryRequirementsCard({ order }) {
  const chilled = order.temp_requirement === 'chilled'
  const vanOnly = order.parking_constraint === 'van_only'
  const urgent = order.priority === 'urgent'
  const box = (on) => (on ? 'box-green' : 'box-neutral')
  const icon = (on) => (on ? 'icon-green' : 'icon-neutral')

  return (
    <div className="order-details-card requirements-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Delivery Requirements</h2>
        <span className="details-card-subtitle">Vehicle and handling constraints for planning</span>
      </div>

      {/* 2x2 grid */}
      <div className="requirements-quad-grid">
        {/* Refrigerated */}
        <div className={`req-quad-box ${box(chilled)}`}>
          <div className="req-quad-left">
            <div className={`req-icon-wrap ${icon(chilled)}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="12" y1="8" x2="16" y2="6" />
                <line x1="12" y1="8" x2="8" y2="6" />
                <line x1="12" y1="16" x2="16" y2="18" />
                <line x1="12" y1="16" x2="8" y2="18" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="8" y1="12" x2="6" y2="8" />
                <line x1="8" y1="12" x2="6" y2="16" />
                <line x1="16" y1="12" x2="18" y2="8" />
                <line x1="16" y1="12" x2="18" y2="16" />
              </svg>
            </div>
            <div className="req-text-wrap">
              <span className="req-name">Refrigerated</span>
              <span className={`req-badge ${chilled ? 'badge-required' : 'badge-optional'}`}>{chilled ? 'Required' : 'Not required'}</span>
            </div>
          </div>
        </div>

        {/* Van Only */}
        <div className={`req-quad-box ${box(vanOnly)}`}>
          <div className="req-quad-left">
            <div className={`req-icon-wrap ${icon(vanOnly)}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="req-text-wrap">
              <span className="req-name">Van Only</span>
              <span className={`req-badge ${vanOnly ? 'badge-required' : 'badge-optional'}`}>{vanOnly ? 'Required' : 'Not required'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Window */}
        <div className="req-quad-box box-green">
          <div className="req-quad-left">
            <div className="req-icon-wrap icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="req-text-wrap">
              <span className="req-name">Delivery Window</span>
              <span className="req-val-bold">{formatWindow(order.requested_window_open, order.requested_window_close)}</span>
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="req-quad-box box-amber">
          <div className="req-quad-left">
            <div className="req-icon-wrap icon-amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <div className="req-text-wrap">
              <span className="req-name">Priority</span>
              <span className={urgent ? 'req-val-amber' : 'req-val-bold'}>{urgent ? 'Urgent' : 'Normal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="requirements-advisory-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          {order.parking_constraint === 'mall_dock'
            ? `Mall outlet — arrival must fit the mall access window${order.mall_window ? ` (${order.mall_window})` : ''}.`
            : 'Vehicle selection must satisfy all order requirements.'}
        </span>
      </div>
    </div>
  )
}
