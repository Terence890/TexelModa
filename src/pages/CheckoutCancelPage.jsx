import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../utils/translate';
import { FaTimesCircle, FaShoppingCart, FaHome, FaArrowLeft } from 'react-icons/fa';

const CheckoutCancelPage = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();

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
          {/* Cancel Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDarkMode
                ? 'bg-gradient-to-br from-orange-500 to-orange-600'
                : 'bg-gradient-to-br from-orange-400 to-orange-500'
            }`}
          >
            <FaTimesCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Cancel Message */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {translate('checkout.cancel.title', currentLanguage) || 'Payment Cancelled'}
          </h1>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translate('checkout.cancel.message', currentLanguage) || 'Your payment was cancelled'}
          </p>
          <p className={`text-sm mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {translate('checkout.cancel.hint', currentLanguage) || "Don't worry, your cart items are still saved. You can complete your purchase anytime."}
          </p>

          {/* Info Card */}
          <div className={`rounded-xl p-6 mb-8 ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {translate('checkout.cancel.help', currentLanguage) || 'If you experienced any issues during checkout, please contact our support team for assistance.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/checkout"
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
              }`}
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>{translate('checkout.cancel.tryAgain', currentLanguage) || 'Try Again'}</span>
            </Link>
            <Link
              to="/"
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FaHome className="w-4 h-4" />
              <span>{translate('checkout.cancel.backHome', currentLanguage) || 'Back to Home'}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;

