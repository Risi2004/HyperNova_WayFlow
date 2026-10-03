import { Link } from 'react-router-dom'
import attentionIcon from '../../../assets/icons/attention.svg'

export default function NeedsAttentionCard({ issues = [] }) {
  return (
    <div className="dashboard-card attention-card">
      <div className="card-header-row">
        <div className="attention-header-left">
          <img src={attentionIcon} alt="" className="attention-header-icon" aria-hidden="true" />
          <h2 className="card-heading">Needs Attention</h2>
        </div>
        <span className="attention-badge-count">{issues.length} ISSUE{issues.length === 1 ? '' : 'S'}</span>
      </div>

      <ul className="attention-list">
        {issues.length === 0 && (
          <li className="attention-item">
            <span className="attention-text">Nothing needs attention right now.</span>
          </li>
        )}
        {issues.map((item) => (
          <li key={item.id} className="attention-item">
            <div className="attention-item-left">
              <span className="attention-dot" style={{ backgroundColor: item.dotColor }} />
              <span className="attention-text">{item.text}</span>
            </div>
            <Link to={item.to} className="attention-action-link">
              {item.action}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
