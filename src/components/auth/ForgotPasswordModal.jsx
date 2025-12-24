import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { forgotPassword } from '../../api/auth';
import { FaTimes, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await forgotPassword(data.email);
      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" key="forgot-password-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
            isDarkMode
              ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700'
              : 'bg-white/95 backdrop-blur-md border border-gray-200'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
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
                {translate('auth.forgotPassword.title', currentLanguage) || 'Reset Password'}
              </h2>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {translate('auth.forgotPassword.subtitle', currentLanguage) ||
                  "Enter your email and we'll send you a reset link"}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {translate('auth.forgotPassword.success', currentLanguage) ||
                      'If an account exists with this email, a password reset link has been sent.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      {translate('auth.sending', currentLanguage) || 'Sending...'}
                    </span>
                  ) : (
                    translate('auth.forgotPassword.button', currentLanguage) || 'Send Reset Link'
                  )}
                </button>
              </form>
            )}

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {translate('auth.backToLogin', currentLanguage) || 'Back to login'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;

