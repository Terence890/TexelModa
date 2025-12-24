import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    color: String,
    price: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'apple-pay'],
      default: 'card'
    },
    stripePaymentIntentId: String,
    stripeCheckoutSessionId: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'usd'
    }
  },
  shipping: {
    method: {
      type: String,
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0
    },
    trackingNumber: String,
    carrier: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  notes: String,
  cancelledAt: Date,
  cancelledReason: String
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
// orderNumber already has unique index from unique: true
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.stripePaymentIntentId': 1 });
orderSchema.index({ 'payment.stripeCheckoutSessionId': 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;

