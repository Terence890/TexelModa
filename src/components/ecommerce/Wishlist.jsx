import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaHeart, FaTimes, FaTrash, FaShoppingCart, FaHeartBroken } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const wishlistRef = useRef(null);

  // Close wishlist when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAddToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <div className="relative" ref={wishlistRef}>
      {/* Wishlist Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        aria-label="Wishlist"
      >
        <FaHeart className="w-5 h-5" />
        {wishlistItems.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 ${
              isDarkMode
                ? 'bg-gradient-to-r from-primary-dark to-primary-light'
                : 'bg-gradient-to-r from-primary-light to-primary-dark'
            } text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md`}
          >
            {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
          </motion.span>
        )}
      </button>

      {/* Wishlist Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            {/* Wishlist Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl z-50 ${
                isDarkMode
                  ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                  : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
              }`}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaHeart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('wishlist.title', currentLanguage) || 'Wishlist'}
                    </h3>
                    {wishlistItems.length > 0 && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <FaHeartBroken className={`w-10 h-10 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {translate('wishlist.empty', currentLanguage) || 'Your wishlist is empty'}
                    </h4>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {translate('wishlist.emptyHint', currentLanguage) || 'Add items to your wishlist to save them for later'}
                    </p>
                    <Link
                      to="/shop"
                      onClick={() => setIsOpen(false)}
                      className={`mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                          : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                      }`}
                    >
                      {translate('wishlist.shopNow', currentLanguage) || 'Shop Now'}
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Wishlist Items */}
                    <div className="p-6 space-y-4">
                      {wishlistItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start space-x-4 p-4 rounded-xl ${
                            isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                          }`}
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-xl"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-semibold mb-1 truncate ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {item.name}
                            </h4>
                            <p className={`text-sm font-bold mb-3 ${
                              isDarkMode ? 'text-primary-light' : 'text-primary-dark'
                            }`}>
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAddToCart(item)}
                                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                                  isDarkMode
                                    ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                                    : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                                }`}
                              >
                                <FaShoppingCart className="w-3.5 h-3.5" />
                                <span className="text-xs">{translate('wishlist.addToCart', currentLanguage) || 'Add to Cart'}</span>
                              </button>
                              <button
                                onClick={() => removeFromWishlist(item.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isDarkMode
                                    ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                                }`}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Footer */}
                    {wishlistItems.length > 0 && (
                      <div className={`p-6 border-t ${
                        isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                      }`}>
                        <button
                          onClick={clearWishlist}
                          className={`w-full py-2.5 px-4 rounded-xl text-center font-medium transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {translate('wishlist.clearAll', currentLanguage) || 'Clear Wishlist'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wishlist;
