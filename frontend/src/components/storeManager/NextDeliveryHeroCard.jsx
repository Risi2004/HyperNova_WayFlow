import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom truck icon
const truckIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;
    background:#2563eb;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 2px 8px rgba(37,99,235,0.5);
    display:flex;align-items:center;justify-content:center;
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

// Custom store icon
const storeIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:30px;height:30px;
    background:#10b981;
    border:3px solid #fff;
    border-radius:8px;
    box-shadow:0 2px 8px rgba(16,185,129,0.5);
    display:flex;align-items:center;justify-content:center;
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

// Coordinates: truck at Havelock Road → store at Colombo 05
const TRUCK_POS = [6.8990, 79.8580]   // Havelock Road junction
const STORE_POS = [6.8916, 79.8619]   // Colombo 05 Store
const ROUTE_PATH = [
  [6.8990, 79.8580],
  [6.8970, 79.8590],
  [6.8950, 79.8600],
  [6.8930, 79.8610],
  [6.8916, 79.8619],
]

export default function NextDeliveryHeroCard({
  tripId = 'TR-024',
  dispatchRun = 'Dispatch Run #04',
  orderId = 'ORD-1042',
  destination = 'Colombo 05 Store',
  windowTime = '10:30 AM - 11:00 AM',
  vehicle = 'Refrigerated (WP-REF-007)',
  driverName = 'Marcus Vance',
  expectedArrival = '10:45 AM',
  etaMinutes = '32 min',
  currentLocation = 'Havelock Road junction',
  onTrackGPS,
  onContactDispatch,
  onViewManifest,
}) {
  return (
    <div className="sm-hero-card">
      {/* Top Header */}
      <div className="sm-hero-header">
        <div className="sm-hero-title-left">
          <div className="sm-hero-title-row">
            <span className="sm-blue-dot" />
            <h2 className="sm-hero-title">Next Delivery</h2>
            <span className="sm-status-in-transit-pill">IN TRANSIT</span>
          </div>
          <span className="sm-hero-sub">Trip {tripId} &bull; {dispatchRun}</span>
        </div>

        <button
          type="button"
          className="btn-view-manifest-link"
          onClick={onViewManifest}
        >
          <span>View Full Manifest</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>

      {/* 3 Columns Section */}
      <div className="sm-hero-three-cols">
        {/* Col 1: Target Order & Details */}
        <div className="sm-hero-details-col">
          <div className="sm-detail-pair">
            <span className="sm-detail-label">TARGET ORDER</span>
            <span className="sm-detail-value order-link">{orderId}</span>
          </div>

          <div className="sm-detail-pair">
            <span className="sm-detail-label">DESTINATION</span>
            <span className="sm-detail-value">{destination}</span>
          </div>

          <div className="sm-detail-pair">
            <span className="sm-detail-label">WINDOW</span>
            <span className="sm-detail-value">{windowTime}</span>
          </div>

          <div className="sm-detail-pair">
            <span className="sm-detail-label">Vehicle</span>
            <span className="sm-detail-value">{vehicle}</span>
          </div>

          <div className="sm-detail-pair">
            <span className="sm-detail-label">Assigned Driver</span>
            <span className="sm-detail-value driver-name">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{driverName}</span>
            </span>
          </div>
        </div>

        {/* Col 2: Expected Arrival Box */}
        <div className="sm-hero-arrival-box">
          <span className="sm-arrival-label">EXPECTED ARRIVAL</span>
          <div className="sm-arrival-time-big">{expectedArrival}</div>
          <div className="sm-eta-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>ETA in {etaMinutes}</span>
          </div>
          <span className="sm-arrival-location-sub">
            Current location: {currentLocation}
          </span>
        </div>

        {/* Col 3: Map / GPS Actions */}
        <div className="sm-hero-gps-box">
          <div className="sm-map-preview-window" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', height: 170 }}>
            {/* Live GPS Badge overlaid on top of map */}
            <div className="sm-live-gps-badge" style={{ position: 'absolute', top: 8, left: 8, zIndex: 1000 }}>
              <span className="live-dot-green" />
              <span>Live GPS Signal</span>
            </div>

            <MapContainer
              center={[6.8953, 79.8600]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={false}
              attributionControl={false}
              dragging={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Route polyline */}
              <Polyline
                positions={ROUTE_PATH}
                pathOptions={{ color: '#2563eb', weight: 4, dashArray: '8 4', opacity: 0.85 }}
              />

              {/* Completed route segment */}
              <Polyline
                positions={ROUTE_PATH.slice(0, 3)}
                pathOptions={{ color: '#2563eb', weight: 4, opacity: 1 }}
              />

              {/* Store destination pulse */}
              <Circle
                center={STORE_POS}
                radius={80}
                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.15, weight: 2 }}
              />

              {/* Truck marker (current position) */}
              <Marker position={TRUCK_POS} icon={truckIcon}>
                <Popup>
                  <strong>WP-REF-007</strong><br />Driver: Marcus Vance<br />ETA: 32 min
                </Popup>
              </Marker>

              {/* Store marker */}
              <Marker position={STORE_POS} icon={storeIcon}>
                <Popup>
                  <strong>Colombo 05 Store</strong><br />10:30 – 11:00 AM window
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="sm-gps-actions-row">
            <button
              type="button"
              className="btn-track-live-gps"
              onClick={onTrackGPS}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>Track Live GPS</span>
            </button>

            <button
              type="button"
              className="btn-contact-dispatch"
              onClick={onContactDispatch}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Contact Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stepper Timeline Bar */}
      <div className="sm-hero-stepper-timeline">
        <div className="sm-timeline-line-track">
          <div className="sm-timeline-line-progress" style={{ width: '45%' }} />
        </div>

        <div className="sm-timeline-steps">
          {/* Step 1 */}
          <div className="sm-timeline-step completed">
            <div className="sm-step-icon-circle completed">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="sm-step-name">Dispatched</span>
            <span className="sm-step-time">09:40 AM</span>
          </div>

          {/* Step 2 */}
          <div className="sm-timeline-step active">
            <div className="sm-step-icon-circle active">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <span className="sm-step-name active-text">In Transit</span>
            <span className="sm-step-time active-sub">Active (En Route)</span>
          </div>

          {/* Step 3 */}
          <div className="sm-timeline-step upcoming">
            <div className="sm-step-icon-circle upcoming">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <span className="sm-step-name">Arriving</span>
            <span className="sm-step-time">~ 10:45 AM</span>
          </div>

          {/* Step 4 */}
          <div className="sm-timeline-step upcoming">
            <div className="sm-step-icon-circle upcoming">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
            <span className="sm-step-name">Delivered</span>
            <span className="sm-step-time">Pending Seal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
