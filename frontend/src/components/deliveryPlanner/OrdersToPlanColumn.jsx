import { useState } from 'react'
import searchIcon from '../../assets/icons/search.svg'
import focusIcon from '../../assets/icons/focus.svg'

export default function OrdersToPlanColumn() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filters = [
    'All',
    'Fresh',
    'Style',
    'Tech',
    'High Priority',
    'Refrigerated',
    'Van Only',
  ]

  return (
    <div className="orders-plan-column">
      {/* Column Header */}
      <div className="column-top-header">
        <div className="column-title-row">
          <h2 className="column-title">Orders to Plan</h2>
          <span className="waiting-badge">24 WAITING</span>
        </div>
        <p className="column-subtitle">24 confirmed orders</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="orders-search-row">
        <div className="search-input-wrap">
          <img src={searchIcon} alt="" className="search-icon-img" />
          <input
            type="text"
            placeholder="Search order or outlet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="orders-search-input"
          />
        </div>
        <button type="button" className="btn-filter-toggle">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filter</span>
        </button>
      </div>

      {/* Filter Tag Pills */}
      <div className="filter-tags-scroll">
        {filters.map((f) => (
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
        {/* Card 1: Focused / Selected */}
        <div className="planner-order-card card-focused">
          <div className="order-card-header">
            <div className="order-card-drag-id">
              <span className="drag-handle-dots" title="Drag to assign">⋮⋮</span>
              <span className="order-id-label">ORD-2026-1048</span>
            </div>
            <span className="focused-badge">
              <img src={focusIcon} alt="" className="badge-icon-focus" />
              <span>FOCUSED</span>
            </span>
          </div>

          <h3 className="order-outlet-title">Waypoint Fresh – Colombo 03</h3>

          <div className="order-meta-info-row">
            <span className="order-window-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              10:00 AM – 12:00 PM
            </span>
            <span className="order-weight-volume-text">420 kg • 3.8 m³</span>
          </div>

          <div className="order-badges-wrap">
            <span className="order-tag-badge tag-refrigerated">Refrigerated</span>
            <span className="order-tag-badge tag-high-priority">High Priority</span>
          </div>

          <p className="order-drag-hint">
            Drag into a route, or move between Trip 1 and Trip 2
          </p>
        </div>

        {/* Card 2 */}
        <div className="planner-order-card">
          <div className="order-card-header">
            <div className="order-card-drag-id">
              <span className="drag-handle-dots" title="Drag to assign">⋮⋮</span>
              <span className="order-id-label">ORD-2026-1052</span>
            </div>
            <button type="button" className="btn-order-assign-arrow" title="Add to route">
              →
            </button>
          </div>

          <h3 className="order-outlet-title">Waypoint Style – Colombo 07</h3>

          <div className="order-meta-info-row">
            <span className="order-window-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              1:00 PM – 3:00 PM
            </span>
            <span className="order-weight-volume-text">180 kg • 5.4 m³</span>
          </div>

          <div className="order-badges-wrap">
            <span className="order-tag-badge tag-standard">Standard</span>
          </div>

          <p className="order-drag-hint">
            Drag into a route, or move between Trip 1 and Trip 2
          </p>
        </div>

        {/* Card 3 */}
        <div className="planner-order-card">
          <div className="order-card-header">
            <div className="order-card-drag-id">
              <span className="drag-handle-dots" title="Drag to assign">⋮⋮</span>
              <span className="order-id-label">ORD-2026-1061</span>
            </div>
            <button type="button" className="btn-order-assign-arrow" title="Add to route">
              →
            </button>
          </div>

          <h3 className="order-outlet-title">Waypoint Tech – Nugegoda</h3>

          <div className="order-meta-info-row">
            <span className="order-window-pill">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              11:00 AM – 1:00 PM
            </span>
            <span className="order-weight-volume-text">450 kg • 2.1 m³</span>
          </div>

          <div className="order-badges-wrap">
            <span className="order-tag-badge tag-fragile">Fragile</span>
          </div>

          <p className="order-drag-hint">
            Drag into a route, or move between Trip 1 and Trip 2
          </p>
        </div>

        {/* Card 4: Order Not Compatible Alert */}
        <div className="planner-incompatible-card">
          <div className="incompatible-header">
            <span className="incompatible-title-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              ORDER NOT COMPATIBLE
            </span>
            <button type="button" className="btn-dismiss-alert">×</button>
          </div>

          <span className="incompatible-order-id">ORD-2026-1070</span>
          <h4 className="incompatible-outlet">Waypoint Fresh – Colombo 14</h4>
          <p className="incompatible-reason">Vehicle does not support refrigerated goods.</p>

          <div className="incompatible-actions">
            <button type="button" className="btn-move-refrigerated">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <span>Move to refrigerated vehicle</span>
            </button>
            <button type="button" className="btn-defer-subaction">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Defer Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="orders-plan-footer">
        <span className="showing-count-text">Showing 3 of 24</span>
        <button type="button" className="btn-view-all-orders">
          <span>View all</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
