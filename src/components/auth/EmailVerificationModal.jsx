import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { verifyEmail } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const EmailVerificationModal = ({ isOpen, onClose, token }) => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      verifyEmailToken();
    }
  }, [isOpen, token]);

  const verifyEmailToken = async () => {
    try {
      const response = await verifyEmail(token);
      if (response.data.success) {
        setStatus('success');
        setMessage(
          translate('auth.verifyEmail.success', currentLanguage) ||
            'Email verified successfully!'
        );
        // Refresh user data
        await refreshUser();
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setStatus('error');
        setMessage(
          response.data.message ||
            translate('auth.verifyEmail.error', currentLanguage) ||
            'Failed to verify email'
        );
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message ||
          translate('auth.verifyEmail.error', currentLanguage) ||
          'Failed to verify email. Please try again.'
      );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto" key="email-verification-modal">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md mx-auto my-auto rounded-2xl shadow-2xl z-[9999] ${
              isDarkMode
                ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700'
                : 'bg-white/95 backdrop-blur-md border border-gray-200'
            }`}
          >
          {/* Close Button */}
          <button
            onClick={onClose}
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
          <div className="p-4 sm:p-6 md:p-8 text-center">
            {status === 'verifying' && (
              <>
                <div className="mb-4 flex justify-center">
                  <FaSpinner className="w-16 h-16 text-primary animate-spin" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {translate('auth.verifyEmail.verifying', currentLanguage) || 'Verifying Email...'}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {translate('auth.verifyEmail.pleaseWait', currentLanguage) ||
                    'Please wait while we verify your email address'}
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mb-4 flex justify-center">
                  <FaCheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {translate('auth.verifyEmail.successTitle', currentLanguage) || 'Email Verified!'}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {message}
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mb-4 flex justify-center">
                  <FaExclamationCircle className="w-16 h-16 text-red-500" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {translate('auth.verifyEmail.errorTitle', currentLanguage) || 'Verification Failed'}
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {message}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-primary-light hover:bg-primary-dark text-white rounded-lg transition-colors"
                >
                  {translate('auth.close', currentLanguage) || 'Close'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};

export default EmailVerificationModal;

