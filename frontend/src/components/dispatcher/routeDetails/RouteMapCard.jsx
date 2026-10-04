import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker for Peliyagoda Depot
const depotIcon = L.divIcon({
  className: 'route-depot-marker',
  html: `
    <div class="map-depot-pin">
      <div class="depot-pin-box">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <span class="depot-tag-label">Peliyagoda Depot</span>
    </div>
  `,
  iconSize: [120, 28],
  iconAnchor: [14, 14],
})

// Generator for numbered stop markers (blue or green for completed)
function createStopIcon(number, isCompleted = false) {
  const bgClass = isCompleted ? 'pin-completed' : 'pin-planned'
  return L.divIcon({
    className: 'route-stop-custom-icon',
    html: `
      <div class="map-seq-node ${bgClass}">
        <span class="seq-num">${number}</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// Controller to auto fit map bounds to all coordinates
function MapBoundsController({ coordinates }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates)
      map.fitBounds(bounds, { padding: [25, 25], maxZoom: 13 })
    }
    const t1 = setTimeout(() => map.invalidateSize(), 150)
    const t2 = setTimeout(() => map.invalidateSize(), 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [coordinates, map])
  return null
}

export default function RouteMapCard() {
  const depotCoords = [6.9695, 79.8895]

  const stops = [
    { num: '01', id: 'OUT042', brand: 'Waypoint Fresh', lat: 6.9580, lng: 79.8650, completed: false },
    { num: '02', id: 'OUT017', brand: 'Waypoint Fresh', lat: 6.9510, lng: 79.8780, completed: false },
    { num: '03', id: 'OUT001', brand: 'Waypoint Style', lat: 6.9420, lng: 79.8920, completed: false },
    { num: '04', id: 'OUT033', brand: 'Waypoint Fresh', lat: 6.9360, lng: 79.9100, completed: false },
    { num: '05', id: 'OUT078', brand: 'Waypoint Tech',  lat: 6.9280, lng: 79.9250, completed: false },
    { num: '06', id: 'OUT019', brand: 'Waypoint Fresh', lat: 6.9180, lng: 79.9120, completed: true },
    { num: '07', id: 'OUT052', brand: 'Waypoint Style', lat: 6.9110, lng: 79.9320, completed: false },
    { num: '08', id: 'OUT011', brand: 'Waypoint Fresh', lat: 6.9040, lng: 79.9510, completed: false },
  ]

  const allPoints = [
    depotCoords,
    ...stops.map((s) => [s.lat, s.lng]),
  ]

  return (
    <div className="route-card route-map-card">
      <div className="route-card-header flex-between">
        <div>
          <h2 className="route-card-title">Route Map</h2>
          <p className="route-card-subtitle">Planned stop order from Peliyagoda Distribution Center</p>
        </div>
        <span className="sequence-disclaimer-pill">Sequence view · not for navigation</span>
      </div>

      {/* Leaflet Map Container */}
      <div className="route-leaflet-wrapper">
        <MapContainer
          center={[6.935, 79.905]}
          zoom={12}
          scrollWheelZoom={false}
          className="route-leaflet-canvas"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsController coordinates={allPoints} />

          {/* Polyline sequence route */}
          <Polyline
            positions={allPoints}
            pathOptions={{
              color: '#2563eb',
              weight: 3.5,
              opacity: 0.85,
              dashArray: '6, 6',
            }}
          />

          {/* Depot Marker */}
          <Marker position={depotCoords} icon={depotIcon}>
            <Popup>
              <strong>Peliyagoda Distribution Center</strong>
              <br />Departure Point (05:30 AM)
            </Popup>
          </Marker>

          {/* Sequence Stop Markers */}
          {stops.map((stop) => (
            <Marker
              key={stop.num}
              position={[stop.lat, stop.lng]}
              icon={createStopIcon(stop.num, stop.completed)}
            >
              <Popup>
                <strong>Stop {stop.num}: {stop.id}</strong>
                <br />
                {stop.brand}
                <br />
                Status: {stop.completed ? 'Completed' : 'Planned'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend & Stops Listing Footer */}
      <div className="route-map-footer-meta">
        <div className="map-legend-row">
          <div className="legend-item">
            <span className="legend-dot dot-depot"></span>
            <span>Depot</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-completed"></span>
            <span>Completed</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-planned"></span>
            <span>Planned sequence</span>
          </div>
        </div>

        <div className="map-stops-grid-preview">
          {stops.map((s) => (
            <div key={s.num} className="stop-mini-badge">
              <span className={`mini-num ${s.completed ? 'green' : 'blue'}`}>{s.num}</span>
              <span className="mini-text">{s.id} {s.brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
