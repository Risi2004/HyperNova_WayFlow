export default function ReportIssueMetaBar({
  loadId = 'LD-025',
  vehicle = 'WP-REF-007 (Refrigerated Truck)',
  route = 'Peliyagoda → Colombo South (5 Stops)',
  departure = '06:00 AM Today',
  progress = '15 / 25 Items Loaded (60%)',
  status = 'LOADING',
}) {
  return (
    <div className="report-issue-meta-bar">
      <div className="report-meta-col">
        <span className="report-meta-label">ACTIVE LOAD</span>
        <span className="report-meta-val bold">{loadId}</span>
      </div>

      <div className="report-meta-col">
        <span className="report-meta-label">VEHICLE & TYPE</span>
        <span className="report-meta-val">{vehicle}</span>
      </div>

      <div className="report-meta-col">
        <span className="report-meta-label">ROUTE PROFILE</span>
        <span className="report-meta-val">{route}</span>
      </div>

      <div className="report-meta-col">
        <span className="report-meta-label">DEPARTURE</span>
        <span className="report-meta-val departure-amber">{departure}</span>
      </div>

      <div className="report-meta-col progress-col">
        <span className="report-meta-label">VERIFICATION PROGRESS</span>
        <div className="report-progress-pill-group">
          <span className="report-progress-text">{progress}</span>
          <span className="report-status-badge badge-loading">{status}</span>
        </div>
      </div>
    </div>
  )
}
