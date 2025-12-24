import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaShoppingCart, FaTimes, FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight } from 'react-icons/fa';
import CheckoutButton from './CheckoutButton';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef(null);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
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

  const subtotal = getCartTotal();
  const itemCount = getCartCount();

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          isDarkMode
            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        aria-label="Shopping Cart"
      >
        <FaShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 ${
              isDarkMode
                ? 'bg-gradient-to-r from-primary-dark to-primary-light'
                : 'bg-gradient-to-r from-primary-light to-primary-dark'
            } text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md`}
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </button>

      {/* Cart Dropdown */}
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
            
            {/* Cart Panel */}
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
                    <FaShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('cart.title', currentLanguage) || 'Shopping Cart'}
                    </h3>
                    {itemCount > 0 && (
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
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

              {/* Cart Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <FaShoppingCart className={`w-10 h-10 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {translate('cart.empty', currentLanguage) || 'Your cart is empty'}
                    </h4>
                    <p className={`text-sm text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {translate('cart.emptyHint', currentLanguage) || 'Add items to your cart to get started'}
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
                      {translate('cart.shopNow', currentLanguage) || 'Shop Now'}
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="p-6 space-y-4">
                      {cartItems.map((item) => (
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

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-lg ${
                                isDarkMode ? 'bg-gray-800' : 'bg-white'
                              }`}>
                                <button
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  className={`p-1 rounded transition-colors ${
                                    isDarkMode
                                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <FaMinus className="w-3 h-3" />
                                </button>
                                <span className={`text-sm font-medium w-8 text-center ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className={`p-1 rounded transition-colors ${
                                    isDarkMode
                                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  <FaPlus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
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
                    <div className={`p-6 border-t ${
                      isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      {/* Subtotal */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-base font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {translate('cart.subtotal', currentLanguage) || 'Subtotal'}
                        </span>
                        <span className={`text-lg font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Proceed to Checkout Button */}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/checkout');
                        }}
                        className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                          isDarkMode
                            ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                            : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                        }`}
                      >
                        <span>{translate('cart.proceedToCheckout', currentLanguage) || 'Proceed to Checkout'}</span>
                        <FaArrowRight className="w-4 h-4" />
                      </button>

                      {/* Continue Shopping */}
                      <Link
                        to="/shop"
                        onClick={() => setIsOpen(false)}
                        className={`block w-full mt-3 py-2.5 px-4 rounded-xl text-center font-medium transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {translate('cart.continueShopping', currentLanguage) || 'Continue Shopping'}
                      </Link>
                    </div>
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

export default ShoppingCart;
