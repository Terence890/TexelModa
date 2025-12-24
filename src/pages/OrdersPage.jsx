import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../utils/translate';
import { getOrders, getOrder, cancelOrder } from '../api/orders';
import { 
  FaBox, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaTimes, 
  FaEye,
  FaSpinner,
  FaShoppingBag
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await getOrders(params);
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await getOrder(orderId);
      if (response.data.success) {
        setSelectedOrder(response.data.data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order details');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(translate('orders.confirmCancel', currentLanguage) || 'Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await cancelOrder(orderId);
      if (response.data.success) {
        loadOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="w-5 h-5" />;
      case 'processing':
        return <FaBox className="w-5 h-5" />;
      case 'shipped':
        return <FaTruck className="w-5 h-5" />;
      case 'delivered':
        return <FaCheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <FaTimes className="w-5 h-5" />;
      default:
        return <FaBox className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'processing':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'shipped':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'delivered':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filters = [
    { id: 'all', label: translate('orders.all', currentLanguage) || 'All Orders' },
    { id: 'pending', label: translate('orders.pending', currentLanguage) || 'Pending' },
    { id: 'processing', label: translate('orders.processing', currentLanguage) || 'Processing' },
    { id: 'shipped', label: translate('orders.shipped', currentLanguage) || 'Shipped' },
    { id: 'delivered', label: translate('orders.delivered', currentLanguage) || 'Delivered' },
    { id: 'cancelled', label: translate('orders.cancelled', currentLanguage) || 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {translate('orders.title', currentLanguage) || 'My Orders'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {translate('orders.subtitle', currentLanguage) || 'View and manage your orders'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white shadow-md'
                    : 'bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-md'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl ${
              isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
            }`}
          >
            <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="w-8 h-8 animate-spin text-primary-light" />
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-lg p-12 text-center ${
              isDarkMode
                ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
            }`}
          >
            <FaShoppingBag className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {translate('orders.noOrders', currentLanguage) || 'No orders found'}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {translate('orders.noOrdersDesc', currentLanguage) || 'You haven\'t placed any orders yet.'}
            </p>
            <Link
              to="/shop"
              className={`inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
              }`}
            >
              {translate('orders.shopNow', currentLanguage) || 'Shop Now'}
            </Link>
          </motion.div>
        )}

        {/* Orders Grid */}
        {!isLoading && orders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl shadow-lg overflow-hidden ${
                    isDarkMode
                      ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                      : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-lg font-semibold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {translate('orders.orderNumber', currentLanguage) || 'Order'} {order.orderNumber}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium">
                          {translate(`orderTracking.status.${order.status}`, currentLanguage) || order.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 object-cover"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className={`w-12 h-12 rounded-lg border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-semibold ${
                            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('orders.total', currentLanguage) || 'Total'}
                        </p>
                        <p className={`text-xl font-bold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {['pending', 'processing'].includes(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            {translate('orders.cancel', currentLanguage) || 'Cancel'}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                              : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
                          }`}
                        >
                          <FaEye className="w-4 h-4 inline mr-2" />
                          {translate('orders.view', currentLanguage) || 'View'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Details Sidebar */}
            <div className="lg:col-span-1">
              <AnimatePresence>
                {selectedOrder && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`rounded-2xl shadow-lg p-6 sticky top-6 ${
                      isDarkMode
                        ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                        : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {translate('orders.orderDetails', currentLanguage) || 'Order Details'}
                      </h3>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className={`p-2 rounded-lg ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                        }`}
                      >
                        <FaTimes className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('orders.orderNumber', currentLanguage) || 'Order Number'}
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedOrder.orderNumber}
                        </p>
                      </div>

                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('orders.date', currentLanguage) || 'Date'}
                        </p>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatDate(selectedOrder.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('orders.status', currentLanguage) || 'Status'}
                        </p>
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="text-sm font-medium">
                            {translate(`orderTracking.status.${selectedOrder.status}`, currentLanguage) || selectedOrder.status}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('orders.items', currentLanguage) || 'Items'}
                        </p>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {item.name}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex justify-between">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {translate('checkout.subtotal', currentLanguage) || 'Subtotal'}
                          </span>
                          <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                            ${selectedOrder.subtotal.toFixed(2)}
                          </span>
                        </div>
                        {selectedOrder.shippingCost > 0 && (
                          <div className="flex justify-between">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {translate('checkout.shipping', currentLanguage) || 'Shipping'}
                            </span>
                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                              ${selectedOrder.shippingCost.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.tax > 0 && (
                          <div className="flex justify-between">
                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {translate('checkout.tax', currentLanguage) || 'Tax'}
                            </span>
                            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                              ${selectedOrder.tax.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {translate('checkout.total', currentLanguage) || 'Total'}
                          </span>
                          <span className={`text-xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            ${selectedOrder.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {selectedOrder.shippingAddress && (
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className={`text-sm mb-2 text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {translate('orders.shippingAddress', currentLanguage) || 'Shipping Address'}
                          </p>
                          <p className={`text-sm text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedOrder.shippingAddress.fullName}<br />
                            {selectedOrder.shippingAddress.address}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}<br />
                            {selectedOrder.shippingAddress.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;

