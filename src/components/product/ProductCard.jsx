import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { translate } from '../../utils/translate';
import RegisterModal from '../auth/RegisterModal';
import LoginModal from '../auth/LoginModal';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

  if (!product) return null;
  
  // Destructure with default values for optional properties
  const { 
    id, 
    name, 
    price, 
    image, 
    category, 
    rating = 0, 
    reviewCount = 0, 
    sizes = [], 
    colors = [], 
    isNew = false, 
    isFeatured = false 
  } = product;

  // Function to handle try-on click
  const handleTryOn = (e) => {
    e.preventDefault();
    
    // Convert image path to data URL before navigating
    const img = new Image();
    img.crossOrigin = "anonymous"; // To handle potential CORS issues
    img.onload = () => {
      // Create canvas to convert image to data URL
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas and get data URL
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/jpeg');
        // Navigate with the data URL
        navigate('/try-on', { state: { selectedClothing: dataURL } });
      } catch (err) {
        // Fallback - navigate with original image path
        navigate('/try-on', { state: { selectedClothing: image } });
      }
    };
    
    img.onerror = () => {
      navigate('/try-on', { state: { selectedClothing: image } });
    };
    
    img.src = image;
  };

  // Function to render color swatches
  const renderColorSwatches = () => {
    // Ensure colors exists
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return null; // Don't render anything if no colors
    }

    const colorMap = {
      'white': 'bg-white border border-gray-200',
      'black': 'bg-black',
      'grey': 'bg-gray-500',
      'blue': 'bg-blue-500',
      'navy': 'bg-blue-800',
      'red': 'bg-red-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-400',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-400',
      'orange': 'bg-orange-500',
      'brown': 'bg-amber-700',
      'beige': 'bg-amber-100',
      'floral': 'bg-gradient-to-r from-pink-300 via-green-200 to-blue-300',
      'denim': 'bg-blue-700',
    };

    return (
      <div className="flex space-x-1 mt-2">
        {colors.map(color => (
          <div key={color} className={`${colorMap[color] || 'bg-gray-200'} w-4 h-4 rounded-full`} title={color.charAt(0).toUpperCase() + color.slice(1)}></div>
        ))}
      </div>
    );
  };

  // Render star rating
  const renderRating = () => {
    // Ensure rating exists
    if (rating === undefined || rating === null) {
      return null;
    }

    return (
      <div className="flex items-center mt-1">
        <div className="flex text-yellow-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 ${star <= Math.round(rating) ? 'fill-current' : 'text-gray-300'}`} 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-1 text-xs text-gray-500">({reviewCount || 0})</span>
      </div>
    );
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    // Optional: Show a success message or animation
  };

  // Check if the product is in the wishlist
  const isInWishlist = wishlistItems.some(item => item.id === id);

  // Toggle wishlist status
  const toggleWishlist = (e) => {
    e.preventDefault();
    
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
    <motion.div 
      className="group relative"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="block overflow-hidden bg-white dark:bg-surface-dark rounded-xl shadow-lg hover:shadow-2xl dark:shadow-gray-800 dark:hover:shadow-gray-700/50 transition-all duration-300 h-full cursor-pointer">
        <div className="relative overflow-hidden">
          {/* Image Container - Fixed aspect ratio */}
          <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          
          {/* Badges - Consistent spacing and sizing */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {isNew && (
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                {translate('product.new', currentLanguage) || "NEW"}
              </span>
            )}
            {isFeatured && (
              <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                {translate('product.featured', currentLanguage) || "FEATURED"}
              </span>
            )}
          </div>
          
          {/* Action Icons - Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
            {/* Preview Button */}
            <motion.button 
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowPreview(true); }}
              className="bg-white/95 dark:bg-gray-800/95 text-primary dark:text-primary-light rounded-xl p-3 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-800 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={translate('product.preview', currentLanguage) || "Preview"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </motion.button>
            {/* Like Button */}
            <motion.button 
              onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(e); }}
              className={`bg-white/95 dark:bg-gray-800/95 ${isInWishlist ? 'text-red-500' : 'text-primary dark:text-primary-light'} rounded-xl p-3 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-800 transition-colors shadow-lg`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={isInWishlist ? translate('wishlist.remove', currentLanguage) || "Remove from Wishlist" : translate('wishlist.addToWishlist', currentLanguage) || "Add to Wishlist"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.button>
            {/* Try On Button */}
            <motion.button 
              onClick={e => { e.preventDefault(); e.stopPropagation(); handleTryOn(e); }}
              className="bg-white/95 dark:bg-gray-800/95 text-primary dark:text-primary-light rounded-xl p-3 hover:bg-primary hover:text-white dark:hover:bg-primary-light dark:hover:text-gray-800 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={translate('product.tryOnThis', currentLanguage) || "Try On This Item"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Product Info Section - Improved spacing and structure */}
        <div className="p-5">
          {/* Category */}
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-medium">
            {category ? translate(`shop.category.${category.replace('-', '')}`, currentLanguage) || category.replace('-', ' ') : translate('product.uncategorized', currentLanguage) || 'Uncategorized'}
          </div>
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 dark:text-white text-lg leading-tight mb-2 truncate">
            {name || 'Product Name'}
          </h3>
          
          {/* Rating */}
          {renderRating()}
          
          {/* Product Details - Colors, Sizes, Price */}
          <div className="mt-3 flex justify-between items-end">
            <div className="flex flex-col">
              {/* Color Swatches */}
              {renderColorSwatches()}
              
              {/* Sizes */}
              {sizes && sizes.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {sizes.join(' · ')}
                </div>
              )}
            </div>
            
            {/* Price */}
            <div className="text-lg font-bold text-primary dark:text-primary-light">
              ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
            </div>
          </div>
          
          {/* Add to Cart Button - Enhanced visibility */}
          <div className="py-3 mt-4 border-t border-gray-100 dark:border-gray-700">
            <motion.button
              onClick={e => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e); }}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {translate('product.addToCart', currentLanguage) || "Add to Cart"}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-all duration-300" onClick={() => setShowPreview(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-stretch rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-400 text-3xl font-bold bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-md z-10"
              onClick={() => setShowPreview(false)}
              aria-label="Close preview"
            >
              &times;
            </button>
            {/* Image left, details right on desktop; stacked on mobile */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-900 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
              <PreviewImage src={image} alt={name} />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start px-8 py-6 gap-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center md:text-left truncate max-w-full mb-1">{name}</h2>
              {/* Price */}
              <div className="text-lg font-bold text-primary dark:text-primary-light mb-1">${typeof price === 'number' ? price.toFixed(2) : '0.00'}</div>
              {/* Category */}
              <div className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1 font-medium">
                {category ? translate(`shop.category.${category.replace('-', '')}`, currentLanguage) || category.replace('-', ' ') : translate('product.uncategorized', currentLanguage) || 'Uncategorized'}
              </div>
              {/* Rating */}
              <div className="mb-1">{renderRating()}</div>
              {/* Sizes */}
              {sizes && sizes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">Sizes:</span>
                  <span className="text-xs text-gray-700 dark:text-gray-100 font-semibold">{sizes.join(' · ')}</span>
                </div>
              )}
              {/* Colors */}
              {colors && colors.length > 0 && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">Colors:</span>
                  <div className="flex space-x-1">{renderColorSwatches()}</div>
                </div>
              )}
              {/* Description */}
              {product.description && (
                <div className="mt-2 text-sm text-gray-700 dark:text-gray-200 text-left max-w-xl">
                  {product.description}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

    {/* Auth Modals */}
    <RegisterModal
      isOpen={false}
      onClose={() => {}}
      onSwitchToLogin={() => {}}
    />
    <LoginModal
      isOpen={false}
      onClose={() => {}}
      onSwitchToRegister={() => {}}
    />
    </>
  );
};

// Default props for development testing
ProductCard.defaultProps = {
  product: {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'T-Shirts',
    isFeatured: true,
  }
};

export default ProductCard; 

// Add this helper component at the bottom of the file
function PreviewImage({ src, alt }) {
  const [error, setError] = React.useState(false);
  return error ? (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-gray-200/60 to-gray-400/40 dark:from-gray-800/60 dark:to-gray-900/40 rounded-3xl">
      <svg xmlns='http://www.w3.org/2000/svg' className='h-20 w-20 text-gray-400 dark:text-gray-600 mb-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L6 21h12l-3.75-4M12 3v13' />
      </svg>
      <span className="text-gray-500 dark:text-gray-300 text-lg">Image not available</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className="w-full h-[80vh] object-cover bg-white/30 dark:bg-gray-900/30 rounded-3xl transition-all duration-300"
      style={{ aspectRatio: '3/4', background: 'transparent' }}
      onError={() => setError(true)}
    />
  );
}