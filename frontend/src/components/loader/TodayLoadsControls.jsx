export default function TodayLoadsControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  departureFilter,
  onDepartureChange,
  vehicleTypeFilter,
  onVehicleTypeChange,
}) {
  return (
    <div className="today-loads-controls">
      {/* Search Input */}
      <div className="today-loads-search-wrapper">
        <svg
          className="search-input-icon"
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
          className="today-loads-search-input"
          placeholder="Search load, vehicle or route..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="today-loads-dropdowns">
        {/* Status Filter */}
        <div className="today-loads-select-wrapper">
          <select
            className="today-loads-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="AWAITING">Awaiting Loading</option>
            <option value="LOADING">Loading</option>
            <option value="READY">Ready</option>
            <option value="ISSUE">Issue</option>
          </select>
          <svg className="select-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Departure Time Filter */}
        <div className="today-loads-select-wrapper">
          <select
            className="today-loads-select"
            value={departureFilter}
            onChange={(e) => onDepartureChange(e.target.value)}
          >
            <option value="ALL">Departure Time</option>
            <option value="EARLY">Before 06:30 AM</option>
            <option value="MID">06:30 AM - 07:30 AM</option>
            <option value="LATE">After 07:30 AM</option>
          </select>
          <svg className="select-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Vehicle Type Filter */}
        <div className="today-loads-select-wrapper">
          <select
            className="today-loads-select"
            value={vehicleTypeFilter}
            onChange={(e) => onVehicleTypeChange(e.target.value)}
          >
            <option value="ALL">Vehicle Type</option>
            <option value="Dry-box Truck">Dry-box Truck</option>
            <option value="Refrigerated Truck">Refrigerated Truck</option>
            <option value="Refrigerated Van">Refrigerated Van</option>
            <option value="Delivery Van">Delivery Van</option>
          </select>
          <svg className="select-chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
