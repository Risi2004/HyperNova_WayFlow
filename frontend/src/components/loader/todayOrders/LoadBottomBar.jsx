import { useNavigate } from 'react-router-dom'

export default function LoadBottomBar({
  loadId,
  status,
  statusType = 'loading',
  loadedCount = 0,
  totalCount = 0,
  actionLabel,
  actionDisabled = false,
  canEdit = true,
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
          <span className={`bottom-status-pill badge-${statusType}`}>{status}</span>
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
          {canEdit && (
            <button
              type="button"
              className="btn-bottom-report"
              onClick={onReportIssue}
            >
              Report Loading Issue
            </button>
          )}
          {actionLabel && (
            <button
              type="button"
              className="btn-bottom-continue"
              onClick={onContinueLoading}
              disabled={actionDisabled}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
