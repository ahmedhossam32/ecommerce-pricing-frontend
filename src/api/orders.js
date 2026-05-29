import api from './axiosInstance'
export const placeOrder = (productId) => api.post('/orders', { productId })
export const getMyOrders = () => api.get('/orders/my')
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`)
