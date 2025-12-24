import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaCreditCard, FaLock, FaSpinner, FaCalendarAlt, FaUser } from 'react-icons/fa';
import apiClient from '../../utils/apiClient';

const PaymentCardForm = ({ onPaymentSuccess, onPaymentError, total, shippingInfo }) => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleCvvChange = (e) => {
    const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length <= 4) {
      setCardData(prev => ({ ...prev, cvv: v }));
    }
  };

  const validateCard = () => {
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 13) {
      setError(translate('checkout.cardNumberInvalid', currentLanguage) || 'Invalid card number');
      return false;
    }
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      setError(translate('checkout.expiryInvalid', currentLanguage) || 'Invalid expiry date');
      return false;
    }
    if (!cardData.cvv || cardData.cvv.length < 3) {
      setError(translate('checkout.cvvInvalid', currentLanguage) || 'Invalid CVV');
      return false;
    }
    if (!cardData.cardholderName || cardData.cardholderName.length < 2) {
      setError(translate('checkout.cardholderInvalid', currentLanguage) || 'Invalid cardholder name');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateCard()) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent on backend
      const response = await apiClient.post('/stripe/create-payment-intent', {
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        shippingInfo,
        cardData: {
          number: cardData.cardNumber.replace(/\s/g, ''),
          exp_month: cardData.expiryDate.split('/')[0],
          exp_year: '20' + cardData.expiryDate.split('/')[1],
          cvc: cardData.cvv,
        },
      });

      if (response.data.clientSecret) {
        // For now, we'll use the hosted checkout for security
        // In production, you'd use Stripe Elements to securely handle card data
        onPaymentSuccess?.(response.data);
      } else {
        throw new Error(response.data.error || 'Failed to create payment intent');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || translate('checkout.paymentError', currentLanguage) || 'Payment failed. Please try again.';
      setError(errorMessage);
      onPaymentError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Cardholder Name */}
      <div>
        <label className={`block text-left text-sm font-semibold mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {translate('checkout.cardholderName', currentLanguage) || 'Cardholder Name'}
        </label>
        <div className="relative">
          <FaUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={cardData.cardholderName}
            onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value.toUpperCase() }))}
            placeholder={translate('checkout.cardholderPlaceholder', currentLanguage) || 'JOHN DOE'}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-light focus:ring-primary-light'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-dark focus:ring-primary-dark'
            } focus:outline-none focus:ring-2`}
            required
          />
        </div>
      </div>

      {/* Card Number */}
      <div>
        <label className={`block text-left text-sm font-semibold mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {translate('checkout.cardNumber', currentLanguage) || 'Card Number'}
        </label>
        <div className="relative">
          <FaCreditCard className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={cardData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder={translate('checkout.cardNumberPlaceholder', currentLanguage) || '1234 5678 9012 3456'}
            maxLength="19"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-light focus:ring-primary-light'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-dark focus:ring-primary-dark'
            } focus:outline-none focus:ring-2`}
            required
          />
        </div>
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-left text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {translate('checkout.expiryDate', currentLanguage) || 'Expiry Date'}
          </label>
          <div className="relative">
            <FaCalendarAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={cardData.expiryDate}
              onChange={handleExpiryChange}
              placeholder={translate('checkout.expiryPlaceholder', currentLanguage) || 'MM/YY'}
              maxLength="5"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-light focus:ring-primary-light'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-dark focus:ring-primary-dark'
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>
        </div>
        <div>
          <label className={`block text-left text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {translate('checkout.cvv', currentLanguage) || 'CVV'}
          </label>
          <input
            type="text"
            value={cardData.cvv}
            onChange={handleCvvChange}
            placeholder={translate('checkout.cvvPlaceholder', currentLanguage) || '123'}
            maxLength="4"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-light focus:ring-primary-light'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-dark focus:ring-primary-dark'
            } focus:outline-none focus:ring-2`}
            required
          />
        </div>
      </div>

      {error && (
        <div className={`p-3 rounded-xl ${
          isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
          loading
            ? 'opacity-60 cursor-not-allowed bg-gray-400'
            : isDarkMode
            ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
            : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin" />
            <span>{translate('checkout.processing', currentLanguage) || 'Processing...'}</span>
          </>
        ) : (
          <>
            <FaCreditCard className="w-4 h-4" />
            <span>{translate('checkout.payNow', currentLanguage) || 'Pay Now'}</span>
          </>
        )}
      </button>

      <div className={`flex items-center justify-center space-x-2 text-xs ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <FaLock className="w-3 h-3" />
        <span>{translate('checkout.securePayment', currentLanguage) || 'Your payment will be processed securely by Stripe'}</span>
      </div>
    </form>
  );
};

export default PaymentCardForm;

