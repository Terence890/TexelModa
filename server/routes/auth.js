import express from 'express';
import {
  register,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { checkDatabase } from '../middleware/dbCheck.js';

const router = express.Router();

// Public routes (with database check)
router.post('/register', checkDatabase, register);
router.post('/login', checkDatabase, login);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;

