import { useState } from 'react';
import { motion } from 'framer-motion';
import ShoppingCart from '../components/ecommerce/ShoppingCart';
import Wishlist from '../components/ecommerce/Wishlist';
import OrderTracking from '../components/ecommerce/OrderTracking';
import ReturnManagement from '../components/ecommerce/ReturnManagement';
import LoyaltyProgram from '../components/ecommerce/LoyaltyProgram';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'returns', label: 'Returns', icon: '🔄' },
    { id: 'loyalty', label: 'Loyalty', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-light dark:text-text-dark">John Doe</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-light text-white'
                        : 'text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart />
                  <Wishlist />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'orders' && <OrderTracking />}
              {activeTab === 'returns' && <ReturnManagement />}
              {activeTab === 'loyalty' && <LoyaltyProgram />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 