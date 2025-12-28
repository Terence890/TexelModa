/* eslint-env node */
/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
// Trust the first proxy (Railway/load balancer) so req.ip and express-rate-limit work correctly
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4242;

// Connect to MongoDB (don't block server startup if DB fails in dev)
connectDB().catch((err) => {
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set in environment. Checkout will fail without it.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' });

// Security middleware
app.use(helmet());

// CORS: allow configured client origin, fallback to Netlify origin if not set.
const ALLOWED_ORIGIN = process.env.CLIENT_URL ;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, mobile apps)
    if (!origin) return callback(null, true);

    // Allow exact match with configured origin or fallback origin
    if (origin === ALLOWED_ORIGIN) return callback(null, true);

    // During development allow localhost origins
    if (process.env.NODE_ENV !== 'production' && /localhost/.test(origin)) return callback(null, true);

    // Otherwise block
    return callback(new Error('CORS policy: This origin is not allowed'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

// Ensure preflight requests are handled for the allowed origin
app.options('*', cors({ origin: ALLOWED_ORIGIN, credentials: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Stripe webhook handler - MUST be before body parser
// Stripe needs raw body for signature verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Order will be created when user returns from Stripe checkout
        // You can update order status here if needed
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        // Update order payment status to 'paid'
        const Order = (await import('./models/Order.js')).default;
        await Order.updateOne(
          { 'payment.stripePaymentIntentId': paymentIntent.id },
          { 
            $set: { 
              'payment.status': 'paid',
              status: 'processing'
            } 
          }
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // Update order payment status to 'failed'
        const Order = (await import('./models/Order.js')).default;
        await Order.updateOne(
          { 'payment.stripePaymentIntentId': paymentIntent.id },
          { 
            $set: { 
              'payment.status': 'failed',
              status: 'cancelled'
            } 
          }
        );
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        // Update order payment status to 'refunded'
        const Order = (await import('./models/Order.js')).default;
        await Order.updateOne(
          { 'payment.stripePaymentIntentId': charge.payment_intent },
          { 
            $set: { 
              'payment.status': 'refunded',
              status: 'cancelled'
            } 
          }
        );
        break;
      }
      default:
        // Unhandled event type
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    next();
  });
}

// Serve static files (avatars and product images)
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('public/images'));

// Health check endpoint (before other routes)
app.get('/api', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[dbStatus] || 'unknown';

  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusText,
      connected: dbStatus === 1,
    },
    version: '1.0.0',
  });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const isHealthy = dbStatus === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'Service is healthy' : 'Service is unhealthy',
    timestamp: new Date().toISOString(),
    database: {
      status: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      }[dbStatus] || 'unknown',
      connected: dbStatus === 1,
    },
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Routes registered

// Stripe checkout (existing)
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
    return res.status(500).json({ error: err.message });
  }
});

// Stripe payment intent (for on-page card payment)
app.post('/api/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', shippingInfo } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      metadata: {
        shipping_name: shippingInfo?.fullName || '',
        shipping_email: shippingInfo?.email || '',
        shipping_phone: shippingInfo?.phone || '',
        shipping_address: shippingInfo?.address || '',
        shipping_city: shippingInfo?.city || '',
        shipping_state: shippingInfo?.state || '',
        shipping_postal_code: shippingInfo?.postalCode || '',
        shipping_country: shippingInfo?.country || '',
      },
    });

    return res.json({ 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Error handling middleware - must be before 404 handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    }),
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

app.listen(PORT, () => {
  const apiUrl = `http://localhost:${PORT}`;
  console.log(`Backend API running at: ${apiUrl}`);
  console.log(`API endpoints available at: ${apiUrl}/api`);
});
