import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';

const LoyaltyProgram = () => {
  const { currentLanguage } = useLanguage();
  const [userPoints, setUserPoints] = useState(750); // Example points
  const [rewards, setRewards] = useState([
    { id: 1, name: '$10 Off', points: 500, description: 'Get $10 off your next purchase' },
    { id: 2, name: 'Free Shipping', points: 300, description: 'Free shipping on your next order' },
    { id: 3, name: '$25 Off', points: 1000, description: 'Get $25 off your next purchase' },
    { id: 4, name: 'VIP Status', points: 2000, description: 'Unlock VIP benefits for 30 days' },
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
      // Here you would typically make an API call to process the reward redemption
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-2">{translate('loyalty.title', currentLanguage)}</h2>
          <p className="text-gray-500 dark:text-gray-400">{translate('loyalty.description', currentLanguage)}</p>
        </div>

        {/* Points Display */}
        <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{translate('loyalty.points.label', currentLanguage)}</p>
              <p className="text-3xl font-bold text-primary-light">{userPoints}</p>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary-light"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * userPoints) / 2000}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">{translate('loyalty.level', currentLanguage)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">{translate('loyalty.rewards.title', currentLanguage)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <motion.div
                key={reward.id}
                whileHover={{ scale: 1.02 }}
                className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-text-light dark:text-text-dark">{reward.name}</h4>
                  <span className="text-sm text-primary-light">{reward.points} {translate('loyalty.points.label', currentLanguage)}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{reward.description}</p>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={userPoints < reward.points}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                    userPoints >= reward.points
                      ? 'bg-primary-light hover:bg-primary-dark text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {translate('loyalty.redeem.button', currentLanguage)}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Redeem Modal */}
        {showRedeemModal && selectedReward && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-light dark:bg-surface-dark rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
                {translate('loyalty.redeem.title', currentLanguage)} {selectedReward.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {translate('loyalty.redeem.confirmation', currentLanguage, { points: selectedReward.points, reward: selectedReward.name })}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRedeemModal(false)}
                  className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {translate('loyalty.redeem.cancel', currentLanguage)}
                </button>
                <button
                  onClick={confirmRedeem}
                  className="px-4 py-2 bg-primary-light hover:bg-primary-dark text-white rounded-md"
                >
                  {translate('loyalty.redeem.confirm', currentLanguage)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyProgram; 