import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaBox, FaSearch, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

const OrderTracking = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackOrder = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrder({
        id: orderNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-03-20',
        currentLocation: 'Distribution Center',
        trackingNumber: 'TRK123456789',
        steps: [
          { status: 'orderTracking.status.pending', completed: true, date: '2024-03-15' },
          { status: 'orderTracking.status.processing', completed: true, date: '2024-03-16' },
          { status: 'orderTracking.status.shipped', completed: true, date: '2024-03-17' },
          { status: 'orderTracking.status.delivered', completed: false, date: null },
        ],
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {translate('orderTracking.title', currentLanguage) || 'Track Your Order'}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {translate('orderTracking.subtitle', currentLanguage) || 'Enter your order number to track your shipment'}
        </p>
      </div>

      {/* Search Form */}
      <div className={`rounded-2xl shadow-lg p-6 ${
        isDarkMode
          ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
          : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
      }`}>
        <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={translate('orderTracking.enterOrderNumber', currentLanguage) || 'Enter your order number'}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !orderNumber.trim()}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
              isLoading || !orderNumber.trim()
                ? 'opacity-60 cursor-not-allowed bg-gray-400'
                : isDarkMode
                ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
            }`}
          >
            <FaSearch className="w-4 h-4" />
            <span>{isLoading ? 'Tracking...' : translate('orderTracking.track', currentLanguage) || 'Track'}</span>
          </button>
        </form>
      </div>

      {/* Order Details */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order Info Card */}
          <div className={`rounded-2xl shadow-lg p-6 ${
            isDarkMode
              ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
              : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {translate('orderTracking.orderNumber', currentLanguage) || 'Order Number'}
                </p>
                <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {order.id}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {translate('orderTracking.trackingNumber', currentLanguage) || 'Tracking Number'}
                </p>
                <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {order.trackingNumber}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {translate('orderTracking.status', currentLanguage) || 'Status'}
                </p>
                <p className={`text-base font-semibold ${
                  isDarkMode ? 'text-primary-light' : 'text-primary-dark'
                }`}>
                  {order.status}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {translate('orderTracking.estimatedDelivery', currentLanguage) || 'Estimated Delivery'}
                </p>
                <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {order.estimatedDelivery}
                </p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className={`rounded-2xl shadow-lg p-6 ${
            isDarkMode
              ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
              : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
          }`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {translate('orderTracking.timeline', currentLanguage) || 'Order Timeline'}
            </h3>
            <div className="relative">
              {order.steps.map((step, index) => (
                <div key={step.status} className="flex items-start mb-6 last:mb-0">
                  <div className="flex flex-col items-center mr-4 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                      step.completed
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                          : 'bg-gradient-to-br from-primary-light to-primary-dark'
                        : isDarkMode
                        ? 'bg-gray-700 border-2 border-gray-600'
                        : 'bg-gray-200 border-2 border-gray-300'
                    }`}>
                      {step.completed ? (
                        <FaCheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <FaClock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </div>
                    {index < order.steps.length - 1 && (
                      <div className={`w-0.5 h-12 mt-2 ${
                        step.completed
                          ? isDarkMode
                            ? 'bg-gradient-to-b from-primary-dark to-primary-light'
                            : 'bg-gradient-to-b from-primary-light to-primary-dark'
                          : isDarkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-semibold mb-1 ${
                      step.completed
                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {translate(step.status, currentLanguage)}
                    </p>
                    {step.date && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!order && !isLoading && (
        <div className={`rounded-2xl shadow-lg p-12 text-center ${
          isDarkMode
            ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
            : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <FaBox className={`text-4xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {translate('orderTracking.empty', currentLanguage) || 'No order tracked'}
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {translate('orderTracking.emptyHint', currentLanguage) || 'Enter an order number above to track your shipment'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
