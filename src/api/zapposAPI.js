import axios from 'axios';

const ZAPPOS_API_URL = import.meta.env.VITE_ZAPPOS_API_URL || 'https://zappos1.p.rapidapi.com';
const ZAPPOS_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const ZAPPOS_API_HOST = import.meta.env.VITE_ZAPPOS_API_HOST || 'zappos1.p.rapidapi.com';

const zapposApi = axios.create({
  baseURL: ZAPPOS_API_URL,
  headers: {
    'x-rapidapi-key': ZAPPOS_API_KEY,
    'x-rapidapi-host': ZAPPOS_API_HOST,
    'Content-Type': 'application/json',
  },
});

export const listZapposProducts = async (page = 1, limit = 100, sort = 'relevance/desc', filters = []) => {
  try {
    const response = await zapposApi.post(
      `/products/list?page=${page}&sort=${sort}&limit=${limit}`,
      filters
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Zappos product list:', error);
    throw error;
  }
};

export const getZapposProductDetail = async (productId) => {
  try {
    const response = await zapposApi.get(`/products/detail?productId=${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Zappos product detail for ${productId}:`, error);
    throw error;
  }
};

export const listZapposBrands = async () => {
  try {
    const response = await zapposApi.get('/brands/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching Zappos brand list:', error);
    throw error;
  }
};
