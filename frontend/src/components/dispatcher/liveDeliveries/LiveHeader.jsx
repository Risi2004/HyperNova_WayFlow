import { formatDate } from '../../../utils/orderFormat'

export default function LiveHeader({ date, dates, onDateChange, updatedAt, onRefresh, connected }) {
  const options = dates.includes(date) || !date ? dates : [...dates, date].sort()

  return (
    <div className="live-header-container">
      <div className="live-title-group">
        <h1 className="live-page-title">Live Deliveries</h1>
        <p className="live-page-subtitle">Published trips, their progress and anything that needs dispatch attention.</p>
      </div>

      <div className="live-header-actions">
        <div className="live-connection-badge">
          <span className="live-pulse-dot"></span>
          <span>{connected ? 'Auto-refresh every 30s' : 'Cannot reach the server'}</span>
        </div>

        <select className="live-date-picker-btn" value={date || ''} onChange={(e) => onDateChange(e.target.value)} aria-label="Delivery date">
          {options.map((d) => (
            <option key={d} value={d}>
              {formatDate(d)}
            </option>
          ))}
        </select>

        {updatedAt && (
          <span className="live-last-updated-stamp">
            Last updated: {updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}

        <button type="button" className="btn-live-refresh" onClick={onRefresh} title="Refresh live deliveries">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="refresh-icon">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>
  )
}
