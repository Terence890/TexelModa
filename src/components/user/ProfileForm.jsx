import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { updateProfile, uploadAvatar, uploadAvatarBase64 } from '../../api/users';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCamera, FaCheckCircle } from 'react-icons/fa';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
});

const ProfileForm = ({ onSuccess }) => {
  const { user, updateUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        gender: user.gender || '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, reset]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    // Convert file to base64/data URL and upload via JSON endpoint
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result;
        try {
          const response = await uploadAvatarBase64(dataUrl);
          if (response.data.success) {
            setAvatarPreview(response.data.data.avatar);
            updateUser({ ...user, avatar: response.data.data.avatar });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } else {
            setError(response.data.message || 'Failed to upload avatar');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to upload avatar');
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setIsUploading(false);
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploading(false);
      setError('Failed to process the image file.');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await updateProfile(data);
      console.log('Update profile response:', response);
      
      if (response?.data?.success) {
        const updatedUser = response.data.data?.user;
        if (updatedUser) {
          updateUser(updatedUser);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            if (onSuccess) onSuccess();
          }, 2000);
        } else {
          setError('Invalid response from server');
        }
      } else {
        setError(response?.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center space-x-2"
        >
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">
            {translate('profile.updateSuccess', currentLanguage) || 'Profile updated successfully!'}
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-500/20 border border-red-500/50"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      {/* Avatar Upload */}
      <div>
        <label className={`block text-left text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {translate('profile.avatar', currentLanguage) || 'Profile Picture'}
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <FaUser className={`text-4xl ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg ${
                isDarkMode
                  ? 'bg-gradient-to-br from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                  : 'bg-gradient-to-br from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
              }`}
            >
              <FaCamera className="w-4 h-4" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploading}
            />
          </div>
          <div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {translate('profile.avatarHint', currentLanguage) || 'Click camera icon to upload'}
            </p>
            {isUploading && (
              <p className="text-sm text-primary-light">Uploading...</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.fullName', currentLanguage) || 'Full Name'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUser
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.fullName
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('auth.fullNamePlaceholder', currentLanguage) || 'John Doe'}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label
            htmlFor="email"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.email', currentLanguage) || 'Email'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                isDarkMode
                  ? 'bg-gray-700/50 border-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>
          <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {translate('profile.emailHint', currentLanguage) || 'Email cannot be changed'}
          </p>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.phone', currentLanguage) || 'Phone'} ({translate('auth.optional', currentLanguage) || 'Optional'})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2`}
              placeholder={translate('auth.phonePlaceholder', currentLanguage) || '+1 234 567 8900'}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className={`block text-left text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            {translate('auth.gender', currentLanguage) || 'Gender'} ({translate('auth.optional', currentLanguage) || 'Optional'})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaVenusMars
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
              />
            </div>
            <select
              {...register('gender')}
              id="gender"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.gender
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
              } focus:outline-none focus:ring-2 appearance-none cursor-pointer`}
            >
              <option value="">{translate('auth.selectGender', currentLanguage) || 'Select gender'}</option>
              <option value="male">{translate('auth.male', currentLanguage) || 'Male'}</option>
              <option value="female">{translate('auth.female', currentLanguage) || 'Female'}</option>
              <option value="other">{translate('auth.other', currentLanguage) || 'Other'}</option>
              <option value="prefer-not-to-say">{translate('auth.preferNotToSay', currentLanguage) || 'Prefer not to say'}</option>
            </select>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : isDarkMode
              ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
              : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
          }`}
        >
          {isLoading
            ? translate('profile.updating', currentLanguage) || 'Updating...'
            : translate('profile.update', currentLanguage) || 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;

