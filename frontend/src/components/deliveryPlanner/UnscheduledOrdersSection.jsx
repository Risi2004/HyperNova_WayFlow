import { useState } from 'react'
import collapseIcon from '../../assets/icons/collapse.svg'
import searchIcon from '../../assets/icons/search.svg'

export default function UnscheduledOrdersSection() {
  const [collapsed, setCollapsed] = useState(false)

  const unscheduledList = [
    {
      id: 'ORD-2026-1070',
      reasonTitle: 'Insufficient refrigerated capacity',
      desc: 'No refrigerated vehicle has enough weight and volume remaining.',
    },
    {
      id: 'ORD-2026-1074',
      reasonTitle: 'Vehicle capacity exceeded',
      desc: "Adding this order exceeds the selected vehicle's weight limit.",
    },
    {
      id: 'ORD-2026-1082',
      reasonTitle: 'No suitable van available',
      desc: 'This outlet is van-only and all suitable vans are assigned.',
    },
    {
      id: 'ORD-2026-1090',
      reasonTitle: 'Delivery window conflict',
      desc: 'No route can reach the outlet inside its fixed access window.',
    },
  ]

  return (
    <div className="unscheduled-section-wrapper">
      {/* Section Top Header */}
      <div className="unscheduled-header-bar">
        <div className="unscheduled-title-meta">
          <h3 className="unscheduled-main-title">Orders Unable to Be Scheduled</h3>
          <p className="unscheduled-subtitle">
            7 orders need an alternative vehicle, later run, or explicit deferral reason
          </p>
        </div>

        <div className="unscheduled-ctrl-group">
          <span className="unscheduled-count-badge">7 ORDERS</span>
          <button
            type="button"
            className="btn-collapse-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <img src={collapseIcon} alt="" className={`collapse-icon-img ${collapsed ? 'rotated' : ''}`} />
            <span>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* 4 Issue Cards Grid */}
          <div className="unscheduled-cards-grid">
            {unscheduledList.map((item) => (
              <div key={item.id} className="unscheduled-card">
                <div className="card-top-id-row">
                  <span className="unscheduled-order-code">{item.id}</span>
                  <span className="unscheduled-status-pill">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    UNSCHEDULED
                  </span>
                </div>

                <h4 className="unscheduled-reason-title">{item.reasonTitle}</h4>
                <p className="unscheduled-description">{item.desc}</p>

                <div className="unscheduled-actions-row">
                  <button type="button" className="btn-view-reason">
                    View Reason
                  </button>
                  <button type="button" className="btn-find-alternative">
                    <img src={searchIcon} alt="" className="btn-search-icon-sm" />
                    <span>Find Alternative</span>
                  </button>
                </div>

                <div className="unscheduled-defer-footer">
                  <button type="button" className="btn-defer-trigger">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Defer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Grouping Notice Footer */}
          <div className="unscheduled-notice-banner">
            <div className="notice-left-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                3 additional orders are grouped under similar reasons. A clear reason is required before any order is deferred.
              </span>
            </div>
            <button type="button" className="btn-view-all-unscheduled">
              <span>View all 7</span>
              <span>→</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
