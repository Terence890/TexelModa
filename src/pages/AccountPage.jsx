import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaUndo, FaStar, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import OrderTracking from '../components/ecommerce/OrderTracking';
import ReturnManagement from '../components/ecommerce/ReturnManagement';
import LoyaltyProgram from '../components/ecommerce/LoyaltyProgram';

const AccountPage = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders', icon: FaBox },
    { id: 'returns', label: 'Returns', icon: FaUndo },
    { id: 'loyalty', label: 'Loyalty', icon: FaStar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your orders, returns, and loyalty rewards
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl shadow-lg p-6 ${
                isDarkMode
                  ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                  : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
              }`}
            >
              {/* User Info Card */}
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 shadow-lg ${
                  isDarkMode ? 'bg-gradient-to-br from-primary-dark to-primary-light' : 'bg-gradient-to-br from-primary-light to-primary-dark'
                }`}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-10 h-10" />
                  )}
                </div>
                <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.fullName || 'User'}
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.email || ''}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white shadow-md'
                            : 'bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-md'
                          : isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions removed */}
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`rounded-2xl shadow-lg p-6 md:p-8 ${
                isDarkMode
                  ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                  : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
              }`}>
                {activeTab === 'orders' && <OrderTracking />}
                {activeTab === 'returns' && <ReturnManagement />}
                {activeTab === 'loyalty' && <LoyaltyProgram />}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
