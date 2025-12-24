import apiClient from '../utils/apiClient';

/**
 * Get user's orders
 * @param {object} params - Query parameters (status, limit, page)
 * @returns {Promise} API response
 */
export const getOrders = async (params = {}) => {
  const response = await apiClient.get('/orders', { params });
  return response;
};

/**
 * Get order by ID
 * @param {string} id - Order ID
 * @returns {Promise} API response
 */
export const getOrder = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response;
};

/**
 * Get order by order number
 * @param {string} orderNumber - Order number
 * @returns {Promise} API response
 */
export const getOrderByNumber = async (orderNumber) => {
  const response = await apiClient.get(`/orders/number/${orderNumber}`);
  return response;
};

/**
 * Create a new order
 * @param {object} orderData - Order data
 * @returns {Promise} API response
 */
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response;
};

/**
 * Update order status
 * @param {string} id - Order ID
 * @param {object} updateData - Update data (status, trackingNumber, etc.)
 * @returns {Promise} API response
 */
export const updateOrderStatus = async (id, updateData) => {
  const response = await apiClient.put(`/orders/${id}/status`, updateData);
  return response;
};

/**
 * Cancel order
 * @param {string} id - Order ID
 * @param {string} reason - Cancellation reason
 * @returns {Promise} API response
 */
export const cancelOrder = async (id, reason) => {
  const response = await apiClient.post(`/orders/${id}/cancel`, { reason });
  return response;
};

