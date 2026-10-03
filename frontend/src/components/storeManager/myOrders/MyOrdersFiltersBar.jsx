import { useCurrentUser } from '../../../hooks/useCurrentUser'
export default function MyOrdersFiltersBar({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
  statusCounts = {
    all: 24,
    pending: 3,
    confirmed: 2,
    scheduled: 2,
    inDelivery: 2,
    completed: 17,
    deferred: 2,
  },
  onRefresh,
}) {
  const user = useCurrentUser()
  const statusTabs = [
    { id: 'ALL', label: 'All', count: statusCounts.all },
    { id: 'PENDING', label: 'Pending', count: statusCounts.pending },
    { id: 'CONFIRMED', label: 'Confirmed', count: statusCounts.confirmed },
    { id: 'SCHEDULED', label: 'Scheduled', count: statusCounts.scheduled },
    { id: 'IN_DELIVERY', label: 'In Delivery', count: statusCounts.inDelivery },
    { id: 'COMPLETED', label: 'Completed', count: statusCounts.completed },
    { id: 'DEFERRED', label: 'Deferred', count: statusCounts.deferred },
  ]

  return (
    <div className="mo-filter-controls-container">
      {/* 1. Store Subheader / Live Status Bar */}
      <div className="mo-sub-info-bar">
        <div className="mo-sub-info-left">
          <div className="mo-outlet-pill-group">
            <span className="mo-live-dot blue" />
            <span className="mo-store-name">{user?.outlet ? `Waypoint ${user.outlet.brand} – ${user.outlet.district}` : user?.facility}</span>
            <span className="mo-store-code-pill">{user?.outlet_id || 'No outlet'}</span>
          </div>

          <span className="mo-sub-sep">•</span>

          <div className="mo-orders-count-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span><strong>24</strong> total orders recorded</span>
          </div>

          <span className="mo-sub-sep">•</span>

          <div className="mo-next-inbound-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>
              Next Inbound: <strong className="inbound-link">ORD-1042</strong> arriving today ~10:45 AM
            </span>
          </div>
        </div>

        <div className="mo-sub-info-right">
          <span className="mo-live-dot green" />
          <span className="mo-sync-text">Live Dispatch Sync active</span>
          <button
            type="button"
            className="btn-mo-sync"
            onClick={onRefresh}
            title="Refresh order statuses"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="mo-search-bar-row">
        {/* Search input */}
        <div className="mo-search-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="mo-search-input"
            placeholder="Search by Order ID, SKU, driver, or notes (e.g. ORD-1042)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Date Filter Dropdown */}
        <div className="mo-filter-select-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            className="mo-filter-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="ALL">All Delivery Dates</option>
            <option value="TODAY">Today</option>
            <option value="TOMORROW">Tomorrow</option>
            <option value="NEXT_7_DAYS">Next 7 Days</option>
            <option value="PAST_30_DAYS">Past 30 Days</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="mo-filter-select-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="9" y1="18" x2="15" y2="18" />
          </svg>
          <select
            className="mo-filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="LATEST">Sort: Latest Placed</option>
            <option value="EARLIEST">Sort: Earliest Placed</option>
            <option value="DELIVERY_DATE">Sort: Delivery Date</option>
            <option value="PAYLOAD_WEIGHT">Sort: Payload Weight</option>
          </select>
        </div>

        {/* Reset / Refresh Button */}
        <button
          type="button"
          className="btn-mo-reset"
          onClick={() => {
            setSearchQuery('')
            setDateFilter('ALL')
            setSortBy('LATEST')
            setStatusFilter('ALL')
          }}
          title="Reset all filters"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>

      {/* 3. Status Tabs Filter Bar */}
      <div className="mo-status-tabs-row">
        <span className="mo-status-filter-label">STATUS:</span>
        <div className="mo-status-tabs-list">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`mo-status-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab.id)}
              >
                <span>{tab.label}</span>
                <span className="mo-tab-count">({tab.count})</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
