import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { translate } from '../../utils/translate';
import { FaStar, FaGift, FaCheckCircle, FaTimes, FaTrophy, FaCoins } from 'react-icons/fa';

const LoyaltyProgram = () => {
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [userPoints, setUserPoints] = useState(750);
  const [rewards, setRewards] = useState([
    { id: 1, name: '$10 Off', points: 500, description: 'Get $10 off your next purchase', icon: FaGift },
    { id: 2, name: 'Free Shipping', points: 300, description: 'Free shipping on your next order', icon: FaGift },
    { id: 3, name: '$25 Off', points: 1000, description: 'Get $25 off your next purchase', icon: FaGift },
    { id: 4, name: 'VIP Status', points: 2000, description: 'Unlock VIP benefits for 30 days', icon: FaTrophy },
  ]);

  const [selectedReward, setSelectedReward] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const handleRedeem = (reward) => {
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (selectedReward && userPoints >= selectedReward.points) {
      setUserPoints(userPoints - selectedReward.points);
      setShowRedeemModal(false);
      setSelectedReward(null);
    }
  };

  const progressPercentage = (userPoints / 2000) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {translate('loyalty.title', currentLanguage) || 'Loyalty Program'}
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {translate('loyalty.description', currentLanguage) || 'Earn points with every purchase and redeem exciting rewards'}
        </p>
      </div>

      {/* Points Display Card */}
      <div className={`rounded-2xl shadow-lg p-6 md:p-8 ${
        isDarkMode
          ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
          : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {translate('loyalty.points.label', currentLanguage) || 'Available Points'}
            </p>
            <div className="flex items-baseline space-x-2">
              <FaCoins className={`text-2xl ${isDarkMode ? 'text-primary-light' : 'text-primary-dark'}`} />
              <p className={`text-4xl md:text-5xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {userPoints.toLocaleString()}
              </p>
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {translate('loyalty.pointsToNext', currentLanguage) || `${2000 - userPoints} points to next tier`}
            </p>
          </div>
          
          {/* Progress Circle */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={isDarkMode ? '#a259e6' : '#667eea'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <FaTrophy className={`text-2xl mb-1 ${
                isDarkMode ? 'text-primary-light' : 'text-primary-dark'
              }`} />
              <span className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {translate('loyalty.level', currentLanguage) || 'Level 1'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className={`h-3 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                isDarkMode
                  ? 'bg-gradient-to-r from-primary-dark to-primary-light'
                  : 'bg-gradient-to-r from-primary-light to-primary-dark'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {translate('loyalty.rewards.title', currentLanguage) || 'Available Rewards'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const canRedeem = userPoints >= reward.points;
            return (
              <motion.div
                key={reward.id}
                whileHover={{ y: -4 }}
                className={`rounded-2xl shadow-lg p-6 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50 hover:border-gray-600'
                    : 'bg-white/50 backdrop-blur-md border border-gray-200/50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isDarkMode
                      ? 'bg-gray-700 text-primary-light'
                      : 'bg-gray-100 text-primary-dark'
                  }`}>
                    {reward.points} {translate('loyalty.points.label', currentLanguage) || 'points'}
                  </div>
                </div>
                
                <h4 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {reward.name}
                </h4>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {reward.description}
                </p>
                
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canRedeem}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                    canRedeem
                      ? isDarkMode
                        ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                        : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {translate('loyalty.redeem.button', currentLanguage) || 'Redeem'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Redeem Modal */}
      <AnimatePresence>
        {showRedeemModal && selectedReward && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRedeemModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`rounded-2xl shadow-2xl max-w-md w-full ${
                  isDarkMode
                    ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                    : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('loyalty.redeem.title', currentLanguage) || 'Redeem Reward'}
                    </h3>
                    <button
                      onClick={() => setShowRedeemModal(false)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                          : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>

                  <div className={`rounded-xl p-4 mb-6 ${
                    isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      {selectedReward.icon && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDarkMode
                            ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                            : 'bg-gradient-to-br from-primary-light to-primary-dark'
                        }`}>
                          <selectedReward.icon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedReward.name}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedReward.points} {translate('loyalty.points.label', currentLanguage) || 'points'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {translate('loyalty.redeem.confirmation', currentLanguage) || 
                      `Are you sure you want to redeem ${selectedReward.points} points for ${selectedReward.name}?`}
                  </p>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowRedeemModal(false)}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {translate('loyalty.redeem.cancel', currentLanguage) || 'Cancel'}
                    </button>
                    <button
                      onClick={confirmRedeem}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                          : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                      }`}
                    >
                      {translate('loyalty.redeem.confirm', currentLanguage) || 'Confirm'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoyaltyProgram;
