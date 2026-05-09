import api from './axiosInstance'
export const getCart = () => api.get('/buyer/cart')
export const addToCart = (productId) => api.post(`/buyer/cart/${productId}`)
export const removeFromCart = (productId) => api.delete(`/buyer/cart/${productId}`)
export const clearCart = () => api.delete('/buyer/cart')
