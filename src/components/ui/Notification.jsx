import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

const Notification = ({ items, onRemove }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-3">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`max-w-sm w-full rounded-lg shadow-lg p-3 border flex items-start space-x-3`}
          >
            <div className="flex-shrink-0 mt-0.5 text-lg">
              {item.type === 'success' ? (
                <FaCheckCircle className="text-green-600 dark:text-green-300" />
              ) : item.type === 'error' ? (
                <FaTimesCircle className="text-red-600 dark:text-red-300" />
              ) : (
                <FaInfoCircle className="text-blue-600 dark:text-blue-300" />
              )}
            </div>

            <div className="flex-1">
              <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {item.message}
              </div>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className={`ml-2 text-sm font-bold opacity-70 hover:opacity-100 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
