import weightIcon from '../../../assets/icons/weight.svg'
import volumeIcon from '../../../assets/icons/volume.svg'
import refrigeratedIcon from '../../../assets/icons/refrigerated.svg'

export default function FleetCapacityOverview() {
  return (
    <div className="fleet-capacity-card">
      <div className="capacity-card-header">
        <h3 className="capacity-overview-title">Fleet Capacity Overview</h3>
        <p className="capacity-overview-subtitle">Capacity currently available for new plans.</p>
      </div>

      <div className="capacity-metrics-four-grid">
        {/* Metric 1 */}
        <div className="capacity-metric-item">
          <div className="cap-item-header">
            <img src={weightIcon} alt="" className="cap-icon-blue" />
            <span className="cap-item-label">Available Weight Capacity</span>
          </div>
          <span className="cap-item-large-val">31.6 tonnes</span>
        </div>

        {/* Metric 2 */}
        <div className="capacity-metric-item">
          <div className="cap-item-header">
            <img src={volumeIcon} alt="" className="cap-icon-blue" />
            <span className="cap-item-label">Available Volume</span>
          </div>
          <span className="cap-item-large-val">218 m³</span>
        </div>

        {/* Metric 3 */}
        <div className="capacity-metric-item">
          <div className="cap-item-header">
            <img src={refrigeratedIcon} alt="" className="cap-icon-blue" />
            <span className="cap-item-label">Available Refrigerated Vehicles</span>
          </div>
          <span className="cap-item-large-val">6</span>
        </div>

        {/* Metric 4 */}
        <div className="capacity-metric-item">
          <div className="cap-item-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" className="cap-icon-blue">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="cap-item-label">Available Vans</span>
          </div>
          <span className="cap-item-large-val">3</span>
        </div>
      </div>
    </div>
  )
}
