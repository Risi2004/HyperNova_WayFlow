import { useState } from 'react'
import dateIcon from '../../../assets/icons/date.svg'

export default function LiveHeader({ onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshClick = () => {
    setIsRefreshing(true)
    if (onRefresh) onRefresh()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="live-header-container">
      {/* Title & Subtitle */}
      <div className="live-title-group">
        <h1 className="live-page-title">Live Deliveries</h1>
        <p className="live-page-subtitle">
          Monitor today's delivery progress across the Waypoint network
        </p>
      </div>

      {/* Top Actions & Connection Status */}
      <div className="live-header-actions">
        {/* Live Data Connected Badge */}
        <div className="live-connection-badge">
          <span className="live-pulse-dot"></span>
          <span>Live data connected</span>
        </div>

        {/* Date Selector */}
        <div className="live-date-picker-btn">
          <span>26 September 2026</span>
          <img src={dateIcon} alt="" className="live-date-icon" />
        </div>

        {/* Last Updated Timestamp */}
        <span className="live-last-updated-stamp">Last updated: 09:42 AM</span>

        {/* Refresh Button */}
        <button
          type="button"
          className={`btn-live-refresh ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefreshClick}
          title="Refresh live deliveries"
        >
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
