// Display helpers for trips (loads) shared by the loader and driver screens.
import { formatTime } from './orderFormat'

// Matches the vehicle-type vocabulary used on the loader screens.
export const vehicleTypeLabel = (trip) =>
  trip.vehicle_type === 'van'
    ? trip.vehicle_temp === 'reefer' ? 'Refrigerated Van' : 'Delivery Van'
    : trip.vehicle_temp === 'reefer' ? 'Refrigerated Truck' : 'Dry-box Truck'

export const routeLabel = (trip) => `${trip.depot} → ${trip.district} (${trip.brand})`

// Loader-facing status of a load.
export function loadStatusOf(trip) {
  if (trip.status === 'planned') return { status: 'AWAITING LOADING', statusType: 'awaiting', actionText: 'Start Loading', actionType: 'primary' }
  if (trip.status === 'loading') {
    return trip.shortfalls
      ? { status: 'ISSUE', statusType: 'issue', statusSubtext: `${trip.shortfalls} order${trip.shortfalls === 1 ? '' : 's'} short`, actionText: 'Continue Loading', actionType: 'issue' }
      : { status: 'LOADING', statusType: 'loading', actionText: 'Continue Loading', actionType: 'primary' }
  }
  if (trip.status === 'loaded') return { status: 'READY', statusType: 'ready', statusSubtext: trip.shortfalls ? `${trip.shortfalls} short-loaded` : null, actionText: 'View Load', actionType: 'secondary' }
  if (['dispatched', 'in_progress'].includes(trip.status)) return { status: 'DEPARTED', statusType: 'ready', actionText: 'View Load', actionType: 'secondary' }
  return { status: 'COMPLETED', statusType: 'ready', actionText: 'View Load', actionType: 'secondary' }
}

// Driver-facing trip status.
export function driverStatusOf(trip) {
  return {
    planned: 'Scheduled',
    loading: 'Loading',
    loaded: 'Ready to depart',
    dispatched: 'In Progress',
    in_progress: 'In Progress',
    completed: 'Completed',
  }[trip.status] || trip.status
}

export const departureLabel = (trip, today) =>
  `${trip.delivery_date === today ? 'Today' : trip.delivery_date}, ${formatTime(trip.planned_departure_time)}`

export const stopDone = (s) => ['delivered', 'partial', 'failed'].includes(s.stop_status)

// Compresses a camera photo to a small JPEG data URL so it uploads (or queues offline) quickly.
export function compressImage(dataUrl, maxSize = 1024, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}
