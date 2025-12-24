import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create order
router.post('/', createOrder);

// Get user's orders
router.get('/', getOrders);

// Get order by ID
router.get('/:id', getOrderById);

// Get order by order number
router.get('/number/:orderNumber', getOrderByNumber);

// Update order status
router.put('/:id/status', updateOrderStatus);

// Cancel order
router.post('/:id/cancel', cancelOrder);

export default router;

