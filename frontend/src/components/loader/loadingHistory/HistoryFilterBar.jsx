export default function HistoryFilterBar({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  vehicleFilter,
  onVehicleFilterChange,
  routeFilter,
  onRouteChange,
  statusFilter,
  onStatusChange,
  issueFilter,
  onIssueChange,
  onClearFilters,
  onExport,
}) {
  return (
    <div className="history-filter-bar">
      {/* Search Input */}
      <div className="history-search-wrap">
        <svg
          className="history-search-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="history-search-input"
          placeholder="Search load, vehicle or route..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Select Buttons */}
      <div className="history-filter-chips">
        {/* Date Range */}
        <div className="filter-chip-wrapper">
          <label className="filter-chip-prefix">Date Range:</label>
          <select
            className="filter-chip-select"
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Today">Today</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This Month">This Month</option>
          </select>
        </div>

        {/* Vehicle */}
        <div className="filter-chip-wrapper">
          <label className="filter-chip-prefix">Vehicle:</label>
          <select
            className="filter-chip-select"
            value={vehicleFilter}
            onChange={(e) => onVehicleFilterChange(e.target.value)}
          >
            <option value="All Vehicles">All Vehicles</option>
            <option value="WP-LOR-012">WP-LOR-012</option>
            <option value="WP-REF-007">WP-REF-007</option>
            <option value="WP-VAN-004">WP-VAN-004</option>
            <option value="WP-DRY-019">WP-DRY-019</option>
          </select>
        </div>

        {/* Route */}
        <div className="filter-chip-wrapper">
          <label className="filter-chip-prefix">Route:</label>
          <select
            className="filter-chip-select"
            value={routeFilter}
            onChange={(e) => onRouteChange(e.target.value)}
          >
            <option value="All Routes">All Routes</option>
            <option value="Colombo North">Colombo North</option>
            <option value="Colombo South">Colombo South</option>
            <option value="Mall Outlets">Mall Outlets</option>
            <option value="Negombo">Negombo</option>
            <option value="Kandy Express">Kandy Express</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-chip-wrapper">
          <label className="filter-chip-prefix">Status:</label>
          <select
            className="filter-chip-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="COMPLETED WITH ISSUE">Completed With Issue</option>
          </select>
        </div>

        {/* Issue */}
        <div className="filter-chip-wrapper">
          <label className="filter-chip-prefix">Issue:</label>
          <select
            className="filter-chip-select"
            value={issueFilter}
            onChange={(e) => onIssueChange(e.target.value)}
          >
            <option value="All Issues">All Issues</option>
            <option value="With Issues">With Issues</option>
            <option value="None">None</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          className="btn-clear-history-filters"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>

      {/* Export Button */}
      <button
        type="button"
        className="btn-export-history"
        onClick={onExport}
      >
        Export History
      </button>
    </div>
  )
}
