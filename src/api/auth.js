import apiClient from '../utils/apiClient';

/**
 * Register a new user
 */
export const register = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

/**
 * Login user
 */
export const login = async (email, password) => {
  return await apiClient.post('/auth/login', { email, password });
};

/**
 * Logout user
 */
export const logout = async () => {
  return await apiClient.post('/auth/logout');
};

/**
 * Get current user
 */
export const getMe = async () => {
  return await apiClient.get('/auth/me');
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken) => {
  return await apiClient.post('/auth/refresh', { refreshToken });
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
  return await apiClient.post('/auth/forgot-password', { email });
};

/**
 * Reset password
 */
export const resetPassword = async (token, password) => {
  return await apiClient.post('/auth/reset-password', { token, password });
};

/**
 * Verify email
 */
export const verifyEmail = async (token) => {
  return await apiClient.get('/auth/verify-email', { params: { token } });
};

