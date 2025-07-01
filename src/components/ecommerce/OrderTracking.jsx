import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';

const OrderTracking = () => {
  const { currentLanguage } = useLanguage();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);

  const trackOrder = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to fetch order details
    // For demo purposes, we'll use mock data
    setOrder({
      id: orderNumber,
      status: 'In Transit',
      estimatedDelivery: '2024-03-20',
      currentLocation: 'Distribution Center',
      trackingNumber: 'TRK123456789',
      steps: [
        { status: 'orderTracking.status.pending', completed: true, date: '2024-03-15' },
        { status: 'orderTracking.status.processing', completed: true, date: '2024-03-16' },
        { status: 'orderTracking.status.shipped', completed: true, date: '2024-03-17' },
        { status: 'orderTracking.status.delivered', completed: false, date: null },
      ],
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-6">{translate('orderTracking.title', currentLanguage)}</h2>
        
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="w-full max-w-xs mx-auto bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-4">{translate('orderTracking.title', currentLanguage)}</h3>
              <form onSubmit={trackOrder} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder={translate('orderTracking.enterOrderNumber', currentLanguage) || 'Enter your order number'}
                  className="flex-1 px-4 py-2 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-light hover:bg-primary-dark text-white rounded-md transition-colors"
                >
                  {translate('orderTracking.track', currentLanguage) || 'Track'}
                </button>
              </form>
            </div>

            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{translate('orderTracking.orderNumber', currentLanguage)}</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{translate('orderTracking.trackingNumber', currentLanguage)}</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{order.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{translate('orderTracking.status', currentLanguage)}</p>
                  <p className="font-medium text-primary-light">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{translate('orderTracking.estimatedDelivery', currentLanguage)}</p>
                  <p className="font-medium text-text-light dark:text-text-dark">{order.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {order.steps.map((step, index) => (
                <div key={step.status} className="flex items-start mb-8 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary-light' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {step.completed ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">{index + 1}</span>
                      )}
                    </div>
                    {index < order.steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${step.completed ? 'bg-primary-light' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-light dark:text-text-dark">{translate(step.status, currentLanguage)}</p>
                    {step.date && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;