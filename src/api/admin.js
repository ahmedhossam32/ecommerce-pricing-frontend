import api from './axiosInstance'
export const getPendingRequests = () => api.get('/admin/requests')
export const approveRequest = (id, data) => api.post(`/admin/approve/${id}`, data)
export const rejectRequest = (id, data) => api.post(`/admin/reject/${id}`, data)
export const overridePrice = (id, data) => api.post(`/admin/override/${id}`, data)
export const getAdminStats = () => api.get('/admin/stats')
