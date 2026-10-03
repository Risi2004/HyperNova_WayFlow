import { useState } from 'react'
import searchIcon from '../../../assets/icons/search.svg'
import focusIcon from '../../../assets/icons/focus.svg'
import { outletLabel } from '../../../utils/orderFormat'

const FILTERS = ['All', 'Fresh', 'Style', 'Tech', 'High Priority', 'Refrigerated', 'Van Only', 'Deferred']
const PAGE = 25

function matches(order, filter) {
  switch (filter) {
    case 'Fresh':
    case 'Style':
    case 'Tech':
      return order.brand === filter
    case 'High Priority':
      return order.priority === 'urgent' || order.deferrals > 0
    case 'Refrigerated':
      return order.temp === 'chilled'
    case 'Van Only':
      return order.parking === 'van_only'
    case 'Deferred':
      return order.deferrals > 0
    default:
      return true
  }
}

function Badges({ order }) {
  return (
    <div className="order-badges-wrap">
      {order.temp === 'chilled' && <span className="order-tag-badge tag-refrigerated">Refrigerated</span>}
      {order.parking === 'van_only' && <span className="order-tag-badge tag-fragile">Van Only</span>}
      {order.parking === 'mall_dock' && <span className="order-tag-badge tag-standard">Mall Window</span>}
      {order.temp !== 'chilled' && order.parking === 'normal' && <span className="order-tag-badge tag-standard">Standard</span>}
      {order.priority === 'urgent' && <span className="order-tag-badge tag-high-priority">Urgent</span>}
      {order.deferrals > 0 && <span className="order-tag-badge tag-high-priority">Deferred {order.deferrals}× — serve first</span>}
    </div>
  )
}

export default function OrdersToPlanColumn({
  orders = [],
  focusedOrderId,
  onFocus,
  onAddToRoute,
  onFindAlternative,
  onDefer,
  targetLabel,
  isPublished,
  isLoading,
}) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [dismissed, setDismissed] = useState(null)

  const q = searchQuery.trim().toLowerCase()
  const filtered = orders
    .filter((o) => matches(o, activeFilter))
    .filter((o) => !q || [o.order_id, o.outlet_id, o.district, o.brand].some((s) => s.toLowerCase().includes(q)))
  const shown = showAll ? filtered : filtered.slice(0, PAGE)
  // An order the engine could not place is shown as "not compatible" with its reason.
  const blocked = orders.find((o) => o.order_id === focusedOrderId && o.reason !== 'not_planned' && dismissed !== o.order_id)

  return (
    <div className="orders-plan-column">
      {/* Column Header */}
      <div className="column-top-header">
        <div className="column-title-row">
          <h2 className="column-title">Orders to Plan</h2>
          <span className="waiting-badge">{orders.length} WAITING</span>
        </div>
        <p className="column-subtitle">
          {isPublished
            ? 'Plan published — remaining orders were deferred'
            : targetLabel
              ? `Add to ${targetLabel}, or drag onto the route`
              : 'Confirmed and deferred orders not yet on a trip'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="orders-search-row">
        <div className="search-input-wrap">
          <img src={searchIcon} alt="" className="search-icon-img" />
          <input
            type="text"
            placeholder="Search order, outlet or district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="filter-tags-scroll">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`tag-pill-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-cards-stack">
        {isLoading && <p className="planner-empty-note">Loading orders…</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="planner-empty-note">{orders.length ? 'No orders match this filter.' : 'Every order for this date is on a trip.'}</p>
        )}

        {blocked && !isPublished && (
          <div className="planner-incompatible-card">
            <div className="incompatible-header">
              <span className="incompatible-title-badge">ORDER NOT COMPATIBLE</span>
              <button type="button" className="btn-dismiss-alert" onClick={() => setDismissed(blocked.order_id)} aria-label="Dismiss">
                ×
              </button>
            </div>
            <span className="incompatible-order-id">{blocked.order_id}</span>
            <h4 className="incompatible-outlet">{outletLabel(blocked)}</h4>
            <p className="incompatible-reason">{blocked.reason_label}: {blocked.explanation}</p>
            <div className="incompatible-actions">
              <button type="button" className="btn-move-refrigerated" onClick={() => onFindAlternative(blocked)}>
                <span>Find a vehicle that fits</span>
              </button>
              <button type="button" className="btn-defer-subaction" onClick={() => onDefer(blocked)}>
                <span>Defer Order</span>
              </button>
            </div>
          </div>
        )}

        {shown.map((order) => {
          const focused = order.order_id === focusedOrderId
          return (
            <div
              key={order.order_id}
              className={`planner-order-card ${focused ? 'card-focused' : ''}`}
              draggable={!isPublished}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', order.order_id)
                if (!focused) onFocus(order.order_id)
              }}
              onClick={() => onFocus(order.order_id)}
            >
              <div className="order-card-header">
                <div className="order-card-drag-id">
                  <span className="drag-handle-dots" title="Drag to assign">⋮⋮</span>
                  <span className="order-id-label">{order.order_id}</span>
                </div>
                {focused ? (
                  <span className="focused-badge">
                    <img src={focusIcon} alt="" className="badge-icon-focus" />
                    <span>FOCUSED</span>
                  </span>
                ) : (
                  !isPublished && (
                    <button
                      type="button"
                      className="btn-order-assign-arrow"
                      title={targetLabel ? `Add to ${targetLabel}` : 'Find a vehicle'}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddToRoute(order)
                      }}
                    >
                      →
                    </button>
                  )
                )}
              </div>
              <h3 className="order-outlet-title">{outletLabel(order)}</h3>
              <div className="order-meta-info-row">
                <span className="order-window-pill">{order.window}</span>
                <span className="order-weight-volume-text">
                  {Math.round(order.weight).toLocaleString()} kg • {order.volume} m³
                </span>
              </div>
              <Badges order={order} />
              {order.reason !== 'not_planned' && <p className="order-reason-hint">⚠ {order.reason_label}</p>}
              <p className="order-drag-hint">
                {focused && targetLabel ? `Check the drop zone, then add it to ${targetLabel}` : 'Drag into a route, or select it and press →'}
              </p>
            </div>
          )
        })}
      </div>

      {/* Pagination Footer */}
      <div className="orders-plan-footer">
        <span className="showing-count-text">
          Showing {shown.length} of {filtered.length}
        </span>
        {filtered.length > PAGE && (
          <button type="button" className="btn-view-all-orders" onClick={() => setShowAll(!showAll)}>
            <span>{showAll ? 'Show fewer' : 'View all'}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  )
}
