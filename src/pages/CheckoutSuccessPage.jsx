import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { translate } from '../utils/translate';
import { FaCheckCircle, FaShoppingBag, FaHome, FaBox } from 'react-icons/fa';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const session = searchParams.get('session_id');
    if (session) {
      setSessionId(session);
      // Clear cart after successful payment
      clearCart();
    }
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-2xl p-8 md:p-12 text-center ${
            isDarkMode
              ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
              : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
          }`}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-green-400 to-green-500'
            }`}
          >
            <FaCheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {translate('checkout.success.title', currentLanguage) || 'Payment Successful!'}
          </h1>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translate('checkout.success.message', currentLanguage) || 'Thank you for your purchase!'}
          </p>
          {sessionId && (
            <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {translate('checkout.success.orderId', currentLanguage) || 'Order ID'}: {sessionId}
            </p>
          )}

          {/* Info Card */}
          <div className={`rounded-xl p-6 mb-8 ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FaBox className={`w-5 h-5 ${isDarkMode ? 'text-primary-light' : 'text-primary-dark'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {translate('checkout.success.whatsNext', currentLanguage) || "What's Next?"}
              </h3>
            </div>
            <ul className={`text-left space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{translate('checkout.success.email', currentLanguage) || 'You will receive an email confirmation shortly'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{translate('checkout.success.tracking', currentLanguage) || 'Track your order in your account'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>{translate('checkout.success.shipping', currentLanguage) || 'Your order will be shipped within 2-3 business days'}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account"
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FaShoppingBag className="w-4 h-4" />
              <span>{translate('checkout.success.viewOrders', currentLanguage) || 'View Orders'}</span>
            </Link>
            <Link
              to="/"
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>{translate('checkout.success.backHome', currentLanguage) || 'Back to Home'}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

