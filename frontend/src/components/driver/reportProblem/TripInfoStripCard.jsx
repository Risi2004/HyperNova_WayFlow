export default function TripInfoStripCard({
  tripId = 'TR-024',
  route = 'Peliyagoda → Colombo South',
  vehicle = 'WP-REF-007',
  stop = '05 of 08',
  currentOutlet = 'Metro Grocers OUT043',
}) {
  return (
    <div className="trip-info-strip-card">
      <div className="strip-info-col">
        <span className="strip-info-label">TRIP ID</span>
        <span className="strip-info-val bold">{tripId}</span>
      </div>

      <div className="strip-info-col">
        <span className="strip-info-label">ROUTE</span>
        <span className="strip-info-val">{route}</span>
      </div>

      <div className="strip-info-col">
        <span className="strip-info-label">VEHICLE</span>
        <span className="strip-info-val">{vehicle}</span>
      </div>

      <div className="strip-info-col">
        <span className="strip-info-label">STOP</span>
        <span className="strip-info-val">{stop}</span>
      </div>

      <div className="strip-info-col outlet-col">
        <span className="strip-info-label">CURRENT OUTLET</span>
        <span className="strip-info-val outlet-bold">{currentOutlet}</span>
      </div>
    </div>
  )
}
