import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = (item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <>
      {/* Wishlist Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        aria-label="Wishlist"
      >
        <FaHeart className="w-4 h-4 sm:w-5 sm:h-5" />
        {wishlistItems.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800"
          >
            {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
          </motion.span>
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed right-0 top-0 h-screen w-full sm:w-[450px] md:w-[500px] shadow-2xl z-[9999] flex flex-col ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`}
            >
              {/* Header - Fixed */}
              <div className={`flex-shrink-0 flex items-center justify-between px-6 py-5 border-b ${
                isDarkMode ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-md">
                    <FaHeart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('wishlist.title', currentLanguage) || 'My Wishlist'}
                    </h2>
                    {wishlistItems.length > 0 && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label="Close"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {!wishlistItems || wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                    <div className={`flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <FaHeartBroken className={`w-10 h-10 ${
                        isDarkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Your wishlist is empty
                    </h3>
                    <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Save items you love for later
                    </p>
                    <Link
                      to="/shop"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-4 space-y-3">
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={`wishlist-${item.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className={`group flex gap-3 p-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-700/50 hover:border-red-500/50 hover:bg-gray-800' 
                            : 'bg-white border-gray-200 hover:border-pink-400/50 hover:shadow-md'
                        }`}
                      >
                        {/* Product Image */}
                        <Link 
                          to={`/product/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex-shrink-0"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link 
                              to={`/product/${item.id}`}
                              onClick={() => setIsOpen(false)}
                            >
                              <h4 className={`text-sm font-semibold line-clamp-2 mb-1 hover:text-primary-light transition-colors ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.name}
                              </h4>
                            </Link>
                            
                            {item.category && (
                              <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.category}
                              </p>
                            )}
                            
                            <p className={`text-base font-bold ${
                              isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                            }`}>
                              ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={(e) => handleAddToCart(item, e)}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white shadow-sm hover:shadow-md"
                            >
                              <FaShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                            
                            <button
                              onClick={() => removeFromWishlist(item.id)}
                              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                                isDarkMode
                                  ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                                  : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                              }`}
                              aria-label="Remove"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              {wishlistItems.length > 0 && (
                <div className={`flex-shrink-0 border-t px-4 py-4 ${
                  isDarkMode ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
                }`}>
                  <button
                    onClick={clearWishlist}
                    className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Wishlist;
