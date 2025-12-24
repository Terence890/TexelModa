import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../utils/translate';
import { 
  FaShoppingCart, 
  FaChevronLeft, 
  FaCreditCard, 
  FaTruck, 
  FaMapMarkerAlt,
  FaLock,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import CheckoutButton from '../components/ecommerce/CheckoutButton';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // The CheckoutButton component handles the Stripe redirect
    // This form validation ensures all required fields are filled
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className={`inline-flex items-center space-x-2 mb-4 px-4 py-2 rounded-xl transition-all duration-200 ${
              isDarkMode
                ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
            <span className="font-medium">{translate('checkout.backToShop', currentLanguage) || 'Back to Shop'}</span>
          </Link>
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {translate('checkout.title', currentLanguage) || 'Checkout'}
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {translate('checkout.subtitle', currentLanguage) || 'Complete your order below'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl shadow-lg p-6 ${
                  isDarkMode
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaTruck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {translate('checkout.shipping', currentLanguage) || 'Shipping Information'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-left text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translate('checkout.fullName', currentLanguage) || 'Full Name'}
                      </label>
                      <div className="relative">
                        <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="text"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingChange}
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                          } focus:outline-none focus:ring-2`}
                          placeholder={translate('checkout.fullNamePlaceholder', currentLanguage) || 'John Doe'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-left text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translate('checkout.email', currentLanguage) || 'Email'}
                      </label>
                      <div className="relative">
                        <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                          type="email"
                          name="email"
                          value={shippingInfo.email}
                          onChange={handleShippingChange}
                          required
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                          } focus:outline-none focus:ring-2`}
                          placeholder={translate('checkout.emailPlaceholder', currentLanguage) || 'your@email.com'}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-left text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {translate('checkout.phone', currentLanguage) || 'Phone Number'}
                    </label>
                    <div className="relative">
                      <FaPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                        } focus:outline-none focus:ring-2`}
                        placeholder={translate('checkout.phonePlaceholder', currentLanguage) || '+1 234 567 8900'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-left text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {translate('checkout.address', currentLanguage) || 'Address'}
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        required
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                        } focus:outline-none focus:ring-2`}
                        placeholder={translate('checkout.addressPlaceholder', currentLanguage) || '123 Main Street'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-left text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translate('checkout.city', currentLanguage) || 'City'}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                        } focus:outline-none focus:ring-2`}
                        placeholder={translate('checkout.cityPlaceholder', currentLanguage) || 'City'}
                      />
                    </div>
                    <div>
                      <label className={`block text-left text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translate('checkout.state', currentLanguage) || 'State'}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                        } focus:outline-none focus:ring-2`}
                        placeholder={translate('checkout.statePlaceholder', currentLanguage) || 'State'}
                      />
                    </div>
                    <div>
                      <label className={`block text-left text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {translate('checkout.postalCode', currentLanguage) || 'Postal Code'}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        required
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                        } focus:outline-none focus:ring-2`}
                        placeholder={translate('checkout.postalCodePlaceholder', currentLanguage) || '12345'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-left text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {translate('checkout.country', currentLanguage) || 'Country'}
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 appearance-none cursor-pointer ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                      } focus:outline-none focus:ring-2`}
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
                      <option value="Italy">Italy</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`rounded-2xl shadow-lg p-6 ${
                  isDarkMode
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaCreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {translate('checkout.payment', currentLanguage) || 'Payment Method'}
                  </h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? isDarkMode
                        ? 'bg-gray-700 border-2 border-primary-light'
                        : 'bg-gray-50 border-2 border-primary-dark'
                      : isDarkMode
                      ? 'bg-gray-700/50 border-2 border-gray-600 hover:border-gray-500'
                      : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <FaCreditCard className={`w-5 h-5 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`} />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('checkout.card', currentLanguage) || 'Credit/Debit Card'}
                    </span>
                    <div className="ml-auto">
                      <FaLock className={`w-4 h-4 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </label>
                  <p className={`text-xs pl-11 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {translate('checkout.securePayment', currentLanguage) || 'Your payment will be processed securely by Stripe'}
                  </p>
                </div>

              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`sticky top-8 rounded-2xl shadow-lg p-6 ${
                  isDarkMode
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {translate('checkout.orderSummary', currentLanguage) || 'Order Summary'}
                  </h2>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className={`text-sm font-bold ${
                        isDarkMode ? 'text-primary-light' : 'text-primary-dark'
                      }`}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className={`border-t pt-4 space-y-3 mb-6 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {translate('checkout.subtotal', currentLanguage) || 'Subtotal'}
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {translate('checkout.shipping', currentLanguage) || 'Shipping'}
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {shipping === 0 ? (
                        <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {translate('checkout.free', currentLanguage) || 'Free'}
                        </span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {translate('checkout.tax', currentLanguage) || 'Tax'}
                    </span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between pt-3 border-t ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('checkout.total', currentLanguage) || 'Total'}
                    </span>
                    <span className={`text-lg font-bold ${
                      isDarkMode ? 'text-primary-light' : 'text-primary-dark'
                    }`}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <CheckoutButton items={cartItems} />

                {/* Security Badge */}
                <div className={`mt-4 flex items-center justify-center space-x-2 text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FaLock className="w-3 h-3" />
                  <span>{translate('checkout.secureCheckout', currentLanguage) || 'Secure Checkout'}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;

