import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSelector = () => {
  const { language, languages, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 bg-transparent"
      >
        {/* Language name only on desktop */}
        <span className="text-sm font-medium hidden sm:inline dark:text-white">{language.name}</span>
        {/* Language icon only on mobile */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} sm:hidden`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
          style={{ color: 'inherit' }}
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {/* Dropdown arrow only on desktop */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} hidden sm:inline dark:text-white`}
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ color: 'inherit' }}
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
          >
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  language.code === lang.code ? 'bg-gray-100 dark:bg-gray-700 text-primary dark:text-white' : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="dark:text-white">{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector; 