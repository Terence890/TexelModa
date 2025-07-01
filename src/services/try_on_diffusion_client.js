/**
 * Try-On Diffusion API Client
 * 
 * This service handles integration with the Try-On Diffusion API for virtual clothing try-on.
 * It provides methods to send images to the API and receive generated try-on results.
 */

import axios from 'axios';

class TryOnDiffusionClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.example.com/try-on-diffusion/v1'; // Replace with actual API URL
  }

  /**
   * Generate a virtual try-on result using the provided images
   * 
   * @param {Blob|String} avatarImage - The user's avatar image (as File, Blob, or base64 string)
   * @param {Blob|String} clothingImage - The clothing image to try on (as File, Blob, or base64 string)
   * @param {Blob|String} backgroundImage - Optional background image (as File, Blob, or base64 string)
   * @param {Object} options - Additional options for the try-on generation
   * @returns {Promise<Object>} - Promise resolving to the API response with try-on results
   */
  async generateTryOn(avatarImage, clothingImage, backgroundImage = null, options = {}) {
    try {
      // Create form data to send images
      const formData = new FormData();
      
      // Convert base64 strings to blobs if needed
      const avatarBlob = this.toBlob(avatarImage);
      const clothingBlob = this.toBlob(clothingImage);
      
      formData.append('avatar', avatarBlob, 'avatar.jpg');
      formData.append('clothing', clothingBlob, 'clothing.jpg');
      
      if (backgroundImage) {
        const backgroundBlob = this.toBlob(backgroundImage);
        formData.append('background', backgroundBlob, 'background.jpg');
      }
      
      // Add any additional options
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Make API request
      const response = await axios.post(`${this.baseUrl}/generate`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in generateTryOn:', error);
      throw error;
    }
  }
  
  /**
   * Helper method to convert base64 image to Blob
   * 
   * @param {Blob|String} image - Image as Blob/File or base64 string
   * @returns {Blob} - Image as Blob
   */
  toBlob(image) {
    // If already a Blob or File, return as is
    if (image instanceof Blob || image instanceof File) {
      return image;
    }
    
    // If base64 string, convert to Blob
    if (typeof image === 'string' && image.startsWith('data:')) {
      const parts = image.split(';base64,');
      const contentType = parts[0].replace('data:', '');
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
      
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      
      return new Blob([uInt8Array], { type: contentType });
    }
    
    throw new Error('Invalid image format. Must be a Blob, File, or base64 string.');
  }
  
  /**
   * Get status of a pending try-on generation job
   * 
   * @param {string} jobId - The ID of the try-on job
   * @returns {Promise<Object>} - Promise resolving to the job status
   */
  async getJobStatus(jobId) {
    try {
      const response = await axios.get(`${this.baseUrl}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }
}

export default TryOnDiffusionClient; 