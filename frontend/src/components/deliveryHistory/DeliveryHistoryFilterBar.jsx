import searchIcon from '../../assets/icons/search.svg'

export default function DeliveryHistoryFilterBar({
  activeTab = 'All',
  onTabChange,
  searchQuery,
  setSearchQuery,
  depotFilter,
  setDepotFilter,
  brandFilter,
  setBrandFilter,
  vehicleTypeFilter,
  setVehicleTypeFilter,
  onClearFilters,
}) {
  const tabs = [
    { label: 'All', count: '1,446' },
    { label: 'Completed', count: '1,392' },
    { label: 'Returned', count: '36' },
    { label: 'Cancelled', count: '18' },
  ]

  return (
    <div className="history-filter-wrapper">
      {/* Status Horizontal Tabs */}
      <div className="history-status-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`history-status-tab-btn ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => onTabChange(tab.label)}
          >
            <span className="tab-label-text">{tab.label}</span>
            <span className="tab-count-pill">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Filter Dropdowns & Search */}
      <div className="history-dropdowns-filter-bar">
        {/* Search */}
        <div className="history-search-box">
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
            placeholder="Search delivery ID, order, outlet, driver, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-input"
          />
        </div>

        {/* Depot */}
        <select
          className="history-select-input"
          value={depotFilter}
          onChange={(e) => setDepotFilter(e.target.value)}
        >
          <option value="All">Depot (All)</option>
          <option value="Peliyagoda">Peliyagoda</option>
          <option value="Kandy">Kandy</option>
        </select>

        {/* Brand */}
        <select
          className="history-select-input"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="All">Brand (All)</option>
          <option value="Waypoint Fresh">Waypoint Fresh</option>
          <option value="Waypoint Style">Waypoint Style</option>
          <option value="Waypoint Tech">Waypoint Tech</option>
        </select>

        {/* Vehicle Type */}
        <select
          className="history-select-input"
          value={vehicleTypeFilter}
          onChange={(e) => setVehicleTypeFilter(e.target.value)}
        >
          <option value="All">Vehicle Type (All)</option>
          <option value="Refrigerated Truck">Refrigerated Truck</option>
          <option value="Dry-box Truck">Dry-box Truck</option>
          <option value="Van">Van</option>
        </select>

        {/* Clear Filters */}
        <button
          type="button"
          className="btn-clear-history-filters"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
