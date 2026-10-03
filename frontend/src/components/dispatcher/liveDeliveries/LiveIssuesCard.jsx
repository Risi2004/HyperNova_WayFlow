import { useEffect, useState } from 'react'
import { issueService } from '../../../services/issueService'
import { formatTimestamp } from '../../../utils/orderFormat'

const STATUS_LABEL = { open: 'Open', in_progress: 'In progress', resolved: 'Resolved' }

// Issues raised by drivers and store managers for the selected delivery date, with resolve actions.
export default function LiveIssuesCard({ date, reloadKey, onChanged, onSelectTrip }) {
  const [showResolved, setShowResolved] = useState(false)
  const [issues, setIssues] = useState(null)
  const [error, setError] = useState(null)
  const [resolving, setResolving] = useState(null)
  const [notes, setNotes] = useState('')
  const [closeDispute, setCloseDispute] = useState(true)
  const [busy, setBusy] = useState(false)
  const [photos, setPhotos] = useState({})

  useEffect(() => {
    let active = true
    issueService
      .list({ date, status: showResolved ? 'all' : 'unresolved' })
      .then((res) => {
        if (!active) return
        setIssues(res.issues)
        setError(null)
      })
      .catch((err) => active && setError(err.message))
    return () => {
      active = false
    }
  }, [date, showResolved, reloadKey])

  const update = async (issue, payload) => {
    setBusy(true)
    setError(null)
    try {
      await issueService.update(issue.issue_id, payload)
      setResolving(null)
      setNotes('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const loadPhoto = async (issueId) => {
    try {
      const res = await issueService.photo(issueId)
      setPhotos((p) => ({ ...p, [issueId]: res.photo }))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="live-table-card" aria-label="Reported issues">
      <div className="live-table-top-header">
        <div className="table-header-left">
          <h2 className="live-table-title">Reported Issues</h2>
          <p className="live-table-subtitle">From drivers on the road and store managers at receipt</p>
        </div>
        <label className="live-issues-toggle">
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Show resolved
        </label>
      </div>

      {error && <p className="live-page-state error">{error}</p>}
      {!issues && !error && <p className="live-page-state">Loading issues…</p>}
      {issues?.length === 0 && <p className="live-page-state">No {showResolved ? '' : 'open '}issues for this date.</p>}

      <ul className="live-issues-list">
        {issues?.map((i) => (
          <li key={i.issue_id} className={`live-issue live-issue-${i.severity}`}>
            <div className="live-issue-head">
              <span className="bold">#{i.issue_id} · {i.issue_category}</span>
              <span className={`status-pill-badge pill-${i.resolution_status === 'resolved' ? 'completed' : i.severity === 'high' ? 'problem' : 'delayed'}`}>
                <span className="dot"></span>
                {STATUS_LABEL[i.resolution_status] || i.resolution_status}
              </span>
            </div>
            <p className="live-issue-desc">{i.description}</p>
            <p className="status-reason-subtext">
              {i.reported_by || i.reported_by_role} ({i.reported_by_role}) · {formatTimestamp(i.reported_at).date} {formatTimestamp(i.reported_at).time}
              {i.order_id && ` · ${i.order_id} (${i.order_status})`}
              {i.outlet_id && ` · ${i.outlet_id}${i.district ? ` ${i.district}` : ''}`}
              {i.resolution_notes && ` · Resolution: ${i.resolution_notes}`}
            </p>
            {photos[i.issue_id] && <img className="live-issue-photo" src={photos[i.issue_id]} alt={`Photo for issue ${i.issue_id}`} />}

            <div className="live-issue-actions">
              {i.trip_id && (
                <button type="button" className="live-view-link" onClick={() => onSelectTrip(i.trip_id)}>
                  View trip {i.trip_id}
                </button>
              )}
              {i.has_photo && !photos[i.issue_id] && (
                <button type="button" className="live-view-link" onClick={() => loadPhoto(i.issue_id)}>
                  View photo
                </button>
              )}
              {i.resolution_status === 'open' && (
                <button type="button" className="live-view-link" disabled={busy} onClick={() => update(i, { status: 'in_progress' })}>
                  Mark in progress
                </button>
              )}
              {i.resolution_status !== 'resolved' && resolving !== i.issue_id && (
                <button type="button" className="live-view-link" onClick={() => { setResolving(i.issue_id); setNotes(''); setCloseDispute(true) }}>
                  Resolve…
                </button>
              )}
            </div>

            {resolving === i.issue_id && (
              <form
                className="live-resolve-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  update(i, { status: 'resolved', resolution_notes: notes, close_dispute: i.order_status === 'disputed' && closeDispute })
                }}
              >
                <label htmlFor={`resolve-${i.issue_id}`}>How was it resolved?</label>
                <textarea id={`resolve-${i.issue_id}`} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Credit note raised; missing cases added to tomorrow's delivery" />
                {i.order_status === 'disputed' && (
                  <label className="live-issues-toggle">
                    <input type="checkbox" checked={closeDispute} onChange={(e) => setCloseDispute(e.target.checked)} /> Close the receipt dispute (order becomes Received)
                  </label>
                )}
                <div className="live-issue-actions">
                  <button type="submit" className="btn-live-refresh" disabled={busy || !notes.trim()}>
                    Save resolution
                  </button>
                  <button type="button" className="btn-clear-live-filters" onClick={() => setResolving(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
