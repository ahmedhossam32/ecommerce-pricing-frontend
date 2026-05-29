import api from './axiosInstance'
export const listProduct = (data) => api.post('/products', data)
export const acceptPrice = (id, data) => api.post(`/products/${id}/accept`, data)
export const disputePrice = (id, data) => api.post(`/products/${id}/dispute`, data)
export const getSellerProducts = () => api.get('/seller/products')
export const getSellerDashboard = () => api.get('/seller/dashboard')
export const uploadProductImages = (id, files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('files', file))
  return api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
