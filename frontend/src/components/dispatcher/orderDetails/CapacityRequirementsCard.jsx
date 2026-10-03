import weightIcon from '../../../assets/icons/weight.svg'
import volumeIcon from '../../../assets/icons/volume.svg'

// Bars show the share of the assigned vehicle's capacity, or of the smallest van when unplanned.
export default function CapacityRequirementsCard({ weightKg = 0, volumeM3 = 0, weightCapKg, volumeCapM3, capLabel }) {
  const weight = `${Number(weightKg).toLocaleString()} kg`
  const volume = `${Number(volumeM3)} m³`
  const pct = (value, cap) => (cap ? Math.min(100, Math.round((Number(value) / Number(cap)) * 100)) : 0)
  const weightPct = pct(weightKg, weightCapKg)
  const volumePct = pct(volumeM3, volumeCapM3)

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
            <div className="capacity-progress-fill" style={{ width: `${weightPct}%` }} />
          </div>
          <span className="capacity-footnote">
            {capLabel ? `${weightPct}% of ${capLabel} weight limit` : 'No vehicle assigned yet'}
          </span>
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
            <div className="capacity-progress-fill" style={{ width: `${volumePct}%` }} />
          </div>
          <span className="capacity-footnote">
            {capLabel ? `${volumePct}% of ${capLabel} volume limit` : 'No vehicle assigned yet'}
          </span>
        </div>
      </div>
    </div>
  )
}
