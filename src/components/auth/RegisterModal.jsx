import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaTimes, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNotification } from '../../context/NotificationContext';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register: registerUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const result = await registerUser({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      gender: data.gender || null,
    });

    if (result.success) {
      notify.success(result.message || 'Account created successfully.');
      setTimeout(() => {
        reset();
        onClose();
      }, 2000);
    } else {
      notify.error(result.message || 'Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        zIndex: 9999,
        overflow: 'auto'
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Centering Wrapper */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '28rem',
          zIndex: 10000
        }}
      >
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700'
              : 'bg-white/95 backdrop-blur-md border border-gray-200'
          }`}
          style={{
            textAlign: 'left'
          }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${
              isDarkMode
                ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {translate('auth.register.title', currentLanguage) || 'Create Account'}
              </h2>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {translate('auth.register.subtitle', currentLanguage) || 'Sign up to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className={`block text-sm font-medium mb-2 ${
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
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
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

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
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
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                    } focus:outline-none focus:ring-2`}
                    placeholder={translate('auth.emailPlaceholder', currentLanguage) || 'your@email.com'}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {translate('auth.password', currentLanguage) || 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock
                      className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                    } focus:outline-none focus:ring-2`}
                    placeholder={translate('auth.passwordPlaceholder', currentLanguage) || '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {translate('auth.confirmPassword', currentLanguage) || 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock
                      className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                    />
                  </div>
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-colors ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                    } focus:outline-none focus:ring-2`}
                    placeholder={translate('auth.confirmPasswordPlaceholder', currentLanguage) || '••••••••'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label
                  htmlFor="phone"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {translate('auth.phone', currentLanguage) || 'Phone'} ({translate('auth.optional', currentLanguage) || 'Optional'})
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                  } focus:outline-none focus:ring-2`}
                  placeholder={translate('auth.phonePlaceholder', currentLanguage) || '+1 234 567 8900'}
                />
              </div>

              {/* Gender (Optional) */}
              <div>
                <label
                  htmlFor="gender"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {translate('auth.gender', currentLanguage) || 'Gender'} ({translate('auth.optional', currentLanguage) || 'Optional'})
                </label>
                <select
                  {...register('gender')}
                  id="gender"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                  } focus:outline-none focus:ring-2`}
                >
                  <option value="">{translate('auth.selectGender', currentLanguage) || 'Select gender'}</option>
                  <option value="male">{translate('auth.male', currentLanguage) || 'Male'}</option>
                  <option value="female">{translate('auth.female', currentLanguage) || 'Female'}</option>
                  <option value="other">{translate('auth.other', currentLanguage) || 'Other'}</option>
                  <option value="prefer-not-to-say">
                    {translate('auth.preferNotToSay', currentLanguage) || 'Prefer not to say'}
                  </option>
                </select>
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start">
                  <input
                    {...register('acceptTerms')}
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {translate('auth.acceptTerms', currentLanguage) || 'I accept the'}{' '}
                    <a href="/terms" className="text-primary hover:text-primary/80">
                      {translate('auth.termsAndConditions', currentLanguage) || 'Terms and Conditions'}
                    </a>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.acceptTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary-light hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {translate('auth.registering', currentLanguage) || 'Creating account...'}
                  </span>
                ) : (
                  translate('auth.register.button', currentLanguage) || 'Sign Up'
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {translate('auth.haveAccount', currentLanguage) || 'Already have an account?'}{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  {translate('auth.signIn', currentLanguage) || 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterModal;

