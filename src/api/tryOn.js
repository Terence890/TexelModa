/**
 * API service for virtual try-on functionality
 * Uses the Virtual Try-On Diffusion API from Texel.Moda via RapidAPI
 */

const API_URL = import.meta.env.VITE_TRYON_API_URL || 'https://try-on-diffusion.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_TRYON_API_HOST || 'try-on-diffusion.p.rapidapi.com';

/**
 * Convert a data URL to a Blob object
 * @param {string} dataUrl - Data URL (base64 encoded image)
 * @returns {Blob} - Blob object
 */
const dataURLtoBlob = (dataUrl) => {
  // Handle null or invalid input
  if (!dataUrl || typeof dataUrl !== 'string') {
    console.error('Invalid dataURL provided to dataURLtoBlob:', dataUrl);
    return null;
  }

  // Ensure it's a data URL format
  if (!dataUrl.startsWith('data:')) {
    console.error('Input to dataURLtoBlob is not a data URL:', dataUrl);
    return null;
  }

  try {
    const arr = dataUrl.split(',');
    if (arr.length < 2) {
      console.error('Invalid data URL format (missing comma):', dataUrl.substring(0, 50) + '...');
      return null;
    }
    
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      console.error('Invalid data URL format (invalid MIME type):', arr[0]);
      return null;
    }
    
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Error converting data URL to Blob:', e);
    return null;
  }
};

/**
 * Perform a virtual try-on using the Diffusion API
 * @param {string} avatarImage - Data URL of the avatar image
 * @param {string} clothingImage - Data URL of the clothing image
 * @param {string} backgroundImage - Data URL of the background image (optional)
 * @param {string} avatarPrompt - Text prompt for avatar (optional)
 * @param {string} clothingPrompt - Text prompt for clothing (optional)
 * @param {string} backgroundPrompt - Text prompt for background (optional)
 * @param {string} avatarSex - Avatar sex: "male" or "female" (optional)
 * @param {number} seed - Seed for consistent results (optional, default: -1 for random)
 * @returns {Promise<string>} - Data URL of the resulting image
 */
export const generateTryOn = async (
  avatarImage,
  clothingImage,
  backgroundImage = null,
  avatarPrompt = null,
  clothingPrompt = null,
  backgroundPrompt = null,
  avatarSex = null,
  seed = -1
) => {
  console.log("generateTryOn called with:");
  console.log("- Avatar image:", avatarImage ? "Present" : "Missing");
  console.log("- Clothing image:", clothingImage ? "Present" : "Missing");
  console.log("- Background image:", backgroundImage ? "Present" : "Missing");
  console.log("- Avatar prompt:", avatarPrompt);
  console.log("- Clothing prompt:", clothingPrompt);
  console.log("- Background prompt:", backgroundPrompt);
  console.log("- Avatar sex:", avatarSex);
  console.log("- Seed:", seed);

  // Create FormData object
  const formData = new FormData();
  
  // Add images as files (convert base64 to Blob)
  if (avatarImage) {
    const avatarBlob = dataURLtoBlob(avatarImage);
    if (!avatarBlob) {
      throw new Error('Failed to process avatar image. Please ensure it is a valid image in data URL format.');
    }
    formData.append('avatar_image', avatarBlob, 'avatar.jpg');
    console.log("Avatar image added to form data");
  }
  
  if (clothingImage) {
    const clothingBlob = dataURLtoBlob(clothingImage);
    if (!clothingBlob) {
      throw new Error('Failed to process clothing image. Please ensure it is a valid image in data URL format.');
    }
    formData.append('clothing_image', clothingBlob, 'clothing.jpg');
    console.log("Clothing image added to form data");
  }
  
  if (backgroundImage) {
    const backgroundBlob = dataURLtoBlob(backgroundImage);
    if (!backgroundBlob) {
      throw new Error('Failed to process background image. Please ensure it is a valid image in data URL format.');
    }
    formData.append('background_image', backgroundBlob, 'background.jpg');
    console.log("Background image added to form data");
  }
  
  // Add text prompts if provided
  if (avatarPrompt) {
    formData.append('avatar_prompt', avatarPrompt);
    console.log("Avatar prompt added to form data");
  }
  
  if (clothingPrompt) {
    formData.append('clothing_prompt', clothingPrompt);
    console.log("Clothing prompt added to form data");
  }
  
  if (backgroundPrompt) {
    formData.append('background_prompt', backgroundPrompt);
    console.log("Background prompt added to form data");
  }
  
  // Add avatar sex if provided
  if (avatarSex) {
    formData.append('avatar_sex', avatarSex);
    console.log("Avatar sex added to form data");
  }
  
  // Add seed
  formData.append('seed', seed.toString());
  console.log("Seed added to form data");
  
  // API call options
  const options = {
    method: 'POST',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    },
    body: formData
  };

  console.log("Making API call to:", `${API_URL}/try-on-file`);

  try {
    const response = await fetch(`${API_URL}/try-on-file`, options);
    console.log("API response status:", response.status, response.statusText);
    
    if (!response.ok) {
      let errorDetails = '';
      
      try {
        const errorData = await response.json();
        errorDetails = JSON.stringify(errorData);
        console.error("API error details:", errorData);
      } catch (e) {
        console.error("Failed to parse error response as JSON", e);
        // Try to get text response
        try {
          const errorText = await response.text();
          errorDetails = errorText.substring(0, 200); // Limit to first 200 chars
          console.error("API error text:", errorText);
        } catch (textError) {
          console.error("Failed to get error response text", textError);
        }
      }
      
      throw new Error(`API error (${response.status}): ${errorDetails}`);
    }
    
    // Convert response to blob
    const blob = await response.blob();
    console.log("Received blob response:", blob.type, blob.size, "bytes");
    
    // Convert blob to data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Converted API response to data URL");
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error converting API response to data URL:", error);
        throw new Error("Failed to convert API response to data URL");
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error in try-on API:', error);
    throw error;
  }
};

// Export additional helper functions as needed
export const getRandomSeed = () => Math.floor(Math.random() * 2147483647);