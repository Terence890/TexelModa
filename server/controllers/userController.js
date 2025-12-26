import User from '../models/User.js';
import Address from '../models/Address.js';
import { deleteFile, getFileUrl } from '../utils/upload.js';
import path from 'path';

/**
 * Get user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, gender, preferences } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          gender: user.gender,
          avatar: user.avatar,
          preferences: user.preferences,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      // Delete uploaded file if user not found
      deleteFile(req.file.filename);
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const oldFilename = path.basename(user.avatar);
      deleteFile(oldFilename);
    }

    // Update user avatar
    user.avatar = getFileUrl(req.file.filename);
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    // Delete uploaded file on error
    if (req.file) {
      deleteFile(req.file.filename);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
};

/**
 * Upload avatar as base64 string
 */
export const uploadAvatarBase64 = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ success: false, message: 'No avatar provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If previous avatar was a stored file URL, delete it
    if (user.avatar && user.avatar.includes('/uploads/')) {
      const oldFilename = path.basename(user.avatar);
      deleteFile(oldFilename);
    }

    // Store base64/data URL directly in DB
    user.avatar = avatar;
    await user.save();

    res.json({ success: true, message: 'Avatar uploaded successfully', data: { avatar: user.avatar } });
  } catch (error) {
    console.error('Upload avatar (base64) error:', error);
    res.status(500).json({ success: false, message: 'Error uploading avatar', error: error.message });
  }
};

/**
 * Get user addresses
 */
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: { addresses },
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message,
    });
  }
};

/**
 * Add address
 */
export const addAddress = async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      userId: req.user.id,
    };

    const address = await Address.create(addressData);

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: { address },
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding address',
      error: error.message,
    });
  }
};

/**
 * Update address
 */
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address },
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message,
    });
  }
};

/**
 * Delete address
 */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const address = await Address.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message,
    });
  }
};

