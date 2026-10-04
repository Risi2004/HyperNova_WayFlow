import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './PlannerRouteMap.css'

const DEPOTS = {
  Peliyagoda: [6.9695, 79.8895],
  Kandy: [7.2906, 80.6337],
}

const DISTRICTS = {
  Colombo: [6.9040, 79.8515],
  Gampaha: [7.0873, 79.9990],
  Kalutara: [6.5854, 79.9607],
  Negombo: [7.2083, 79.8358],
  Kurunegala: [7.4863, 80.3647],
  Puttalam: [8.0362, 79.8283],
  Galle: [6.0535, 80.2210],
  Matara: [5.9549, 80.5550],
  Ratnapura: [6.6828, 80.3992],
  Kegalle: [7.2513, 80.3464],
  Kandy: [7.2906, 80.6337],
  Matale: [7.4675, 80.6234],
  'Nuwara Eliya': [6.9497, 80.7891],
  Badulla: [6.9934, 81.0550],
  Anuradhapura: [8.3114, 80.4037],
  Hambantota: [6.1246, 81.1185],
  Trincomalee: [8.5874, 81.2152],
  Batticaloa: [7.7170, 81.6998],
  Jaffna: [9.6615, 80.0255],
}

// Custom Depot DivIcon
function createDepotIcon(label) {
  return L.divIcon({
    className: 'planner-depot-marker',
    html: `
      <div class="planner-depot-pin">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>${label} Depot</span>
      </div>
    `,
    iconSize: [120, 24],
    iconAnchor: [12, 12],
  })
}

// Custom Numbered Stop DivIcon
function createStopIcon(number) {
  return L.divIcon({
    className: 'planner-stop-marker',
    html: `
      <div class="planner-stop-node">
        <span>${number}</span>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

// Auto-adjust view to encompass all route points
function MapFitController({ points }) {
  const map = useMap()
  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points)
      map.invalidateSize()
      map.fitBounds(bounds, { padding: [28, 28], maxZoom: 13 })
      const timer = setTimeout(() => map.invalidateSize(), 200)
      return () => clearTimeout(timer)
    }
  }, [points, map])
  return null
}

export default function PlannerRouteMap({ stops = [], depot = 'Peliyagoda', trip }) {
  const depotCoords = DEPOTS[depot] || DEPOTS.Peliyagoda

  const mappedStops = useMemo(() => {
    return (stops || []).map((stop, i) => {
      const basePos = DISTRICTS[stop.district] || DISTRICTS.Colombo
      // Stagger multiple stops so each pin is clickable & distinct along the district corridor
      const angle = (i / Math.max(1, stops.length)) * Math.PI * 2
      const spread = stops.length > 1 ? 0.016 + i * 0.003 : 0
      const lat = basePos[0] + (stops.length > 1 ? Math.cos(angle) * spread : 0)
      const lng = basePos[1] + (stops.length > 1 ? Math.sin(angle) * spread * 1.2 : 0)
      return {
        ...stop,
        seq: i + 1,
        pos: [lat, lng],
      }
    })
  }, [stops])

  const allPoints = useMemo(() => {
    const coords = [depotCoords, ...mappedStops.map((s) => s.pos)]
    if (mappedStops.length > 0) coords.push(depotCoords) // Round-trip back to depot
    return coords
  }, [depotCoords, mappedStops])

  const centerPos = mappedStops.length > 0 ? mappedStops[0].pos : depotCoords

  return (
    <div className="planner-route-map-container">
      {/* Header Strip */}
      <div className="planner-map-header">
        <div className="planner-map-title-wrap">
          <span className="planner-map-title">Route Map • OpenStreetMap</span>
          <span className="planner-map-pill">
            {stops.length} stop{stops.length === 1 ? '' : 's'} • {trip?.district || 'Corridor'}
          </span>
        </div>
        <span className="sequence-disclaimer-pill">Sequence view</span>
      </div>

      {/* Leaflet Canvas */}
      <div className="planner-map-leaflet-wrapper">
        <MapContainer
          center={centerPos}
          zoom={11}
          scrollWheelZoom={false}
          className="planner-map-canvas"
        >
          {/* OpenStreetMap Standard Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          <MapFitController points={allPoints} />

          {/* Polyline Route Line */}
          {allPoints.length > 1 && (
            <Polyline
              positions={allPoints}
              pathOptions={{
                color: '#2563eb',
                weight: 3.5,
                opacity: 0.85,
                lineJoin: 'round',
                lineCap: 'round',
              }}
            />
          )}

          {/* Depot Marker */}
          <Marker position={depotCoords} icon={createDepotIcon(depot)}>
            <Popup className="planner-map-popup">
              <div className="map-popup-body">
                <strong>{depot} Distribution Center</strong>
                <div>Trip departure &amp; return depot</div>
              </div>
            </Popup>
          </Marker>

          {/* Numbered Stop Markers */}
          {mappedStops.map((stop) => (
            <Marker key={stop.order_id || stop.seq} position={stop.pos} icon={createStopIcon(stop.seq)}>
              <Popup className="planner-map-popup">
                <div className="map-popup-body">
                  <strong>Stop {stop.seq}: {stop.outlet_id}</strong>
                  <div>Order: {stop.order_id}</div>
                  <div>Planned Arrival: {stop.arrival}</div>
                  <div>Window: {stop.window}</div>
                  <div>Load: {Math.round(stop.weight)} kg • {stop.volume} m³</div>
                  {stop.temp === 'chilled' && <div>❄ Refrigerated cargo</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Footer / Caption bar */}
      <div className="planner-map-caption">
        <span className="planner-depot-key-legend">■ {depot} Depot</span>
        <span className="planner-map-caption-text">
          Numbered markers show stop order (tightest delivery window first)
        </span>
      </div>
    </div>
  )
}
