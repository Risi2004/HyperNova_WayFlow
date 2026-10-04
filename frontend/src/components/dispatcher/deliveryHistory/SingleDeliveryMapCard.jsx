import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom marker for Depot
const depotIcon = L.divIcon({
  className: 'single-depot-marker',
  html: `
    <div class="map-hub-pin">
      <div class="hub-pin-icon">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <span class="hub-pin-text">Peliyagoda Hub</span>
    </div>
  `,
  iconSize: [120, 28],
  iconAnchor: [14, 14],
})

// Custom marker for Outlet Destination (Green delivered pin)
const outletDeliveredIcon = L.divIcon({
  className: 'single-outlet-marker',
  html: `
    <div class="map-outlet-delivered-pin">
      <div class="outlet-delivered-icon">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="outlet-pin-text">OUT042 Delivered</span>
    </div>
  `,
  iconSize: [135, 28],
  iconAnchor: [14, 14],
})

function MapBoundsController({ points }) {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 })
    }
    const t1 = setTimeout(() => map.invalidateSize(), 150)
    const t2 = setTimeout(() => map.invalidateSize(), 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [points, map])
  return null
}

export default function SingleDeliveryMapCard() {
  const depotCoords = [6.9695, 79.8895]
  const outletCoords = [6.9580, 79.8650]

  const routePath = [
    depotCoords,
    [6.9660, 79.8820],
    [6.9620, 79.8730],
    outletCoords,
  ]

  return (
    <div className="single-card single-map-card">
      <div className="single-card-header flex-between">
        <div>
          <h2 className="single-card-title">Delivery Location & Geofence</h2>
          <p className="single-card-subtitle">
            Peliyagoda DC &rarr; OUT042 Waypoint Fresh (Harbor Road Delivery Bay)
          </p>
        </div>
        <div className="single-map-legend">
          <span className="legend-item"><span className="dot dot-depot"></span>Hub</span>
          <span className="legend-item"><span className="dot dot-green"></span>Delivered</span>
        </div>
      </div>

      <div className="single-leaflet-container">
        <MapContainer
          center={[6.963, 79.877]}
          zoom={13}
          scrollWheelZoom={false}
          className="single-leaflet-canvas"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsController points={[depotCoords, outletCoords]} />

          {/* Route path */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#16a34a',
              weight: 3.5,
              opacity: 0.85,
            }}
          />

          {/* Geofence circle around outlet */}
          <Circle
            center={outletCoords}
            radius={90}
            pathOptions={{
              color: '#16a34a',
              fillColor: '#22c55e',
              fillOpacity: 0.15,
              weight: 1.5,
            }}
          />

          {/* Depot Marker */}
          <Marker position={depotCoords} icon={depotIcon}>
            <Popup>
              <strong>Peliyagoda Distribution Center</strong>
              <br />Hub Origin
            </Popup>
          </Marker>

          {/* Outlet Delivered Marker */}
          <Marker position={outletCoords} icon={outletDeliveredIcon}>
            <Popup>
              <strong>OUT042 — Waypoint Fresh</strong>
              <br />Delivered at 09:14 AM
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}
