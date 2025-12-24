import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';
import apiClient from '../../utils/apiClient';

const CheckoutButton = ({ items = [] }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();

  const payloadItems = items.map((it) => ({
    name: it.name,
    quantity: it.quantity || 1,
    price: it.price,
    unit_amount: Math.round(it.price * 100),
    image: it.image,
    currency: it.currency || 'usd'
  }));

  const handleCheckout = async () => {
    if (!items || items.length === 0) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/stripe/create-checkout-session', {
        items: payloadItems,
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      });

      if (res.data.url) {
        window.location.href = res.data.url;
        return;
      }

      throw new Error('No checkout URL received');
    } catch (err) {
      // Error handling - could show a toast notification here
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert(translate('checkout.error', currentLanguage) || 'Unable to create checkout session. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
        loading || items.length === 0
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
          <span>{translate('checkout.proceedToPayment', currentLanguage) || 'Proceed to Payment'}</span>
        </>
      )}
    </button>
  );
};

export default CheckoutButton;
