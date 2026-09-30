export default function RouteStopsListCard({
  stops = [
    {
      id: 1,
      stopNumber: '01',
      name: 'WayFlow Fresh',
      orderCode: 'OUT039',
      location: 'Colombo 01',
      deliveryWindow: '08:00 AM - 08:30 AM',
      status: 'completed',
    },
    {
      id: 2,
      stopNumber: '02',
      name: 'City Market',
      orderCode: 'OUT040',
      location: 'Colombo 02',
      deliveryWindow: '08:45 AM - 09:15 AM',
      status: 'completed',
    },
    {
      id: 3,
      stopNumber: '03',
      name: 'Green Basket',
      orderCode: 'OUT041',
      location: 'Colombo 03',
      deliveryWindow: '09:30 AM - 10:00 AM',
      status: 'completed',
    },
    {
      id: 4,
      stopNumber: '04',
      name: 'WayFlow Fresh',
      orderCode: 'OUT042',
      location: 'Colombo 04',
      deliveryWindow: '10:15 AM - 10:45 AM',
      status: 'completed',
    },
    {
      id: 5,
      stopNumber: '05',
      name: 'Metro Grocers',
      orderCode: 'OUT043',
      location: 'Colombo 05',
      deliveryWindow: '11:00 AM - 11:30 AM',
      status: 'current',
    },
    {
      id: 6,
      stopNumber: '06',
      name: 'Fresh Corner',
      orderCode: 'OUT044',
      location: 'Colombo 06',
      deliveryWindow: '11:45 AM - 12:15 PM',
      status: 'scheduled',
    },
    {
      id: 7,
      stopNumber: '07',
      name: 'Daily Mart',
      orderCode: 'OUT045',
      location: 'Colombo 07',
      deliveryWindow: '12:30 PM - 01:00 PM',
      status: 'scheduled',
    },
    {
      id: 8,
      stopNumber: '08',
      name: 'City Grocers',
      orderCode: 'OUT046',
      location: 'Colombo 08',
      deliveryWindow: '01:15 PM - 01:45 PM',
      status: 'scheduled',
    },
  ],
  onViewStopDetails,
}) {
  return (
    <div className="route-stops-details-card">
      <h3 className="route-stops-card-title">Delivery Route & Stop Details</h3>

      <div className="stops-items-vertical-list">
        {stops.map((stop) => {
          const isCompleted = stop.status === 'completed'
          const isCurrent = stop.status === 'current'
          const isScheduled = stop.status === 'scheduled'

          return (
            <div
              key={stop.id}
              className={`route-stop-row-item ${isCurrent ? 'current-stop-highlight-row' : ''}`}
            >
              {/* Left Indicator (Checkmark or Number Circle) */}
              <div className="stop-indicator-col">
                {isCompleted && (
                  <div className="circle-check-green">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}

                {isCurrent && (
                  <div className="circle-number-blue">
                    {stop.stopNumber}
                  </div>
                )}

                {isScheduled && (
                  <div className="circle-number-grey">
                    {stop.stopNumber}
                  </div>
                )}
              </div>

              {/* Center Details Column */}
              <div className="stop-details-col">
                <div className="stop-title-tag-row">
                  <span className="stop-customer-name">
                    {stop.name} <span className="stop-order-tag">({stop.orderCode})</span>
                  </span>
                  {isCurrent && (
                    <span className="current-stop-badge-pill">Current Stop</span>
                  )}
                </div>

                <div className="stop-meta-line location">{stop.location}</div>
                <div className={`stop-meta-line window ${isCurrent ? 'window-current-amber' : ''}`}>
                  Delivery Window: {stop.deliveryWindow}
                </div>
              </div>

              {/* Right Action / Status Column */}
              <div className="stop-right-action-col">
                {isCompleted && (
                  <span className="pill-badge-completed">
                    Completed ✓
                  </span>
                )}

                {isCurrent && (
                  <button
                    type="button"
                    className="btn-view-current-stop-action"
                    onClick={() => onViewStopDetails && onViewStopDetails(stop)}
                  >
                    View Stop Details
                  </button>
                )}

                {isScheduled && (
                  <span className="text-scheduled-status">
                    Scheduled
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
