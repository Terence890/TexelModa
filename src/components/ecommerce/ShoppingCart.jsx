import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaShoppingCart, FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
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

  const subtotal = getCartTotal();
  const itemCount = getCartCount();

  return (
    <>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative p-2 sm:p-2.5 rounded-full sm:rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        aria-label="Shopping Cart"
      >
        <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-light to-primary-dark text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-800"
          >
            {itemCount > 9 ? '9+' : itemCount}
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
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light to-primary-dark shadow-md">
                    <FaShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('cart.title', currentLanguage) || 'Shopping Cart'}
                    </h2>
                    {itemCount > 0 && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
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
                {!cartItems || cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-6 py-12">
                    <div className={`flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <FaShoppingCart className={`w-10 h-10 ${
                        isDarkMode ? 'text-gray-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Your cart is empty
                    </h3>
                    <p className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Add items to your cart to get started
                    </p>
                    <Link
                      to="/shop"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="px-4 py-4 space-y-3">
                    {cartItems.map((item, index) => {
                      const itemImage = item.image || '/images/products/female_01.jpg';
                      const itemName = item.name || 'Product';
                      const itemPrice = typeof item.price === 'number' ? item.price : 0;
                      
                      return (
                        <motion.div
                          key={`cart-${item.id}-${item.size || 'default'}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.03 }}
                          className={`group flex gap-3 p-3 rounded-xl border transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-gray-800/50 border-gray-700/50 hover:border-primary-dark/50 hover:bg-gray-800' 
                              : 'bg-white border-gray-200 hover:border-primary-light/50 hover:shadow-md'
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
                                src={itemImage}
                                alt={itemName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = '/images/products/female_01.jpg';
                                }}
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
                                  {itemName}
                                </h4>
                              </Link>
                              
                              {item.size && (
                                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Size: <span className="font-medium">{item.size}</span>
                                </p>
                              )}
                              
                              <p className={`text-base font-bold ${
                                isDarkMode ? 'text-primary-dark' : 'text-primary-light'
                              }`}>
                                ${itemPrice.toFixed(2)}
                              </p>
                            </div>

                            {/* Quantity Controls & Remove */}
                            <div className="flex items-center justify-between mt-2">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${
                                isDarkMode 
                                  ? 'bg-gray-900/50 border-gray-600/50' 
                                  : 'bg-gray-50 border-gray-300'
                              }`}>
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.size || '', item.color || '')}
                                  disabled={item.quantity <= 1}
                                  className={`flex items-center justify-center w-7 h-7 rounded transition-colors ${
                                    item.quantity <= 1
                                      ? 'opacity-40 cursor-not-allowed'
                                      : isDarkMode
                                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                  }`}
                                  aria-label="Decrease"
                                >
                                  <FaMinus className="w-3 h-3" />
                                </button>
                                
                                <span className={`text-sm font-semibold min-w-[2rem] text-center ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.size || '', item.color || '')}
                                  className={`flex items-center justify-center w-7 h-7 rounded transition-colors ${
                                    isDarkMode
                                      ? 'hover:bg-gray-800 text-gray-300 hover:text-white'
                                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                                  }`}
                                  aria-label="Increase"
                                >
                                  <FaPlus className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(item.id, item.size || '', item.color || '')}
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
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer - Fixed */}
              {cartItems.length > 0 && (
                <div className={`flex-shrink-0 border-t px-4 py-4 space-y-3 ${
                  isDarkMode ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
                }`}>
                  {/* Subtotal */}
                  <div className="flex items-center justify-between px-2">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Subtotal
                    </span>
                    <span className={`text-xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    to="/shop"
                    onClick={() => setIsOpen(false)}
                    className={`block w-full py-2.5 px-4 rounded-lg text-center text-sm font-semibold transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShoppingCart;
