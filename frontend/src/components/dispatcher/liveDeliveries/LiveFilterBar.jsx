import searchIcon from '../../../assets/icons/search.svg'

export default function LiveFilterBar({
  tabs,
  activeTab,
  onTabChange,
  searchQuery,
  setSearchQuery,
  options,
  depotFilter,
  setDepotFilter,
  brandFilter,
  setBrandFilter,
  vehicleTypeFilter,
  setVehicleTypeFilter,
  onClearFilters,
}) {
  return (
    <div className="live-filter-wrapper">
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

      <div className="live-dropdowns-filter-bar">
        <div className="live-search-box">
          <img src={searchIcon} alt="" className="live-search-icon" />
          <input
            type="text"
            placeholder="Search trip, vehicle, driver, outlet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="live-search-input"
          />
        </div>

        <select className="live-select-input" value={depotFilter} onChange={(e) => setDepotFilter(e.target.value)} aria-label="Depot">
          <option value="All">All depots</option>
          {options.depots.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select className="live-select-input" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} aria-label="Brand">
          <option value="All">All brands</option>
          {options.brands.map((b) => <option key={b} value={b}>Waypoint {b}</option>)}
        </select>

        <select className="live-select-input" value={vehicleTypeFilter} onChange={(e) => setVehicleTypeFilter(e.target.value)} aria-label="Vehicle type">
          <option value="All">All vehicle types</option>
          {options.vehicleTypes.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>

        <button type="button" className="btn-clear-live-filters" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}
