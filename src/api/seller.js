import api from './axiosInstance'
export const listProduct = (data) => api.post('/products', data)
export const acceptPrice = (id, data) => api.post(`/products/${id}/accept`, data)
export const disputePrice = (id, data) => api.post(`/products/${id}/dispute`, data)
export const getSellerProducts = () => api.get('/seller/products')
export const getSellerDashboard = () => api.get('/seller/dashboard')
export const getPricingSuggestion = (data) => api.post('/pricing/suggest', data)
