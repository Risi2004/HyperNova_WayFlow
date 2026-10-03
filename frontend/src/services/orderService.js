import { apiRequest } from './apiClient'

export const orderService = {
  // Store manager
  getSchedule: () => apiRequest('/orders/schedule'),
  getDraft: () => apiRequest('/orders/draft'),
  saveDraft: (payload) => apiRequest('/orders', { method: 'POST', body: { ...payload, submit: false } }),
  submitOrder: (payload) => apiRequest('/orders', { method: 'POST', body: { ...payload, submit: true } }),
  getMyOrders: (options = {}) => apiRequest('/orders/mine', { query: options }),

  // Dispatcher
  listOrders: (filters) => apiRequest('/orders', { query: filters }),
  getIntake: () => apiRequest('/orders/intake'),
  closeIntake: (deliveryDate) => apiRequest('/orders/intake/close', { method: 'POST', body: { delivery_date: deliveryDate } }),
  setPriority: (orderIds, priority) => apiRequest('/orders/priority', { method: 'PATCH', body: { order_ids: orderIds, priority } }),
  deferOrders: (orderIds, reason, explanation) =>
    apiRequest('/orders/defer', { method: 'POST', body: { order_ids: orderIds, reason, explanation } }),

  // Shared
  getOrder: (orderId) => apiRequest(`/orders/${encodeURIComponent(orderId)}`),
  cancelOrder: (orderId, reason) => apiRequest(`/orders/${encodeURIComponent(orderId)}/cancel`, { method: 'POST', body: { reason } }),
  confirmReceipt: (orderId, payload) => apiRequest(`/orders/${encodeURIComponent(orderId)}/confirm-receipt`, { method: 'POST', body: payload }),
  reportIssue: (orderId, payload) => apiRequest(`/orders/${encodeURIComponent(orderId)}/issues`, { method: 'POST', body: payload }),
}

