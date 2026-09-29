import { useState } from 'react'
import dateIcon from '../../assets/icons/date.svg'
import searchIcon from '../../assets/icons/search.svg'

export default function DeliveryHistoryHeader({ onExport }) {
  return (
    <div className="history-header-container">
      <div className="history-title-group">
        <h1 className="history-page-title">Delivery History</h1>
        <p className="history-page-subtitle">
          Archive and performance audit of completed, cancelled, and returned deliveries
        </p>
      </div>

      <div className="history-header-actions">
        {/* Date Range Picker Button */}
        <div className="history-date-picker-btn">
          <span>1 Sep – 26 Sep 2026</span>
          <img src={dateIcon} alt="" className="history-date-icon" />
        </div>

        {/* Global Search Input */}
        <div className="history-global-search">
          <svg
            className="history-search-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Waypoint..."
            className="history-global-search-input"
          />
        </div>

        {/* Export Button */}
        <button
          type="button"
          className="btn-history-export"
          onClick={onExport || (() => alert('Exporting delivery history report...'))}
          title="Export Delivery History"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export Report</span>
        </button>
      </div>
    </div>
  )
}
