import { apiRequest } from './apiClient'

const base = (date) => `/plans/${date}`

export const planService = {
  getPlan: (date) => apiRequest(base(date)),
  suggest: (date, keepExisting) => apiRequest(`${base(date)}/generate`, { method: 'POST', body: { keep_existing: keepExisting } }),
  checkAssign: (date, orderId, vehicleId, tripNumber) =>
    apiRequest(`${base(date)}/assign`, { method: 'POST', body: { order_id: orderId, vehicle_id: vehicleId, trip_number: tripNumber, dry_run: true } }),
  assign: (date, orderId, vehicleId, tripNumber) =>
    apiRequest(`${base(date)}/assign`, { method: 'POST', body: { order_id: orderId, vehicle_id: vehicleId, trip_number: tripNumber } }),
  unassign: (date, orderIds, reason, explanation) =>
    apiRequest(`${base(date)}/unassign`, { method: 'POST', body: { order_ids: orderIds, reason, explanation } }),
  removeRoute: (date, vehicleId) => apiRequest(`${base(date)}/vehicles/${vehicleId}`, { method: 'DELETE' }),
  setReason: (date, orderId, reason, explanation) =>
    apiRequest(`${base(date)}/unscheduled/${orderId}`, { method: 'PUT', body: { reason, explanation } }),
  setAvailability: (date, vehicleId, available, reason) =>
    apiRequest(`${base(date)}/vehicles/${vehicleId}/availability`, { method: 'PUT', body: { available, reason } }),
  publish: (date) => apiRequest(`${base(date)}/publish`, { method: 'POST' }),
  loadScenario: (date) => apiRequest(`${base(date)}/scenario`, { method: 'POST' }),
}
