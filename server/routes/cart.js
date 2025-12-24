import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  syncCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Cart routes
router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);
router.post('/sync', syncCart);

export default router;

