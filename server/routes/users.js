import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadAvatarBase64,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar);
router.post('/avatar/base64', uploadAvatarBase64);

// Address routes
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;

