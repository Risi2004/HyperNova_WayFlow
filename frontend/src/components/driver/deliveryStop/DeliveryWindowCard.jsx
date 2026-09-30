export default function DeliveryWindowCard({
  windowTime = '11:00 AM - 11:30 AM',
  statusText = 'Scheduled - Starts in 15 mins',
}) {
  return (
    <div className="stop-sidebar-card delivery-window-card">
      <h4 className="sidebar-card-title">DELIVERY WINDOW</h4>

      <div className="delivery-window-body">
        <div className="window-time-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div className="window-time-meta">
            <span className="window-main-time">{windowTime}</span>
            <span className="window-sub-status">{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
