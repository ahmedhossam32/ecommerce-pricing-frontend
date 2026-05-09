import api from './axiosInstance'
export const getWishlist = () => api.get('/buyer/wishlist')
export const saveToWishlist = (productId) => api.post(`/buyer/wishlist/${productId}`)
export const removeFromWishlist = (productId) => api.delete(`/buyer/wishlist/${productId}`)
