import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './DeliveryMap.css'

// Depot Marker: Peliyagoda Logistics Depot (Clean blue dot with white stroke & text pill)
const depotIcon = L.divIcon({
  className: 'wf-leaflet-marker-depot',
  html: `
    <div class="depot-pin-node">
      <div class="depot-pin-circle">
        <div class="depot-pin-dot"></div>
      </div>
      <div class="depot-pin-label">Peliyagoda Depot</div>
    </div>
  `,
  iconSize: [130, 24],
  iconAnchor: [8, 12],
})

// Outlet Destination Marker: Colombo 03 Store (Crisp red pin with halo & text pill)
const outletIcon = L.divIcon({
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
      <div class="outlet-pin-label">Colombo 03 Outlet</div>
    </div>
  `,
  iconSize: [140, 48],
  iconAnchor: [11, 26],
})

// Realistic delivery route from Peliyagoda Depot through Colombo road network to Colombo 03
const routeCoordinates = [
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
function MapFitController() {
  const map = useMap()

  useEffect(() => {
    map.invalidateSize()
    map.fitBounds(
      [
        [6.8980, 79.8400],
        [6.9740, 79.8960],
      ],
      { padding: [28, 28], maxZoom: 13 }
    )

    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => clearTimeout(timer)
  }, [map])

  return null
}

export default function DeliveryMap() {
  const depotPosition = [6.9695, 79.8895]
  const outletPosition = [6.9040, 79.8515]

  return (
    <div className="delivery-leaflet-wrapper">
      <MapContainer
        center={[6.9360, 79.8680]}
        zoom={12}
        scrollWheelZoom={false}
        className="leaflet-map-element"
      >
        <MapFitController />

        {/* Standard OpenStreetMap Tile Server with all surroundings, streets, terrain, landmarks */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={['a', 'b', 'c']}
          maxZoom={19}
        />

        {/* Operational delivery buffer zones */}
        <Circle
          center={[6.9620, 79.8810]}
          radius={750}
          pathOptions={{
            color: 'transparent',
            fillColor: '#86efac',
            fillOpacity: 0.45,
          }}
        />
        <Circle
          center={[6.9140, 79.8580]}
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
        <Marker position={depotPosition} icon={depotIcon} />

        {/* Destination Outlet Pin */}
        <Marker position={outletPosition} icon={outletIcon} />
      </MapContainer>
    </div>
  )
}
