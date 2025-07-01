import React from 'react';
import { useLocation } from 'react-router-dom';
import TryOnForm from '../components/try-on/TryOnForm';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';

const TryOnPage = () => {
  const location = useLocation();
  const selectedClothing = location.state?.selectedClothing || null;
  const { currentLanguage } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">{translate('tryon.title', currentLanguage)}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-100">
            {translate('tryon.subtitle', currentLanguage)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">{translate('tryon.howItWorks', currentLanguage)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2 dark:text-white">{translate('tryon.step1', currentLanguage)}</h3>
              <p className="text-gray-600 text-sm dark:text-gray-100">{translate('tryon.step1.desc', currentLanguage)}</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2 dark:text-white">{translate('tryon.step2', currentLanguage)}</h3>
              <p className="text-gray-600 text-sm dark:text-gray-100">{translate('tryon.step2.desc', currentLanguage)}</p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2 dark:text-white">{translate('tryon.step3', currentLanguage)}</h3>
              <p className="text-gray-600 text-sm dark:text-gray-100">{translate('tryon.step3.desc', currentLanguage)}</p>
            </div>
          </div>
        </div>
        
        <TryOnForm selectedClothing={selectedClothing} />
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-center dark:text-white">{translate('tryon.faq', currentLanguage) || "Frequently Asked Questions"}</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900 p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">{translate('tryon.faq.accuracy.question', currentLanguage) || "How accurate is the virtual try-on?"}</h3>
                <p className="text-gray-600 dark:text-gray-100">{translate('tryon.faq.accuracy.answer', currentLanguage) || "Our AI-powered technology provides a realistic representation of how clothes will look on you, considering your body shape and size. While it's highly accurate, slight variations may occur in the final product."}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">{translate('tryon.faq.photos.question', currentLanguage) || "What type of photos should I upload?"}</h3>
                <p className="text-gray-600 dark:text-gray-100">{translate('tryon.faq.photos.answer', currentLanguage) || "For best results, upload a well-lit, front-facing photo against a plain background. Wear fitted clothing to help our AI accurately determine your body shape."}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">{translate('tryon.faq.security.question', currentLanguage) || "Is my data secure?"}</h3>
                <p className="text-gray-600 dark:text-gray-100">{translate('tryon.faq.security.answer', currentLanguage) || "We take data privacy seriously. Your images are only used for the try-on process and can be deleted at any time. We never share your personal data with third parties."}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">{translate('tryon.faq.items.question', currentLanguage) || "Can I try on any clothing item?"}</h3>
                <p className="text-gray-600 dark:text-gray-100">{translate('tryon.faq.items.answer', currentLanguage) || "Currently, our try-on technology works best with tops, dresses, jackets, and some pants. We're constantly improving our technology to support more clothing types."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TryOnPage; 