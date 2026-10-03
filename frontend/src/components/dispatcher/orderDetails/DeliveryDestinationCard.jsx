import DeliveryMap from './DeliveryMap'
import { formatWindow, outletLabel } from '../../../utils/orderFormat'

const DOCK_LABELS = { rear_dock: 'Rear loading dock', street: 'Curbside unloading', mall_bay: 'Shared mall loading bay' }

export default function DeliveryDestinationCard({ order, outlet }) {
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
          <h3 className="destination-name">{outletLabel(order)}</h3>
          <span className="destination-address">
            {order.district} District • {DOCK_LABELS[order.dock_type] || order.dock_type} • served from {order.depot}
          </span>
        </div>
      </div>

      {/* Contact details row */}
      <div className="destination-contacts-grid">
        <div className="contact-item">
          <span className="contact-label">Contact Person</span>
          <span className="contact-value">{outlet?.manager_name || 'Store Manager'}</span>
        </div>
        <div className="contact-item">
          <span className="contact-label">Contact Number</span>
          <span className="contact-value">{outlet?.manager_phone || '—'}</span>
        </div>
        <div className="contact-item">
          <span className="contact-label">Delivery Window</span>
          <span className="contact-value value-green">{formatWindow(order.requested_window_open, order.requested_window_close)}</span>
        </div>
      </div>

      {/* Interactive React Leaflet Map */}
      <DeliveryMap depot={order.depot} district={order.district} outletLabel={`${order.outlet_id} • ${order.district}`} />
    </div>
  )
}
