import { useNavigate } from 'react-router-dom'

export default function LiveEmptyStateCard() {
  const navigate = useNavigate()

  return (
    <div className="live-empty-state-card">
      <div className="empty-state-antenna-circle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
          <path d="M7.76 7.76a6 6 0 0 1 8.48 0" />
          <circle cx="12" cy="12" r="2" />
          <path d="M12 14v8" />
        </svg>
      </div>

      <h3 className="empty-state-title">No Active Deliveries</h3>
      <p className="empty-state-desc">
        There are currently no active delivery trips to monitor.
      </p>

      <button
        type="button"
        className="btn-view-routes-blue"
        onClick={() => navigate('/dispatcher/routes')}
      >
        View Routes
      </button>

      <span className="empty-state-footer-tag">ASSOCIATED EMPTY STATE</span>
    </div>
  )
}
