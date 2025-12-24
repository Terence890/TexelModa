import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaUndo, FaBox, FaCheckCircle, FaDownload, FaFileAlt, FaTimes } from 'react-icons/fa';

const ReturnManagement = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [orderNumber, setOrderNumber] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReturnRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setReturnDetails({
        returnId: 'RET' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'Processing',
        estimatedRefund: '$99.99',
        returnLabel: 'https://example.com/return-label',
        instructions: [
          'Package the item in its original packaging',
          'Include all original accessories and documentation',
          'Attach the return label to the package',
          'Drop off at your nearest shipping location',
        ],
      });
      setSubmitted(true);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {translate('returns.title', currentLanguage) || 'Return Management'}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {translate('returns.subtitle', currentLanguage) || 'Request a return for your order'}
        </p>
      </div>

      {/* Return Form */}
      {!submitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg p-6 md:p-8 ${
            isDarkMode
              ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
              : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
          }`}
        >
          <form onSubmit={handleReturnRequest} className="space-y-6">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {translate('returns.orderNumber', currentLanguage) || 'Order Number'}
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary-dark focus:ring-primary-dark'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-light focus:ring-primary-light'
                } focus:outline-none focus:ring-2`}
                placeholder={translate('returns.orderNumberPlaceholder', currentLanguage) || 'Enter order number'}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {translate('returns.reason', currentLanguage) || 'Return Reason'}
              </label>
              <select
                id="returnReason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 appearance-none cursor-pointer ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-primary-dark focus:ring-primary-dark'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-primary-light focus:ring-primary-light'
                } focus:outline-none focus:ring-2`}
                required
              >
                <option value="">{translate('returns.selectReason', currentLanguage) || 'Select a reason'}</option>
                <option value="damaged">{translate('returns.reasons.damaged', currentLanguage) || 'Item Damaged'}</option>
                <option value="wrongSize">{translate('returns.reasons.wrongSize', currentLanguage) || 'Wrong Size'}</option>
                <option value="notAsDescribed">{translate('returns.reasons.notAsDescribed', currentLanguage) || 'Not as Described'}</option>
                <option value="quality">{translate('returns.reasons.quality', currentLanguage) || 'Quality Issues'}</option>
                <option value="other">{translate('returns.reasons.other', currentLanguage) || 'Other'}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                isLoading
                  ? 'opacity-60 cursor-not-allowed bg-gray-400'
                  : isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
              }`}
            >
              <FaUndo className="w-4 h-4" />
              <span>
                {isLoading
                  ? translate('returns.submitting', currentLanguage) || 'Submitting...'
                  : translate('returns.submit', currentLanguage) || 'Submit Return Request'}
              </span>
            </button>
          </form>
        </motion.div>
      )}

      {/* Return Details */}
      <AnimatePresence>
        {submitted && returnDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDarkMode
                ? 'bg-green-900/20 border border-green-500/50'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center space-x-3">
                <FaCheckCircle className={`text-2xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {translate('returns.success', currentLanguage) || 'Return Request Submitted'}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    {translate('returns.successMessage', currentLanguage) || 'Your return request has been submitted successfully'}
                  </p>
                </div>
              </div>
            </div>

            {/* Return Info Card */}
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDarkMode
                ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Return ID
                  </p>
                  <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {returnDetails.returnId}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Status
                  </p>
                  <p className={`text-base font-semibold ${
                    isDarkMode ? 'text-primary-light' : 'text-primary-dark'
                  }`}>
                    {returnDetails.status}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Estimated Refund
                  </p>
                  <p className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {returnDetails.estimatedRefund}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Return Label
                  </p>
                  <a
                    href={returnDetails.returnLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
                      isDarkMode
                        ? 'text-primary-light hover:text-primary-dark'
                        : 'text-primary-dark hover:text-primary-light'
                    }`}
                  >
                    <FaDownload className="w-4 h-4" />
                    <span>{translate('returns.downloadLabel', currentLanguage) || 'Download Label'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDarkMode
                ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <FaFileAlt className={`text-xl ${isDarkMode ? 'text-primary-light' : 'text-primary-dark'}`} />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {translate('returns.instructions', currentLanguage) || 'Return Instructions'}
                </h3>
              </div>
              <ul className="space-y-3">
                {returnDetails.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                        : 'bg-gradient-to-br from-primary-light to-primary-dark'
                    }`}>
                      <span className="text-white text-xs font-semibold">{index + 1}</span>
                    </div>
                    <p className={`text-sm flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {instruction}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSubmitted(false);
                setReturnDetails(null);
                setOrderNumber('');
                setReturnReason('');
              }}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {translate('returns.newReturn', currentLanguage) || 'Submit Another Return'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReturnManagement;
