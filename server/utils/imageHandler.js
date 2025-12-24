import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Copy image from source to public folder
 * @param {string} sourcePath - Source image path
 * @param {string} filename - Destination filename
 * @returns {string} - Public URL path
 */
export const copyImageToPublic = (sourcePath, filename) => {
  try {
    // Create products directory in public if it doesn't exist
    const publicProductsDir = path.join(process.cwd(), 'public', 'images', 'products');
    if (!fs.existsSync(publicProductsDir)) {
      fs.mkdirSync(publicProductsDir, { recursive: true });
    }

    // Get source file
    const sourceFile = path.resolve(sourcePath);
    
    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`Source file not found: ${sourceFile}`);
    }

    // Destination path
    const destPath = path.join(publicProductsDir, filename);

    // Copy file
    fs.copyFileSync(sourceFile, destPath);

    // Return public URL path
    return `/images/products/${filename}`;
  } catch (error) {
    console.error('Error copying image:', error);
    throw error;
  }
};

/**
 * Get image filename from path
 * @param {string} imagePath - Image path
 * @returns {string} - Filename
 */
export const getImageFilename = (imagePath) => {
  // Handle different path formats
  if (imagePath.includes('/')) {
    return path.basename(imagePath);
  }
  return imagePath;
};

/**
 * Check if image exists in public folder
 * @param {string} imagePath - Image path
 * @returns {boolean}
 */
export const imageExists = (imagePath) => {
  try {
    const publicProductsDir = path.join(process.cwd(), 'public', 'images', 'products');
    const filename = getImageFilename(imagePath);
    const fullPath = path.join(publicProductsDir, filename);
    return fs.existsSync(fullPath);
  } catch (error) {
    return false;
  }
};

/**
 * Delete image from public folder
 * @param {string} imagePath - Image path or filename
 */
export const deleteImage = (imagePath) => {
  try {
    const publicProductsDir = path.join(process.cwd(), 'public', 'images', 'products');
    const filename = getImageFilename(imagePath);
    const fullPath = path.join(publicProductsDir, filename);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

