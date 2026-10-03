import searchIcon from '../../../assets/icons/search.svg'
import { formatShortDate } from '../../../utils/orderFormat'

const REQUIREMENTS = [
  { value: 'refrigerated', label: 'Refrigerated', activeClass: 'active-refrigerated' },
  { value: 'van', label: 'Van Only', activeClass: 'active-van' },
  { value: 'mall', label: 'Mall Window', activeClass: 'active-van' },
  { value: 'standard', label: 'Standard', activeClass: 'active-standard' },
]

export default function OrdersFilterBar({ filters, dateOptions = [], onChange, onClearFilters }) {
  const select = (key) => ({
    className: 'filter-select',
    value: filters[key],
    onChange: (e) => onChange(key, e.target.value),
  })

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
            placeholder="Search order ID, outlet ID, district or brand..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Status</label>
          <select {...select('status')}>
            <option value="all">All statuses</option>
            <option value="pending">Pending Planning</option>
            <option value="planned">Planned</option>
            <option value="loading">Loading</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
            <option value="deferred">Deferred</option>
            <option value="exception">Exception</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Brand</label>
          <select {...select('brand')}>
            <option value="all">All brands</option>
            <option value="fresh">Fresh</option>
            <option value="style">Style</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        {/* Depot Dropdown */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Depot</label>
          <select {...select('depot')}>
            <option value="all">All depots</option>
            <option value="peliyagoda">Peliyagoda DC</option>
            <option value="kandy">Kandy Hub</option>
          </select>
        </div>

        {/* Delivery Date */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Delivery Date</label>
          <select {...select('date')}>
            <option value="all">All dates</option>
            {dateOptions.map((d) => (
              <option key={d} value={d}>
                {formatShortDate(d)} {d.slice(0, 4)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 */}
      <div className="filter-row filter-row-secondary">
        {/* Delivery Window */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Delivery Window</label>
          <select {...select('window')}>
            <option value="any">Any window</option>
            <option value="early">Before 08:00</option>
            <option value="morning">08:00 - 12:00</option>
            <option value="afternoon">From 12:00</option>
          </select>
        </div>

        {/* Priority */}
        <div className="filter-select-wrapper">
          <label className="filter-select-label">Priority</label>
          <select {...select('priority')}>
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        {/* Special Requirement Toggle Pills */}
        <div className="filter-requirements-group">
          <label className="filter-select-label">Special Requirement</label>
          <div className="requirement-pills-track">
            {REQUIREMENTS.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`requirement-pill ${filters.requirement === r.value ? r.activeClass : ''}`}
                onClick={() => onChange('requirement', filters.requirement === r.value ? 'all' : r.value)}
              >
                {r.label}
              </button>
            ))}
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
