import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center justify-center rounded-full p-2 transition-colors focus:outline-none
        dark:bg-gray-700 dark:hover:bg-gray-600
        bg-gray-100 hover:bg-gray-200"
      onClick={toggleTheme}
      aria-label={isDarkMode 
        ? translate('theme.switchToLight', currentLanguage) || 'Switch to light mode' 
        : translate('theme.switchToDark', currentLanguage) || 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <motion.div
          initial={{ rotate: -30 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Sun icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-yellow-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        </motion.div>
      ) : (
        <motion.div
          initial={{ rotate: 30 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Moon icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
};

export default ThemeSwitcher; 