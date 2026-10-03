import { apiRequest } from './apiClient'

// Operational issues raised by drivers and store managers, worked through by dispatch.
export const issueService = {
  list: (filters) => apiRequest('/issues', { query: filters }),
  photo: (issueId) => apiRequest(`/issues/${issueId}/photo`),
  update: (issueId, payload) => apiRequest(`/issues/${issueId}`, { method: 'PATCH', body: payload }),
}
