import api from './axiosInstance'
export const placeOrder = (productId) => api.post('/orders', { productId })
export const getMyOrders = () => api.get('/orders/my')
