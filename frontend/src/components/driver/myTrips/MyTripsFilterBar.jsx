export default function MyTripsFilterBar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateChange,
  statusFilter,
  onStatusChange,
  vehicleFilter,
  onVehicleChange,
  onClearFilters,
}) {
  return (
    <div className="my-trips-filter-bar">
      {/* Search Input */}
      <div className="trips-search-wrapper">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="trips-search-input"
          placeholder="Search trip ID, route or vehicle..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Dropdown Filters Group */}
      <div className="trips-dropdown-filters">
        {/* Date Filter */}
        <div className="filter-select-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="select-left-icon">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <select
            className="filter-select with-icon"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
          >
            <option value="All Dates">All Dates</option>
            <option value="Today">Today (27 Sep)</option>
            <option value="Tomorrow">Tomorrow (28 Sep)</option>
            <option value="Past 7 Days">Past 7 Days</option>
          </select>
        </div>

        {/* Status Filter */}
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All Statuses">All Statuses</option>
          <option value="In Progress">In Progress</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Vehicle Filter */}
        <select
          className="filter-select"
          value={vehicleFilter}
          onChange={(e) => onVehicleChange(e.target.value)}
        >
          <option value="All Vehicles">All Vehicles</option>
          <option value="WP-REF-007">WP-REF-007 (Refrigerated)</option>
          <option value="WP-VAN-004">WP-VAN-004 (Delivery Van)</option>
          <option value="WP-DRY-019">WP-DRY-019 (Dry-box)</option>
          <option value="WP-LOR-012">WP-LOR-012 (Lorry)</option>
          <option value="WP-REF-011">WP-REF-011 (Refrigerated)</option>
        </select>

        {/* Clear Filters */}
        <button
          type="button"
          className="btn-clear-trips-filters"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
