import searchIcon from '../../../assets/icons/search.svg'

export default function RoutesBottomCards({ onClearFilters, onViewRoute }) {
  return (
    <div className="routes-bottom-cards-grid">
      {/* Left Card: Tablet-friendly Route Layout */}
      <div className="tablet-route-card">
        <div className="tablet-card-top-bar">
          <div className="tablet-title-wrap">
            <span className="tablet-heading">Card view</span>
            <span className="tablet-sub">Tablet-friendly route layout</span>
          </div>
          <span className="badge-tablet-status">
            <span className="bullet-dot">â€¢</span>
            <span>PLANNED</span>
          </span>
        </div>

        <h3 className="tablet-route-id">RTE-2026-041</h3>

        <div className="tablet-meta-three-col">
          <div className="tablet-meta-col">
            <span className="tablet-label">DEPOT</span>
            <span className="tablet-val">Peliyagoda</span>
          </div>

          <div className="tablet-meta-col">
            <span className="tablet-label">VEHICLE</span>
            <span className="tablet-val">WP-CA-2847</span>
          </div>

          <div className="tablet-meta-col">
            <span className="tablet-label">DRIVER</span>
            <span className="tablet-val">Assigned Driver</span>
          </div>
        </div>

        <div className="tablet-stats-four-row">
          <div className="tablet-stat-item">
            <span className="stat-sm-label">TRIP</span>
            <span className="stat-sm-val">1 / 2</span>
          </div>

          <div className="tablet-stat-item">
            <span className="stat-sm-label">STOPS</span>
            <span className="stat-sm-val">5 stops</span>
          </div>

          <div className="tablet-stat-item">
            <span className="stat-sm-label">DISTANCE</span>
            <span className="stat-sm-val">68 km</span>
          </div>

          <div className="tablet-stat-item">
            <span className="stat-sm-label">DURATION</span>
            <span className="stat-sm-val">8h 15m</span>
          </div>
        </div>

        <div className="tablet-card-footer">
          <div className="ready-loading-status">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Ready for Loading â€¢ 06:30 AM</span>
          </div>

          <button
            type="button"
            className="btn-tablet-view-route"
            onClick={() => onViewRoute && onViewRoute('RTE-2026-041')}
          >
            View Route
          </button>
        </div>
      </div>

      {/* Right Card: No Routes Found Empty State Demo */}
      <div className="routes-empty-state-card">
        <div className="empty-icon-circle">
          <img src={searchIcon} alt="" className="empty-search-icon" />
        </div>
        <h4 className="empty-state-title">No routes found</h4>
        <p className="empty-state-desc">
          Try changing your filters or selecting another date.
        </p>
        <button
          type="button"
          className="btn-empty-clear-filters"
          onClick={onClearFilters}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          <span>Clear Filters</span>
        </button>
      </div>
    </div>
  )
}
