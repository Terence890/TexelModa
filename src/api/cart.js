import apiClient from '../utils/apiClient';

/**
 * Get user cart
 */
export const getCart = async () => {
  return await apiClient.get('/cart');
};

/**
 * Add item to cart
 */
export const addItem = async (itemData) => {
  return await apiClient.post('/cart/items', itemData);
};

/**
 * Update cart item quantity
 */
export const updateItem = async (productId, quantity) => {
  return await apiClient.put(`/cart/items/${productId}`, { quantity });
};

/**
 * Remove item from cart
 */
export const removeItem = async (productId) => {
  return await apiClient.delete(`/cart/items/${productId}`);
};

/**
 * Clear cart
 */
export const clearCart = async () => {
  return await apiClient.delete('/cart');
};

/**
 * Sync guest cart with user cart
 */
export const syncCart = async (guestItems) => {
  return await apiClient.post('/cart/sync', { guestItems });
};

