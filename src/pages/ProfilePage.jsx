import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translate } from '../utils/translate';
import ProfileForm from '../components/user/ProfileForm';
import AddressForm from '../components/user/AddressForm';
import { getAddresses, deleteAddress } from '../api/users';
import { FaUser, FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, FaCheckCircle } from 'react-icons/fa';

const ProfilePage = () => {
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab]);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data.addresses);
      }
    } catch (error) {
      // Error loading addresses
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm(translate('address.confirmDelete', currentLanguage) || 'Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await deleteAddress(id);
      if (response.data.success) {
        setAddresses(addresses.filter(addr => addr._id !== id));
      }
    } catch (error) {
      // Error deleting address
    }
  };

  const handleAddressSuccess = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    loadAddresses();
  };

  const tabs = [
    { id: 'profile', label: translate('profile.title', currentLanguage) || 'Profile', icon: FaUser },
    { id: 'addresses', label: translate('address.title', currentLanguage) || 'Addresses', icon: FaMapMarkerAlt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {translate('profile.title', currentLanguage) || 'My Profile'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {translate('profile.subtitle', currentLanguage) || 'Manage your personal information and addresses'}
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
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className={`rounded-2xl shadow-lg p-6 md:p-8 ${
                    isDarkMode
                      ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                      : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                  }`}>
                    <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('profile.information', currentLanguage) || 'Profile Information'}
                    </h2>
                    <ProfileForm onSuccess={() => {}} />
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6">
                  {/* Addresses Header */}
                  <div className={`rounded-2xl shadow-lg p-6 ${
                    isDarkMode
                      ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                      : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {translate('address.title', currentLanguage) || 'My Addresses'}
                        </h2>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {translate('address.subtitle', currentLanguage) || 'Manage your delivery addresses'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingAddress(null);
                          setShowAddressForm(true);
                        }}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                          isDarkMode
                            ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                            : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                        }`}
                      >
                        <FaPlus className="w-4 h-4" />
                        <span>{translate('address.add', currentLanguage) || 'Add Address'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl shadow-lg p-6 md:p-8 ${
                        isDarkMode
                          ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                          : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                      }`}
                    >
                      <AddressForm
                        address={editingAddress}
                        onSuccess={handleAddressSuccess}
                        onCancel={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Addresses List */}
                  {isLoading ? (
                    <div className={`rounded-2xl shadow-lg p-12 text-center ${
                      isDarkMode
                        ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                        : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                    }`}>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mx-auto mb-4"></div>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {translate('common.loading', currentLanguage) || 'Loading...'}
                      </p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className={`rounded-2xl shadow-lg p-12 text-center ${
                      isDarkMode
                        ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                        : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                    }`}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
                      }`}>
                        <FaMapMarkerAlt className={`text-3xl ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {translate('address.empty', currentLanguage) || 'No addresses saved'}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {translate('address.emptyHint', currentLanguage) || 'Add your first address to get started'}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <motion.div
                          key={address._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`rounded-2xl shadow-lg p-6 relative transition-all duration-200 hover:shadow-xl ${
                            isDarkMode
                              ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50 hover:border-gray-600'
                              : 'bg-white/95 backdrop-blur-md border border-gray-200/50 hover:border-gray-300'
                          } ${address.isDefault ? 'ring-2 ring-primary-light ring-opacity-50' : ''}`}
                        >
                          {address.isDefault && (
                            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-md ${
                              isDarkMode
                                ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                                : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
                            }`}>
                              <FaCheckCircle className="w-3 h-3" />
                              <span>{translate('address.default', currentLanguage) || 'Default'}</span>
                            </div>
                          )}

                          <div className="mb-6 pr-20">
                            <h3 className={`font-semibold text-lg mb-3 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {address.fullName}
                            </h3>
                            <div className={`space-y-1.5 text-sm text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <p className="text-left">{address.addressLine1}</p>
                              {address.addressLine2 && <p className="text-left">{address.addressLine2}</p>}
                              <p className="text-left">{address.city}, {address.state} {address.postalCode}</p>
                              <p className="text-left">{address.country}</p>
                              {address.phone && (
                                <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-left">
                                  {address.phone}
                                </p>
                              )}
                            </div>
                            <div className={`mt-3 inline-block px-3 py-1 rounded-lg text-xs font-medium text-left ${
                              isDarkMode
                                ? 'bg-gray-700/50 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {translate(`address.${address.type}`, currentLanguage) || address.type}
                            </div>
                          </div>

                          <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => {
                                setEditingAddress(address);
                                setShowAddressForm(true);
                              }}
                              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                isDarkMode
                                  ? 'bg-gray-700/50 hover:bg-gray-600 text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <FaEdit className="w-4 h-4" />
                              <span>{translate('address.edit', currentLanguage) || 'Edit'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                                isDarkMode
                                  ? 'bg-red-900/30 hover:bg-red-800/50 text-red-400'
                                  : 'bg-red-50 hover:bg-red-100 text-red-600'
                              }`}
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
