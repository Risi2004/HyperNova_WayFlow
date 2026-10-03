import { DEFERRAL_REASONS, formatShortDate } from '../../../utils/orderFormat'

export default function DeferredFilterBar({
  options,
  searchQuery,
  setSearchQuery,
  depotFilter,
  setDepotFilter,
  brandFilter,
  setBrandFilter,
  reasonFilter,
  setReasonFilter,
  nextRunFilter,
  setNextRunFilter,
  onClearFilters,
}) {
  const select = (label, value, onChange, items) => (
    <div className="filter-select-wrap">
      <label className="filter-select-label">
        {label}
        <select className="filter-select-input" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="All">All</option>
          {items.map(([v, text]) => (
            <option key={v} value={v}>
              {text}
            </option>
          ))}
        </select>
      </label>
    </div>
  )

  return (
    <div className="deferred-filter-container">
      <div className="deferred-filter-row-top">
        <div className="deferred-filter-search-box">
          <svg className="deferred-filter-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search order, outlet, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="deferred-filter-search-input"
          />
        </div>

        {select('Depot', depotFilter, setDepotFilter, options.depots.map((d) => [d, d]))}
        {select('Brand', brandFilter, setBrandFilter, options.brands.map((b) => [b, `Waypoint ${b}`]))}
        {select('Reason', reasonFilter, setReasonFilter, options.reasons.map((r) => [r, DEFERRAL_REASONS[r] || r]))}
        {select('Next run', nextRunFilter, setNextRunFilter, options.nextRuns.map((d) => [d, formatShortDate(d)]))}

        <button type="button" className="btn-clear-deferred-filters" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}
