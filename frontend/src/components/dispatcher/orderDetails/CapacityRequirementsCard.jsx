import weightIcon from '../../../assets/icons/weight.svg'
import volumeIcon from '../../../assets/icons/volume.svg'

export default function CapacityRequirementsCard({ weight = '420 kg', volume = '3.8 mÂ³' }) {
  return (
    <div className="order-details-card capacity-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Capacity Requirements</h2>
        <span className="details-card-subtitle">Load baseline for vehicle selection</span>
      </div>

      <div className="capacity-blocks-grid">
        {/* Total Weight */}
        <div className="capacity-metric-box">
          <div className="capacity-metric-header">
            <img src={weightIcon} alt="" className="capacity-icon" aria-hidden="true" />
            <span className="capacity-metric-label">Total Weight</span>
          </div>
          <div className="capacity-metric-value">{weight}</div>
          <span className="capacity-req-text">Weight requirement {weight}</span>
          <div className="capacity-progress-track">
            <div className="capacity-progress-fill" style={{ width: '48%' }} />
          </div>
          <span className="capacity-footnote">Requirement baseline for vehicle comparison</span>
        </div>

        {/* Total Volume */}
        <div className="capacity-metric-box">
          <div className="capacity-metric-header">
            <img src={volumeIcon} alt="" className="capacity-icon" aria-hidden="true" />
            <span className="capacity-metric-label">Total Volume</span>
          </div>
          <div className="capacity-metric-value">{volume}</div>
          <span className="capacity-req-text">Volume requirement {volume}</span>
          <div className="capacity-progress-track">
            <div className="capacity-progress-fill" style={{ width: '38%' }} />
          </div>
          <span className="capacity-footnote">Requirement baseline for vehicle comparison</span>
        </div>
      </div>
    </div>
  )
}
