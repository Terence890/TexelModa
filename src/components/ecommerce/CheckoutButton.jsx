import React, { useState } from 'react';

const CheckoutButton = ({ items = [] }) => {
  const [loading, setLoading] = useState(false);

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
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to hosted Stripe Checkout
        return;
      }

      alert('Unable to create checkout session');
    } catch (err) {
      console.error('Checkout error', err);
      alert('Checkout failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className={`w-full ${loading || items.length === 0 ? 'opacity-60 cursor-not-allowed' : ''} bg-primary-light hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors`}
    >
      {loading ? 'Redirecting…' : 'Checkout'}
    </button>
  );
};

export default CheckoutButton;
