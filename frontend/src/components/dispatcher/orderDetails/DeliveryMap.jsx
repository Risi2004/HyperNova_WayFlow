import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './DeliveryMap.css'

// Depot Marker (Clean blue dot with white stroke & text pill)
const depotIcon = (label) => L.divIcon({
  className: 'wf-leaflet-marker-depot',
  html: `
    <div class="depot-pin-node">
      <div class="depot-pin-circle">
        <div class="depot-pin-dot"></div>
      </div>
      <div class="depot-pin-label">${label}</div>
    </div>
  `,
  iconSize: [130, 24],
  iconAnchor: [8, 12],
})

// Outlet Destination Marker (Crisp red pin with halo & text pill)
const outletIcon = (label) => L.divIcon({
  className: 'wf-leaflet-marker-outlet',
  html: `
    <div class="outlet-pin-node">
      <div class="outlet-pin-graphic">
        <div class="outlet-pin-halo"></div>
        <svg class="outlet-svg-pin" viewBox="0 0 24 30" width="22" height="28" fill="none">
          <path d="M12 0C6.48 0 2 4.48 2 10c0 7.2 10 20 10 20s10-12.8 10-20c0-5.52-4.48-10-10-10z" fill="#dc2626"/>
          <circle cx="12" cy="10" r="4" fill="#ffffff"/>
        </svg>
      </div>
      <div class="outlet-pin-label">${label}</div>
    </div>
  `,
  iconSize: [140, 48],
  iconAnchor: [11, 26],
})

const DEPOTS = {
  Peliyagoda: [6.9695, 79.8895],
  Kandy: [7.2906, 80.6337],
}

// Approximate district centres. The dataset has no outlet coordinates, so the map shows the
// depot-to-district corridor the planner uses for travel time.
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
}

// Road-following corridor from Peliyagoda Depot through the Colombo network to Kollupitiya
const colomboRoute = [
  [6.9695, 79.8895], // Peliyagoda Depot
  [6.9650, 79.8820],
  [6.9585, 79.8735],
  [6.9520, 79.8665],
  [6.9440, 79.8590],
  [6.9370, 79.8530], // Pettah approach
  [6.9295, 79.8490], // Colombo Fort
  [6.9205, 79.8465], // Galle Face
  [6.9115, 79.8495], // Kollupitiya North
  [6.9040, 79.8515], // Colombo 03 Outlet (Kollupitiya)
]

// Controller to auto-fit view to show both points, the route, and surroundings
function MapFitController({ bounds }) {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 })

    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => clearTimeout(timer)
  }, [map, bounds])

  return null
}

export default function DeliveryMap({ depot = 'Peliyagoda', district = 'Colombo', outletLabel = 'Outlet' }) {
  const { depotPosition, outletPosition, routeCoordinates, bounds } = useMemo(() => {
    const from = DEPOTS[depot] || DEPOTS.Peliyagoda
    const to = DISTRICTS[district] || [from[0] - 0.05, from[1] - 0.03]
    return {
      depotPosition: from,
      outletPosition: to,
      routeCoordinates: depot === 'Peliyagoda' && district === 'Colombo' ? colomboRoute : [from, to],
      bounds: [from, to],
    }
  }, [depot, district])
  const icons = useMemo(
    () => ({ depot: depotIcon(`${depot} Depot`), outlet: outletIcon(outletLabel) }),
    [depot, outletLabel]
  )

  return (
    <div className="delivery-leaflet-wrapper">
      <MapContainer
        center={outletPosition}
        zoom={12}
        scrollWheelZoom={false}
        className="leaflet-map-element"
      >
        <MapFitController bounds={bounds} />

        {/* Standard OpenStreetMap Tile Server with all surroundings, streets, terrain, landmarks */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
          maxZoom={19}
        />

        {/* Operational delivery buffer zones */}
        <Circle
          center={depotPosition}
          radius={750}
          pathOptions={{
            color: 'transparent',
            fillColor: '#86efac',
            fillOpacity: 0.45,
          }}
        />
        <Circle
          center={outletPosition}
          radius={800}
          pathOptions={{
            color: 'transparent',
            fillColor: '#86efac',
            fillOpacity: 0.4,
          }}
        />

        {/* Route glow outline */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: '#60a5fa',
            weight: 7,
            opacity: 0.55,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Primary active delivery route polyline */}
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: '#2563eb',
            weight: 4,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        {/* Origin Depot Pin */}
        <Marker position={depotPosition} icon={icons.depot} />

        {/* Destination Outlet Pin */}
        <Marker position={outletPosition} icon={icons.outlet} />
      </MapContainer>
    </div>
  )
}
