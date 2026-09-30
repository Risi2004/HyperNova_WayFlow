import { useState } from 'react'
import searchIcon from '../../../assets/icons/search.svg'

export default function DeferredFilterBar({
  searchQuery,
  setSearchQuery,
  depotFilter,
  setDepotFilter,
  brandFilter,
  setBrandFilter,
  reasonFilter,
  setReasonFilter,
  windowFilter,
  setWindowFilter,
  nextRunFilter,
  setNextRunFilter,
  onClearFilters,
}) {
  return (
    <div className="deferred-filter-container">
      {/* Top Filter Row */}
      <div className="deferred-filter-row-top">
        {/* Search Order or Outlet */}
        <div className="deferred-filter-search-box">
          <svg
            className="deferred-filter-search-icon"
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
            placeholder="Search order, outlet, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="deferred-filter-search-input"
          />
        </div>

        {/* Date Selector */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Date</label>
          <select className="filter-select-input" defaultValue="26 Sep 2026">
            <option>26 Sep 2026</option>
            <option>27 Sep 2026</option>
            <option>28 Sep 2026</option>
          </select>
        </div>

        {/* Depot Selector */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Depot</label>
          <select
            className="filter-select-input"
            value={depotFilter}
            onChange={(e) => setDepotFilter(e.target.value)}
          >
            <option value="All">All depots</option>
            <option value="Peliyagoda">Peliyagoda</option>
            <option value="Kandy">Kandy</option>
          </select>
        </div>

        {/* Brand Selector */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Brand</label>
          <select
            className="filter-select-input"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="All">All brands</option>
            <option value="Waypoint Fresh">Waypoint Fresh</option>
            <option value="Waypoint Style">Waypoint Style</option>
            <option value="Waypoint Tech">Waypoint Tech</option>
          </select>
        </div>

        {/* Deferral Reason Selector */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Deferral Reason</label>
          <select
            className="filter-select-input"
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
          >
            <option value="All">All reasons</option>
            <option value="Insufficient Capacity">Insufficient Capacity</option>
            <option value="No Suitable Vehicle">No Suitable Vehicle</option>
            <option value="Delivery Window Conflict">Delivery Window Conflict</option>
            <option value="Vehicle Access Restriction">Vehicle Access Restriction</option>
            <option value="Fuel Quota Constraint">Fuel Quota Constraint</option>
          </select>
        </div>
      </div>

      {/* Bottom Filter Row */}
      <div className="deferred-filter-row-bottom">
        {/* Delivery Window */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Delivery Window</label>
          <select
            className="filter-select-input"
            value={windowFilter}
            onChange={(e) => setWindowFilter(e.target.value)}
          >
            <option value="All">Any window</option>
            <option value="05:30-08:00">05:30-08:00</option>
            <option value="07:00-08:00">07:00-08:00</option>
            <option value="08:00-09:00">08:00-09:00</option>
          </select>
        </div>

        {/* Next Run */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Next Run</label>
          <select
            className="filter-select-input"
            value={nextRunFilter}
            onChange={(e) => setNextRunFilter(e.target.value)}
          >
            <option value="All">Any run</option>
            <option value="Mon, 28 Sep">Mon, 28 Sep</option>
            <option value="Next available run">Next available run</option>
          </select>
        </div>

        {/* Status */}
        <div className="filter-select-wrap">
          <label className="filter-select-label">Status</label>
          <select className="filter-select-input" defaultValue="Deferred">
            <option value="Deferred">Deferred</option>
            <option value="All">All</option>
          </select>
        </div>

        {/* Advisory Note */}
        <div className="filter-advisory-hint">
          Reasons reflect validated planning constraints.
        </div>

        {/* Clear Filters Action */}
        <button
          type="button"
          className="btn-clear-deferred-filters"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
