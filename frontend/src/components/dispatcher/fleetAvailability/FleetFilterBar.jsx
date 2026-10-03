import searchIcon from '../../../assets/icons/search.svg'

export default function FleetFilterBar({
  searchQuery,
  setSearchQuery,
  vehicleType,
  setVehicleType,
  temperature,
  setTemperature,
  depot,
  setDepot,
  availability,
  setAvailability,
  tripFilter,
  setTripFilter,
  fuelFilter,
  setFuelFilter,
  onClearFilters,
}) {
  return (
    <div className="fleet-filter-bar-card">
      {/* Top Filter Row */}
      <div className="fleet-filter-top-row">
        {/* Search */}
        <div className="fleet-search-box">
          <img src={searchIcon} alt="" className="fleet-search-icon" />
          <input
            type="text"
            placeholder="Search vehicle ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fleet-search-input"
          />
        </div>

        {/* Dropdowns */}
        <div className="fleet-dropdown-select-wrap">
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="fleet-select"
          >
            <option value="all">Vehicle Type - All</option>
            <option value="truck">Refrigerated Truck</option>
            <option value="dry-box">Dry-box Truck</option>
            <option value="van">Van / Refrigerated Van</option>
          </select>
        </div>

        <div className="fleet-dropdown-select-wrap">
          <select
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="fleet-select"
          >
            <option value="all">Temperature - All</option>
            <option value="refrigerated">Refrigerated</option>
            <option value="ambient">Ambient Only</option>
          </select>
        </div>

        <div className="fleet-dropdown-select-wrap">
          <select
            value={depot}
            onChange={(e) => setDepot(e.target.value)}
            className="fleet-select"
          >
            <option value="all">Depot - All</option>
            <option value="peliyagoda">Peliyagoda</option>
            <option value="kandy">Kandy</option>
          </select>
        </div>

        <div className="fleet-dropdown-select-wrap">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="fleet-select"
          >
            <option value="all">Availability - All</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="loading">Loading</option>
            <option value="in_transit">In Transit</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Bottom Filter Row */}
      <div className="fleet-filter-bottom-row">
        <div className="bottom-filter-left-group">
          <div className="fleet-dropdown-select-wrap select-sm">
            <select
              value={tripFilter}
              onChange={(e) => setTripFilter(e.target.value)}
              className="fleet-select"
            >
              <option value="any">Trip - Any</option>
              <option value="no-trip">No Trip</option>
              <option value="trip-1">Trip 1</option>
              <option value="trip-2">Trip 2</option>
            </select>
          </div>

          <div className="fleet-dropdown-select-wrap select-sm">
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="fleet-select"
            >
              <option value="any">Fuel Status - Any</option>
              <option value="healthy">Healthy (&gt;50%)</option>
              <option value="low">Low (&lt;30%)</option>
              <option value="critical">Critical (&lt;15%)</option>
            </select>
          </div>

          <div className="quick-filter-tag-group">
            <span className="quick-tag-text">NO TRIP • TRIP 1 • TRIP 2</span>
          </div>

          <div className="quick-filter-tag-group">
            <span className="quick-tag-text">HEALTHY • LOW • CRITICAL</span>
          </div>
        </div>

        <button
          type="button"
          className="fleet-clear-filters-btn"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
