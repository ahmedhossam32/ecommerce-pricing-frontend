import api from './axiosInstance'
export const getAllProducts = () => api.get('/buyer/products')
export const getProductById = (id) => api.get(`/buyer/products/${id}`)
export const getPriceHistory = (id) => api.get(`/buyer/products/${id}/history`)
