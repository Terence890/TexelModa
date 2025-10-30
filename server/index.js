/* eslint-env node */
/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4242;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set in environment. Checkout will fail without it.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' });

app.use(cors());
app.use(express.json());

app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: (item.currency || 'usd').toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round((item.unit_amount || (item.price * 100)) || 0),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: successUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/cancel`,
    });

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('Error creating Stripe Checkout session:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Stripe server listening on http://localhost:${PORT}`);
});
