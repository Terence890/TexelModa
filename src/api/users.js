import apiClient from '../utils/apiClient';

/**
 * Get user profile
 */
export const getProfile = async () => {
  return await apiClient.get('/users/profile');
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  return await apiClient.put('/users/profile', profileData);
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return await apiClient.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Upload avatar as base64/data URL string
 */
export const uploadAvatarBase64 = async (avatarDataUrl) => {
  return await apiClient.post('/users/avatar/base64', { avatar: avatarDataUrl });
};

/**
 * Get user addresses
 */
export const getAddresses = async () => {
  return await apiClient.get('/users/addresses');
};

/**
 * Add address
 */
export const addAddress = async (addressData) => {
  return await apiClient.post('/users/addresses', addressData);
};

/**
 * Update address
 */
export const updateAddress = async (id, addressData) => {
  return await apiClient.put(`/users/addresses/${id}`, addressData);
};

/**
 * Delete address
 */
export const deleteAddress = async (id) => {
  return await apiClient.delete(`/users/addresses/${id}`);
};

