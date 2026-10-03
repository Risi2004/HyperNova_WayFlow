import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom Leaflet Marker for Peliyagoda DC
const peliyagodaDcIcon = L.divIcon({
  className: 'live-depot-custom-marker',
  html: `
    <div class="live-map-depot-pin">
      <div class="depot-circle-icon">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <span class="depot-pin-title">Peliyagoda DC</span>
    </div>
  `,
  iconSize: [130, 32],
  iconAnchor: [16, 16],
})

// Generator for numbered stop nodes with labels
function createLiveNodeIcon(num, outletId, status = 'active') {
  const pinClass = status === 'completed' ? 'node-green' : status === 'delayed' ? 'node-red' : 'node-blue'
  return L.divIcon({
    className: 'live-node-custom-marker',
    html: `
      <div class="live-stop-node-pill">
        <div class="node-circle-num ${pinClass}">
          <span>${num}</span>
        </div>
        <span class="node-outlet-id">${outletId}</span>
      </div>
    `,
    iconSize: [85, 26],
    iconAnchor: [12, 13],
  })
}

// Map bounds controller
function MapBoundsController({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 13 })
    }
  }, [points, map])
  return null
}

export default function LiveNetworkMapCard() {
  const depotCoords = [6.9695, 79.8895]

  const networkStops = [
    { num: '01', id: 'OUT042', lat: 6.9630, lng: 79.8820, status: 'active' },
    { num: '02', id: 'OUT017', lat: 6.9540, lng: 79.8730, status: 'active' },
    { num: '03', id: 'OUT061', lat: 6.9580, lng: 79.9120, status: 'active' },
    { num: '04', id: 'OUT033', lat: 6.9460, lng: 79.9240, status: 'active' },
    { num: '05', id: 'OUT078', lat: 6.9510, lng: 79.9410, status: 'active' },
    { num: '06', id: 'OUT019', lat: 6.9360, lng: 79.9320, status: 'completed' },
    { num: '07', id: 'OUT052', lat: 6.9420, lng: 79.9540, status: 'active' },
    { num: '08', id: 'OUT011', lat: 6.9310, lng: 79.9720, status: 'active' },
  ]

  const allPoints = [
    depotCoords,
    ...networkStops.map((s) => [s.lat, s.lng]),
  ]

  return (
    <div className="live-network-map-card">
      <div className="map-card-header-row">
        <div>
          <h2 className="map-card-title">Delivery Network</h2>
          <p className="map-card-subtitle">
            Live distribution overview · not for navigation
          </p>
        </div>

        {/* Legend */}
        <div className="map-legend-pills">
          <div className="legend-item">
            <span className="legend-dot dot-active"></span>
            <span>Active</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-completed"></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-delayed"></span>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="live-leaflet-wrapper">
        <MapContainer
          center={[6.945, 79.92]}
          zoom={12}
          scrollWheelZoom={false}
          className="live-leaflet-canvas"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsController points={allPoints} />

          {/* Connected Network Polylines */}
          <Polyline
            positions={allPoints}
            pathOptions={{
              color: '#0284c7',
              weight: 3.5,
              opacity: 0.8,
            }}
          />

          {/* Depot Marker */}
          <Marker position={depotCoords} icon={peliyagodaDcIcon}>
            <Popup>
              <strong>Peliyagoda DC</strong>
              <br />Hub Origin & Dispatch Center
            </Popup>
          </Marker>

          {/* Network Stop Markers */}
          {networkStops.map((stop) => (
            <Marker
              key={stop.num}
              position={[stop.lat, stop.lng]}
              icon={createLiveNodeIcon(stop.num, stop.id, stop.status)}
            >
              <Popup>
                <strong>Stop {stop.num} — {stop.id}</strong>
                <br />
                Status: {stop.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
