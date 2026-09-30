import { Link } from 'react-router-dom'

export default function RouteSummaryCard({ routeId = 'TR-024' }) {
  const summaryFields = [
    { label: 'Route ID', value: routeId, isLink: true, to: `/dispatcher/routes/${routeId}` },
    { label: 'Status', value: 'Planned' },
    { label: 'Depot', value: 'Peliyagoda Distribution Center' },
    { label: 'Vehicle', value: 'WP-CB-4521' },
    { label: 'Vehicle Type', value: 'Refrigerated Truck' },
    { label: 'Driver', value: 'K. Perera' },
    { label: 'Trip', value: '1 of 2' },
    { label: 'Departure', value: '05:30 AM' },
    { label: 'Estimated Completion', value: '10:45 AM' },
    { label: 'Total Stops', value: '8' },
    { label: 'Distance', value: '94 km' },
    { label: 'Estimated Duration', value: '5h 15m' },
  ]

  return (
    <div className="route-card route-summary-card">
      <div className="route-card-header">
        <h2 className="route-card-title">Route Summary</h2>
        <p className="route-card-subtitle">Assignment, timing, and route totals</p>
      </div>

      <div className="route-summary-grid">
        {summaryFields.map((field, idx) => (
          <div key={idx} className="summary-field-cell">
            <span className="summary-field-label">{field.label}</span>
            {field.isLink ? (
              <Link to={field.to} className="summary-field-value blue-link">
                {field.value}
              </Link>
            ) : (
              <span className="summary-field-value">{field.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
