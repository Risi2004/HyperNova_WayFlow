export default function OrderHistoryFiltersBar({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  deliveryType,
  onDeliveryTypeChange,
  sortOrder,
  onSortOrderChange,
  onClearFilters,
  counts = {
    all: 128,
    completed: 112,
    deferred: 9,
    cancelled: 7,
  },
  dockLabel = 'Colombo 05 Dock',
}) {
  const isFiltered = searchQuery || activeStatus !== 'all' || dateRange !== '30d' || deliveryType !== 'all'

  return (
    <div className="oh-filters-card">
      {/* Top Row: Search Input + Status Pills */}
      <div className="oh-filters-top-row">
        {/* Search */}
        <div className="oh-search-wrap">
          <svg className="oh-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="oh-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by order ID, SKU, or trip (e.g. ORD-0964)..."
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-oh-search-clear"
              onClick={() => onSearchChange('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="oh-status-tabs">
          <button
            type="button"
            className={`oh-tab-btn ${activeStatus === 'all' ? 'active' : ''}`}
            onClick={() => onStatusChange('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`oh-tab-btn ${activeStatus === 'completed' ? 'active' : ''}`}
            onClick={() => onStatusChange('completed')}
          >
            Completed ({counts.completed})
          </button>
          <button
            type="button"
            className={`oh-tab-btn ${activeStatus === 'deferred' ? 'active' : ''}`}
            onClick={() => onStatusChange('deferred')}
          >
            Deferred ({counts.deferred})
          </button>
          <button
            type="button"
            className={`oh-tab-btn ${activeStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => onStatusChange('cancelled')}
          >
            Cancelled ({counts.cancelled})
          </button>
        </div>
      </div>

      {/* Bottom Row: Dropdown Selects & Dock Info */}
      <div className="oh-filters-bottom-row">
        <div className="oh-dropdowns-group">
          {/* Date range dropdown */}
          <div className="oh-select-wrap">
            <select
              className="oh-select"
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Delivery type dropdown */}
          <div className="oh-select-wrap">
            <select
              className="oh-select"
              value={deliveryType}
              onChange={(e) => onDeliveryTypeChange(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="standard">Standard</option>
              <option value="refrigerated">Refrigerated</option>
            </select>
          </div>

          {/* Sort order dropdown */}
          <div className="oh-select-wrap">
            <select
              className="oh-select"
              value={sortOrder}
              onChange={(e) => onSortOrderChange(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Filters badge button */}
          <button type="button" className="btn-oh-filter-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>Filters ({isFiltered ? 1 : 0})</span>
          </button>

          {/* Clear filters link */}
          {isFiltered && (
            <button
              type="button"
              className="btn-oh-clear-link"
              onClick={onClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Right info text */}
        <div className="oh-dock-scope-text">
          Showing records for <strong>{dockLabel}</strong>
        </div>
      </div>
    </div>
  )
}
