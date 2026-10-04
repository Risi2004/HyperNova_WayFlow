import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom Leaflet Marker for Peliyagoda Depot
const peliyagodaMarkerIcon = L.divIcon({
  className: 'routes-custom-marker',
  html: `
    <div class="map-node-container">
      <div class="map-pin-red">
        <svg viewBox="0 0 24 30" width="22" height="28" fill="none">
          <path d="M12 0C6.48 0 2 4.48 2 10c0 7.2 10 20 10 20s10-12.8 10-20c0-5.52-4.48-10-10-10z" fill="#dc2626"/>
          <circle cx="12" cy="10" r="3.5" fill="#ffffff"/>
        </svg>
      </div>
      <div class="map-pin-pill-label">Peliyagoda</div>
    </div>
  `,
  iconSize: [120, 32],
  iconAnchor: [11, 26],
})

// Custom Leaflet Marker for Colombo Outlet
const colomboMarkerIcon = L.divIcon({
  className: 'routes-custom-marker',
  html: `
    <div class="map-node-container">
      <div class="map-pin-red">
        <svg viewBox="0 0 24 30" width="22" height="28" fill="none">
          <path d="M12 0C6.48 0 2 4.48 2 10c0 7.2 10 20 10 20s10-12.8 10-20c0-5.52-4.48-10-10-10z" fill="#dc2626"/>
          <circle cx="12" cy="10" r="3.5" fill="#ffffff"/>
        </svg>
      </div>
      <div class="map-pin-pill-label">Colombo</div>
    </div>
  `,
  iconSize: [110, 32],
  iconAnchor: [11, 26],
})

// Real route spline connecting Peliyagoda Depot along the main transport corridor to Colombo
const operationalRoutePoints = [
  [6.9695, 79.8895], // Peliyagoda Depot
  [6.9630, 79.8820],
  [6.9560, 79.8740],
  [6.9490, 79.8670],
  [6.9420, 79.8590],
  [6.9360, 79.8530], // Pettah / Harbor approach
  [6.9290, 79.8490], // Colombo Fort
  [6.9200, 79.8465], // Galle Face
  [6.9110, 79.8495], // Colombo center
  [6.9040, 79.8515], // Colombo 03
]

// Controller to auto-size map to cover both points
function MapBoundsController() {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
    map.fitBounds(
      [
        [6.8980, 79.8400],
        [6.9740, 79.8960],
      ],
      { padding: [35, 35], maxZoom: 13 }
    )

    const t1 = setTimeout(() => map.invalidateSize(), 150)
    const t2 = setTimeout(() => map.invalidateSize(), 500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [map])

  return null
}

export default function RoutesOperationalMap() {
  const peliyagodaPos = [6.9695, 79.8895]
  const colomboPos = [6.9040, 79.8515]

  return (
    <div className="routes-operational-map-card">
      {/* Map Card Header with Legend */}
      <div className="routes-map-header-bar">
        <div className="map-title-meta">
          <h3 className="operational-map-title">Operational Map Overview</h3>
          <p className="operational-map-subtitle">Route distribution across today's depots</p>
        </div>

        <div className="routes-map-status-legend">
          <span className="legend-item">
            <span className="legend-dot dot-planned"></span>
            <span>Planned</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-active"></span>
            <span>Active</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-completed"></span>
            <span>Completed</span>
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-delayed"></span>
            <span>Delayed</span>
          </span>
        </div>
      </div>

      {/* Leaflet Map Frame */}
      <div className="routes-leaflet-frame">
        <MapContainer
          center={[6.9360, 79.8680]}
          zoom={12}
          scrollWheelZoom={false}
          className="routes-map-element"
        >
          <MapBoundsController />

          {/* OpenStreetMap Universal Tile Server */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Leaflet'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
          />

          {/* Route glow backdrop */}
          <Polyline
            positions={operationalRoutePoints}
            pathOptions={{
              color: '#60a5fa',
              weight: 8,
              opacity: 0.6,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {/* Active Navigation Polyline */}
          <Polyline
            positions={operationalRoutePoints}
            pathOptions={{
              color: '#2563eb',
              weight: 4.5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />

          {/* Peliyagoda Origin Pin */}
          <Marker position={peliyagodaPos} icon={peliyagodaMarkerIcon} />

          {/* Colombo Destination Pin */}
          <Marker position={colomboPos} icon={colomboMarkerIcon} />
        </MapContainer>
      </div>
    </div>
  )
}
