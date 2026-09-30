import DeliveryMap from './DeliveryMap'

export default function DeliveryDestinationCard() {
  return (
    <div className="order-details-card destination-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Delivery Destination</h2>
        <span className="details-card-subtitle">Confirmed outlet and delivery contact</span>
      </div>

      {/* Outlet details header */}
      <div className="destination-outlet-block">
        <div className="destination-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="destination-meta">
          <h3 className="destination-name">Waypoint Fresh â€“ Colombo 03</h3>
          <span className="destination-address">123 Example Street, Colombo 03</span>
        </div>
      </div>

      {/* Contact details row */}
      <div className="destination-contacts-grid">
        <div className="contact-item">
          <span className="contact-label">Contact Person</span>
          <span className="contact-value">Store Manager</span>
        </div>
        <div className="contact-item">
          <span className="contact-label">Contact Number</span>
          <span className="contact-value">+94 XX XXX XXXX</span>
        </div>
        <div className="contact-item">
          <span className="contact-label">Delivery Window</span>
          <span className="contact-value value-green">10:00 AM â€“ 12:00 PM</span>
        </div>
      </div>

      {/* Interactive React Leaflet Map */}
      <DeliveryMap />
    </div>
  )
}
