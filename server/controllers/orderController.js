import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { generateUniqueOrderNumber } from '../utils/orderNumber.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      payment,
      shipping,
      subtotal,
      tax,
      shippingCost,
      total,
      notes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!shippingAddress || !total) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and total are required',
      });
    }

    // Generate unique order number
    const orderNumber = await generateUniqueOrderNumber(Order);

    // Create order
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: payment?.method || 'card',
        stripePaymentIntentId: payment?.stripePaymentIntentId,
        stripeCheckoutSessionId: payment?.stripeCheckoutSessionId,
        status: payment?.status || 'pending',
        amount: total,
        currency: payment?.currency || 'usd',
      },
      shipping: {
        method: shipping?.method || 'standard',
        cost: shippingCost || 0,
        trackingNumber: shipping?.trackingNumber,
        carrier: shipping?.carrier,
      },
      status: 'pending',
      subtotal: subtotal || 0,
      tax: tax || 0,
      shippingCost: shippingCost || 0,
      total,
      notes,
    });

    // Clear user's cart after order creation
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [], subtotal: 0 }
    );

    // Send order confirmation email
    try {
      const user = req.user;
      await sendOrderConfirmationEmail(user.email, {
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items,
      });
    } catch (emailError) {
      // Don't fail order creation if email fails
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

/**
 * Get user's orders
 */
export const getOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

/**
 * Get order by order number
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({
      orderNumber,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    console.error('Get order by number error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, carrier, notes } = req.body;

    const order = await Order.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow certain status updates by user
    const allowedStatuses = ['cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel orders',
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData['shipping.trackingNumber'] = trackingNumber;
    if (carrier) updateData['shipping.carrier'] = carrier;
    if (notes) updateData.notes = notes;

    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
      updateData.cancelledReason = req.body.cancelledReason || 'Cancelled by user';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message,
    });
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledReason: reason || 'Cancelled by user',
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: updatedOrder },
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message,
    });
  }
};

