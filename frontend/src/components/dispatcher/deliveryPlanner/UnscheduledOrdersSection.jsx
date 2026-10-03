import { useState } from 'react'
import collapseIcon from '../../../assets/icons/collapse.svg'
import searchIcon from '../../../assets/icons/search.svg'
import { outletLabel } from '../../../utils/orderFormat'

const PAGE = 8

export default function UnscheduledOrdersSection({ orders = [], isPublished, onFocus, onFindAlternative, onDefer }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const shown = showAll ? orders : orders.slice(0, PAGE)
  const byReason = orders.reduce((acc, o) => ({ ...acc, [o.reason_label]: (acc[o.reason_label] || 0) + 1 }), {})

  return (
    <div className="unscheduled-section-wrapper" id="planner-unscheduled">
      {/* Section Top Header */}
      <div className="unscheduled-header-bar">
        <div className="unscheduled-title-meta">
          <h3 className="unscheduled-main-title">Orders Unable to Be Scheduled</h3>
          <p className="unscheduled-subtitle">
            {orders.length
              ? `${orders.length} order${orders.length === 1 ? '' : 's'} need another vehicle, or will be deferred on publish with the reason shown`
              : isPublished
                ? 'The plan is published. Deferred orders are listed on the Orders page with their reasons.'
                : 'Every order fits the available fleet for this date.'}
          </p>
        </div>
        <div className="unscheduled-ctrl-group">
          <span className="unscheduled-count-badge">{orders.length} ORDERS</span>
          <button type="button" className="btn-collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
            <img src={collapseIcon} alt="" className={`collapse-icon-img ${collapsed ? 'rotated' : ''}`} />
            <span>{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </div>

      {!collapsed && orders.length > 0 && (
        <>
          <div className="unscheduled-cards-grid">
            {shown.map((item) => (
              <div key={item.order_id} className="unscheduled-card">
                <div className="card-top-id-row">
                  <span className="unscheduled-order-code">{item.order_id}</span>
                  <span className="unscheduled-status-pill">{item.deferrals > 0 ? `DEFERRED ${item.deferrals}×` : 'UNSCHEDULED'}</span>
                </div>
                <h4 className="unscheduled-reason-title">{item.reason_label}</h4>
                <p className="unscheduled-description">
                  {outletLabel(item)} • {item.temp === 'chilled' ? 'Chilled' : 'Ambient'} • {Math.round(item.weight)} kg / {item.volume} m³
                </p>
                {expanded === item.order_id && <p className="unscheduled-description">{item.explanation}</p>}
                <div className="unscheduled-actions-row">
                  <button
                    type="button"
                    className="btn-view-reason"
                    onClick={() => setExpanded(expanded === item.order_id ? null : item.order_id)}
                  >
                    {expanded === item.order_id ? 'Hide Reason' : 'View Reason'}
                  </button>
                  {!isPublished && (
                    <button type="button" className="btn-find-alternative" onClick={() => onFindAlternative(item)}>
                      <img src={searchIcon} alt="" className="btn-search-icon-sm" />
                      <span>Find Alternative</span>
                    </button>
                  )}
                </div>
                {!isPublished && (
                  <div className="unscheduled-defer-footer">
                    <button
                      type="button"
                      className="btn-defer-trigger"
                      onClick={() => {
                        onFocus(item.order_id)
                        onDefer(item)
                      }}
                    >
                      <span>Set deferral reason</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Grouping Notice Footer */}
          <div className="unscheduled-notice-banner">
            <div className="notice-left-wrap">
              <span>
                {Object.entries(byReason)
                  .map(([label, n]) => `${n} × ${label}`)
                  .join(' • ')}
                . Each order is deferred to the next run with this reason when you publish, and its store manager sees it.
              </span>
            </div>
            {orders.length > PAGE && (
              <button type="button" className="btn-view-all-unscheduled" onClick={() => setShowAll(!showAll)}>
                <span>{showAll ? 'Show fewer' : `View all ${orders.length}`}</span>
                <span>→</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
