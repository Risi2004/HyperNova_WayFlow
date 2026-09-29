import { useState } from 'react'
import searchIcon from '../../assets/icons/search.svg'
import dateIcon from '../../assets/icons/date.svg'

export default function RoutesFilterBar({
  searchQuery,
  setSearchQuery,
  activeDepot,
  setActiveDepot,
  vehicleType,
  setVehicleType,
  routeStatus,
  setRouteStatus,
  brand,
  setBrand,
  viewMode,
  setViewMode,
  onClearFilters,
}) {
  return (
    <div className="routes-filter-card">
      {/* Top Depot Switcher & View Mode Row */}
      <div className="routes-filter-top-row">
        <div className="routes-depot-pills">
          <button
            type="button"
            className={`depot-pill-btn ${activeDepot === 'all' ? 'active' : ''}`}
            onClick={() => setActiveDepot('all')}
          >
            All Depots
          </button>
          <button
            type="button"
            className={`depot-pill-btn ${activeDepot === 'peliyagoda' ? 'active' : ''}`}
            onClick={() => setActiveDepot('peliyagoda')}
          >
            Peliyagoda
          </button>
          <button
            type="button"
            className={`depot-pill-btn ${activeDepot === 'kandy' ? 'active' : ''}`}
            onClick={() => setActiveDepot('kandy')}
          >
            Kandy
          </button>
        </div>

        <div className="view-mode-toggle-group">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Card / Grid View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search & Dropdown Filters Row */}
      <div className="routes-filter-bottom-row">
        {/* Search */}
        <div className="routes-search-wrap">
          <img src={searchIcon} alt="" className="search-icon-img" />
          <input
            type="text"
            placeholder="Search route, vehicle, driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="routes-search-input"
          />
        </div>

        {/* Date Button */}
        <button type="button" className="btn-filter-date">
          <span>Date</span>
          <img src={dateIcon} alt="" className="filter-date-icon" />
        </button>

        {/* Vehicle Type Dropdown */}
        <div className="routes-select-wrap">
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="routes-filter-select"
          >
            <option value="all">Vehicle Type</option>
            <option value="truck">Refrigerated Truck</option>
            <option value="dry-box">Dry-box Truck</option>
            <option value="van">Van</option>
          </select>
        </div>

        {/* Route Status Dropdown */}
        <div className="routes-select-wrap">
          <select
            value={routeStatus}
            onChange={(e) => setRouteStatus(e.target.value)}
            className="routes-filter-select"
          >
            <option value="all">Route Status</option>
            <option value="planned">Planned</option>
            <option value="loading">Loading</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="routes-select-wrap">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="routes-filter-select"
          >
            <option value="all">Brand</option>
            <option value="fresh">Waypoint Fresh</option>
            <option value="style">Waypoint Style</option>
            <option value="tech">Waypoint Tech</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          className="btn-routes-clear"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
