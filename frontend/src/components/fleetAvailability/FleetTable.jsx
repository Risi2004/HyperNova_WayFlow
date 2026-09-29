import { useState } from 'react'
import moreIcon from '../../assets/icons/more.svg'

export default function FleetTable({ vehicles = [] }) {
  const [selectedIds, setSelectedIds] = useState(['WP-CA-2847'])
  const [currentPage, setCurrentPage] = useState(1)

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === vehicles.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(vehicles.map((v) => v.id))
    }
  }

  const isAllSelected = vehicles.length > 0 && selectedIds.length === vehicles.length

  return (
    <div className="fleet-table-container">
      {/* Table Header Bar */}
      <div className="fleet-table-top-bar">
        <div className="table-count-group">
          <h2 className="table-heading-title">All vehicles</h2>
          <span className="vehicles-total-count-badge">60</span>
        </div>
        <span className="table-sync-time">Updated 10:42 AM</span>
      </div>

      {/* Table Element */}
      <div className="fleet-table-responsive-wrapper">
        <table className="fleet-grid-table">
          <thead>
            <tr>
              <th className="th-select-box">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all vehicles"
                />
              </th>
              <th>VEHICLE ID</th>
              <th>VEHICLE TYPE</th>
              <th>DEPOT</th>
              <th>TEMPERATURE</th>
              <th>WEIGHT CAPACITY</th>
              <th>VOLUME CAPACITY</th>
              <th>FUEL</th>
              <th>TRIP STATUS</th>
              <th>CURRENT ASSIGNMENT</th>
              <th>AVAILABILITY</th>
              <th className="th-action-col"></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const isChecked = selectedIds.includes(v.id)

              return (
                <tr key={v.id} className={isChecked ? 'fleet-row-active' : ''}>
                  {/* Checkbox */}
                  <td className="td-select-box">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(v.id)}
                      aria-label={`Select vehicle ${v.id}`}
                    />
                  </td>

                  {/* Vehicle ID */}
                  <td className="td-vehicle-id">
                    <div className="vehicle-id-cell">
                      <span className="veh-code">{v.id}</span>
                      {isChecked && <span className="veh-selected-sub">Selected</span>}
                    </div>
                  </td>

                  {/* Vehicle Type */}
                  <td className="td-type">{v.type}</td>

                  {/* Depot */}
                  <td className="td-depot">{v.depot}</td>

                  {/* Temperature */}
                  <td className="td-temp">
                    <div className="temp-cell-wrap">
                      <div className="temp-primary-row">
                        {v.tempType === 'refrigerated' ? (
                          <span className="temp-icon-refrig">❄</span>
                        ) : (
                          <span className="temp-icon-ambient">📦</span>
                        )}
                        <span className="temp-name-text">{v.temp}</span>
                      </div>
                      <span className="temp-detail-sub">{v.tempDetail}</span>
                    </div>
                  </td>

                  {/* Weight Capacity */}
                  <td className="td-capacity">
                    <div className="capacity-cell-group">
                      <span className="cap-numbers-text">{v.weightText}</span>
                      <div className="table-meter-bar">
                        <div
                          className={`table-meter-fill ${v.weightPercent > 90 ? 'fill-warning' : ''}`}
                          style={{ width: `${v.weightPercent}%` }}
                        ></div>
                      </div>
                      <span className={`cap-percent-label ${v.weightPercent > 90 ? 'label-warning' : ''}`}>
                        {v.weightPercent}% used
                      </span>
                    </div>
                  </td>

                  {/* Volume Capacity */}
                  <td className="td-capacity">
                    <div className="capacity-cell-group">
                      <span className="cap-numbers-text">{v.volumeText}</span>
                      <div className="table-meter-bar">
                        <div
                          className={`table-meter-fill ${v.volumePercent > 90 ? 'fill-warning' : ''}`}
                          style={{ width: `${v.volumePercent}%` }}
                        ></div>
                      </div>
                      <span className={`cap-percent-label ${v.volumePercent > 90 ? 'label-warning' : ''}`}>
                        {v.volumePercent}% used
                      </span>
                    </div>
                  </td>

                  {/* Fuel */}
                  <td className="td-fuel">
                    <div className="fuel-cell-group">
                      <span className={`fuel-percent-text ${v.isFuelLow ? 'fuel-alert-critical' : ''}`}>
                        {v.fuelRemaining}
                      </span>
                      <span className="fuel-km-sub">{v.fuelKm}</span>
                    </div>
                  </td>

                  {/* Trip Status */}
                  <td className="td-trip-status">
                    <div className="trip-status-cell">
                      <span className="trip-status-main">{v.tripStatus}</span>
                      <span className="trip-sub-avail">{v.tripAvailText}</span>
                    </div>
                  </td>

                  {/* Current Assignment */}
                  <td className="td-assignment">
                    <div className="assignment-cell">
                      <span className="assign-title">{v.assignmentTitle}</span>
                      <span className="assign-sub">{v.assignmentSub}</span>
                    </div>
                  </td>

                  {/* Availability Badge */}
                  <td className="td-availability">
                    <span className={`avail-badge badge-${v.availability.toLowerCase().replace(/\s+/g, '-')}`}>
                      {v.availability}
                    </span>
                  </td>

                  {/* Action Col */}
                  <td className="td-action-col">
                    <button type="button" className="btn-table-more-action" title="More options">
                      <img src={moreIcon} alt="More" className="more-dots-icon" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="fleet-pagination-bar">
        <span className="showing-page-range">Showing 1–8 of 60 vehicles</span>
        <div className="fleet-pages-controls">
          <button
            type="button"
            className="pagination-nav-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="pagination-current-pill">1 of 8</span>
          <button
            type="button"
            className="pagination-nav-btn"
            disabled={currentPage === 8}
            onClick={() => setCurrentPage((p) => Math.min(8, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
