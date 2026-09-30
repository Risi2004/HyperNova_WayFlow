import { useNavigate } from 'react-router-dom'

export default function LoadBottomBar({
  loadId = 'LD-025',
  status = 'LOADING',
  loadedCount = 3,
  totalCount = 5,
  onReportIssue,
  onContinueLoading,
}) {
  const navigate = useNavigate()

  return (
    <div className="load-bottom-sticky-bar">
      <div className="bottom-bar-inner">
        {/* Left: Load status info */}
        <div className="bottom-bar-left">
          <span className="bottom-status-prefix">{loadId} Status:</span>
          <span className="bottom-status-pill badge-loading">{status}</span>
          <span className="bottom-loaded-fraction">
            {loadedCount} / {totalCount} Loaded
          </span>
        </div>

        {/* Right: Actions */}
        <div className="bottom-bar-right">
          <button
            type="button"
            className="btn-bottom-back"
            onClick={() => navigate('/loader/today-loads')}
          >
            ← Back to Today's Loads
          </button>
          <button
            type="button"
            className="btn-bottom-report"
            onClick={onReportIssue}
          >
            Report Loading Issue
          </button>
          <button
            type="button"
            className="btn-bottom-continue"
            onClick={onContinueLoading}
          >
            Continue Loading
          </button>
        </div>
      </div>
    </div>
  )
}
