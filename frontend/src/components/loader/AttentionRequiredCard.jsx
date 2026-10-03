import { useNavigate } from 'react-router-dom'

export default function AttentionRequiredCard({ issue }) {
  const navigate = useNavigate()
  if (!issue) return null

  return (
    <div className="loader-card attention-alert-card">
      <div className="alert-card-top-row">
        <div className="alert-title-wrap">
          <svg
            className="alert-warning-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="alert-heading">Attention Required</span>
        </div>

        <span className="loader-status-badge badge-issue">
          <span className="status-badge-dot" />
          <span>ISSUE</span>
        </span>
      </div>

      <div className="alert-card-body-row">
        <div className="alert-content-meta">
          <span className="alert-vehicle-id bold">{issue.tripId} ({issue.vehicleId})</span>
          <p className="alert-message-text">
            {issue.message}
          </p>
        </div>

        <button
          type="button"
          className="btn-view-issue-solid"
          onClick={() => navigate(`/loader/today-orders/${issue.tripId}`)}
        >
          View Issue
        </button>
      </div>
    </div>
  )
}
