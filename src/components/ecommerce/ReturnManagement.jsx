import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ReturnManagement = () => {
  const { currentLanguage } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [returnDetails, setReturnDetails] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleReturnRequest = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to process the return request
    // For demo purposes, we'll use mock data
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
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-6">{translate('returns.title', currentLanguage)}</h2>

        <form onSubmit={handleReturnRequest} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {translate('returns.orderNumber', currentLanguage)}
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
              placeholder={translate('returns.orderNumber', currentLanguage)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {translate('returns.reason', currentLanguage)}
            </label>
            <select
              id="returnReason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
              required
            >
              <option value="">{translate('returns.reason', currentLanguage)}</option>
              <option value="damaged">{translate('returns.reasons.damaged', currentLanguage)}</option>
              <option value="wrongSize">{translate('returns.reasons.wrongSize', currentLanguage)}</option>
              <option value="notAsDescribed">{translate('returns.reasons.notAsDescribed', currentLanguage)}</option>
              <option value="quality">{translate('returns.reasons.quality', currentLanguage)}</option>
              <option value="other">{translate('returns.reasons.other', currentLanguage)}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary-light hover:bg-primary-dark text-white rounded-md transition-colors"
          >
            {translate('returns.submit', currentLanguage)}
          </button>
        </form>

        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Return ID</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{returnDetails.returnId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-primary-light">{returnDetails.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Refund</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{returnDetails.estimatedRefund}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Return Label</p>
                  <a
                    href={returnDetails.returnLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light hover:text-primary-dark"
                  >
                    Download Label
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-4">Return Instructions</h3>
              <ul className="space-y-2">
                {returnDetails.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-primary-light mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-text-light dark:text-text-dark">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReturnManagement; 