import { useState } from 'react'
import dateIcon from '../../assets/icons/date.svg'

export default function RoutesHeader({ activeTab, onTabChange }) {
  const tabs = [
    { label: 'All', count: 24 },
    { label: 'Planned', count: 8 },
    { label: 'Loading', count: 4 },
    { label: 'Active', count: 6 },
    { label: 'Completed', count: 5 },
    { label: 'Delayed', count: 1 },
  ]

  return (
    <div className="routes-header-section">
      {/* Top Title & Primary Actions */}
      <div className="routes-top-bar">
        <div className="routes-title-group">
          <h1 className="routes-page-title">Routes</h1>
          <p className="routes-page-subtitle">View and manage today's delivery routes.</p>
        </div>

        <div className="routes-top-actions">
          <div className="routes-date-picker-btn">
            <span>28 September 2026</span>
            <img src={dateIcon} alt="" className="routes-date-icon" />
          </div>

          <button type="button" className="btn-add-route-blue" title="Create new route">
            +
          </button>
        </div>
      </div>

      {/* Status Filter Horizontal Tabs */}
      <div className="routes-status-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`routes-status-tab ${activeTab === tab.label.toLowerCase() ? 'active' : ''}`}
            onClick={() => onTabChange(tab.label.toLowerCase())}
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count-pill">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
