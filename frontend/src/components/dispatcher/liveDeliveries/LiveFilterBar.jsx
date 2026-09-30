import searchIcon from '../../../assets/icons/search.svg'

export default function LiveFilterBar({
  activeTab = 'All',
  onTabChange,
  searchQuery,
  setSearchQuery,
  depotFilter,
  setDepotFilter,
  brandFilter,
  setBrandFilter,
  statusFilter,
  setStatusFilter,
  vehicleTypeFilter,
  setVehicleTypeFilter,
  windowFilter,
  setWindowFilter,
  onClearFilters,
}) {
  const tabs = [
    { label: 'All', count: 56 },
    { label: 'Active', count: 18 },
    { label: 'Pending', count: 2 },
    { label: 'Completed', count: 32 },
    { label: 'Delayed', count: 4 },
    { label: 'Problem', count: 2 },
  ]

  return (
    <div className="live-filter-wrapper">
      {/* Horizontal Filter Tabs */}
      <div className="live-status-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            type="button"
            className={`live-status-tab-btn ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => onTabChange(tab.label)}
          >
            <span className="tab-label-text">{tab.label}</span>
            <span className="tab-count-pill">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Dropdown Filters & Search Bar */}
      <div className="live-dropdowns-filter-bar">
        {/* Search Input */}
        <div className="live-search-box">
          <img src={searchIcon} alt="" className="live-search-icon" />
          <input
            type="text"
            placeholder="Search route, vehicle, driver, outlet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="live-search-input"
          />
        </div>

        {/* Depot Filter */}
        <select
          className="live-select-input"
          value={depotFilter}
          onChange={(e) => setDepotFilter(e.target.value)}
        >
          <option value="All">Depot</option>
          <option value="Peliyagoda">Peliyagoda</option>
          <option value="Kandy">Kandy</option>
        </select>

        {/* Brand Filter */}
        <select
          className="live-select-input"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="All">Brand</option>
          <option value="Waypoint Fresh">Waypoint Fresh</option>
          <option value="Waypoint Style">Waypoint Style</option>
          <option value="Waypoint Tech">Waypoint Tech</option>
        </select>

        {/* Delivery Status Filter */}
        <select
          className="live-select-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">Delivery Status</option>
          <option value="On Time">On Time</option>
          <option value="Delayed">Delayed</option>
          <option value="Problem">Problem</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Vehicle Type Filter */}
        <select
          className="live-select-input"
          value={vehicleTypeFilter}
          onChange={(e) => setVehicleTypeFilter(e.target.value)}
        >
          <option value="All">Vehicle Type</option>
          <option value="Refrigerated Truck">Refrigerated Truck</option>
          <option value="Van">Van</option>
          <option value="14ft Truck">14ft Truck</option>
        </select>

        {/* Delivery Window Filter */}
        <select
          className="live-select-input"
          value={windowFilter}
          onChange={(e) => setWindowFilter(e.target.value)}
        >
          <option value="All">Delivery Window</option>
          <option value="05:30-08:00">05:30-08:00</option>
          <option value="07:00-08:00">07:00-08:00</option>
          <option value="08:00-09:00">08:00-09:00</option>
        </select>

        {/* Clear Filters Link */}
        <button
          type="button"
          className="btn-clear-live-filters"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
