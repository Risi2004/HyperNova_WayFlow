export default function VehicleInfoCard({ vehicle }) {
  const fields = [
    { label: 'Vehicle ID', value: vehicle.id, bold: true },
    { label: 'Type', value: vehicle.type, bold: true },
    { label: 'Depot', value: vehicle.depot, bold: false },
    { label: 'Departure Time', value: vehicle.departureTime, bold: true },
    { label: 'Assigned Driver', value: vehicle.assignedDriver, bold: true },
    { label: 'Driver Contact', value: vehicle.driverContact, bold: false },
  ]

  return (
    <div className="loader-detail-card vehicle-info-card">
      <h3 className="detail-sidecard-title">Vehicle Information</h3>
      <div className="vehicle-info-list">
        {fields.map((f) => (
          <div key={f.label} className="vehicle-info-row">
            <span className="vehicle-info-label">{f.label}</span>
            <span className={`vehicle-info-value ${f.bold ? 'val-bold' : ''}`}>
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
