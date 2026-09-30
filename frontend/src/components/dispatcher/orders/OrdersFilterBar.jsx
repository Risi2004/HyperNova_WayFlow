import { useState } from 'react'
import searchIcon from '../../../assets/icons/search.svg'

export default function OrdersFilterBar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedRequirement,
  setSelectedRequirement,
  onClearFilters,
}) {
  return (
    <div className="orders-filter-container">
      {/* Row 1 */}
      <div className="filter-row">
        {/* Search Input */}
        <div className="filter-search-box">
          <img src={searchIcon} alt="" className="filter-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search order ID, outlet, or store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Status</label>
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending Planning</option>
            <option value="planned">Planned</option>
            <option value="loading">Loading</option>
            <option value="deferred">Deferred</option>
            <option value="exception">Exception</option>
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Brand</label>
          <select className="filter-select" defaultValue="all">
            <option value="all">All brands</option>
            <option value="fresh">Fresh</option>
            <option value="style">Style</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        {/* Depot Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Depot</label>
          <select className="filter-select" defaultValue="all">
            <option value="all">All depots</option>
            <option value="west">West Hub</option>
            <option value="central">Central Hub</option>
            <option value="east">East Hub</option>
          </select>
        </div>

        {/* Delivery Date */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Delivery Date</label>
          <select className="filter-select" defaultValue="26-sep">
            <option value="26-sep">26 Sep 2026</option>
            <option value="27-sep">27 Sep 2026</option>
            <option value="28-sep">28 Sep 2026</option>
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="filter-row filter-row-secondary">
        {/* Delivery Window */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Delivery Window</label>
          <select className="filter-select" defaultValue="any">
            <option value="any">Any window</option>
            <option value="morning">Morning (09:00 - 12:00)</option>
            <option value="afternoon">Afternoon (12:00 - 16:00)</option>
          </select>
        </div>

        {/* Priority */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Priority</label>
          <select className="filter-select" defaultValue="all">
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Special Requirement Toggle Pills */}
        <div className="filter-requirements-group">
          <label className="filter-select-label">Special Requirement</label>
          <div className="requirement-pills-track">
            <button
              type="button"
              className={`requirement-pill ${selectedRequirement === 'Refrigerated' ? 'active-refrigerated' : ''}`}
              onClick={() => setSelectedRequirement(selectedRequirement === 'Refrigerated' ? 'all' : 'Refrigerated')}
            >
              Refrigerated
            </button>
            <button
              type="button"
              className={`requirement-pill ${selectedRequirement === 'Van Only' ? 'active-van' : ''}`}
              onClick={() => setSelectedRequirement(selectedRequirement === 'Van Only' ? 'all' : 'Van Only')}
            >
              Van Only
            </button>
            <button
              type="button"
              className={`requirement-pill ${selectedRequirement === 'Standard' ? 'active-standard' : ''}`}
              onClick={() => setSelectedRequirement(selectedRequirement === 'Standard' ? 'all' : 'Standard')}
            >
              Standard
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        <button
          type="button"
          className="clear-filters-btn"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
