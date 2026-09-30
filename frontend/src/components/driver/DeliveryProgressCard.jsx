export default function DeliveryProgressCard({
  completedStops = 4,
  totalStops = 8,
  currentStopNumber = '05',
}) {
  const percentage = Math.round((completedStops / totalStops) * 100)
  const remaining = totalStops - completedStops

  return (
    <div className="driver-card delivery-progress-card">
      {/* Header */}
      <div className="driver-card-header">
        <h3 className="driver-card-title">Delivery Progress</h3>
      </div>

      {/* Main Count & Percentage */}
      <div className="delivery-progress-body">
        <div className="delivery-count-headline">
          {String(completedStops).padStart(2, '0')} / {String(totalStops).padStart(2, '0')} Stops Completed
        </div>
        <div className="delivery-percent-text">
          {percentage}% Completed
        </div>

        {/* Progress Bar Track */}
        <div className="driver-progress-bar-track">
          <div
            className="driver-progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Bottom Legend Row */}
        <div className="delivery-progress-footer">
          <div className="progress-footer-col left">
            <span className="stat-line">COMPLETED: {completedStops}</span>
            <span className="stat-line">TOTAL STOPS: {totalStops}</span>
          </div>

          <div className="progress-footer-col right">
            <span className="stat-line">REMAINING: {remaining}</span>
            <span className="stat-line current-highlight">CURRENT STOP: #{currentStopNumber}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
