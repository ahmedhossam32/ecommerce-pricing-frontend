import api from './axiosInstance'
export const getAllProducts = (page = 0, size = 1000) =>
  api.get('/buyer/products', { params: { page, size } })
export const getProductById = (id) => api.get(`/buyer/products/${id}`)
export const getPriceHistory = (id) => api.get(`/buyer/products/${id}/history`)
