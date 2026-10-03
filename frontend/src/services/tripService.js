import { apiRequest } from './apiClient'

export const tripService = {
  // Loader / dispatcher
  listTrips: (date, depot) => apiRequest('/trips', { query: { date, depot } }),
  getTrip: (tripId) => apiRequest(`/trips/${encodeURIComponent(tripId)}`),
  verifyOrder: (tripId, payload) => apiRequest(`/trips/${encodeURIComponent(tripId)}/loading/verify`, { method: 'POST', body: payload }),
  completeLoading: (tripId) => apiRequest(`/trips/${encodeURIComponent(tripId)}/loading/complete`, { method: 'POST' }),

  // Driver
  myTrips: () => apiRequest('/trips/mine'),
  startTrip: (tripId, at) => apiRequest(`/trips/${encodeURIComponent(tripId)}/start`, { method: 'POST', body: { at } }),
  arrive: (tripId, orderId, at) =>
    apiRequest(`/trips/${encodeURIComponent(tripId)}/stops/${orderId}/arrive`, { method: 'POST', body: { at } }),
  deliver: (tripId, orderId, payload) =>
    apiRequest(`/trips/${encodeURIComponent(tripId)}/stops/${orderId}/deliver`, { method: 'POST', body: payload }),
  reportProblem: (tripId, payload) => apiRequest(`/trips/${encodeURIComponent(tripId)}/problems`, { method: 'POST', body: payload }),
}
