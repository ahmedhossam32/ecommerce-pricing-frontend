import api from './axiosInstance'
export const getPendingRequests = () => api.get('/admin/requests')
export const approveRequest = (id, data) => api.post(`/admin/approve/${id}`, data)
export const rejectRequest = (id, data) => api.post(`/admin/reject/${id}`, data)
export const overridePrice = (id, data) => api.post(`/admin/override/${id}`, data)
export const getAdminStats = () => api.get('/admin/stats')
export const getRequestById = (id) => api.get(`/admin/requests/${id}`)
export const getAllProducts = (status, page = 0, size = 1000) =>
  api.get('/admin/products', { params: { status, page, size } })
export const deleteAdminProduct = (id) => api.delete(`/admin/products/${id}`)
