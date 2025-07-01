import React, { createContext, useState, useContext, useEffect } from 'react';

// Available languages
export const languages = {
  en: { code: 'en', name: 'English', flag: '🇬🇧' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  it: { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
};

// Create the context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Try to get stored language or default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const stored = localStorage.getItem('language');
    return stored && languages[stored] ? stored : 'en';
  });
  
  // Add a refresh counter to force re-renders
  const [refreshKey, setRefreshKey] = useState(0);

  // Update language
  const changeLanguage = (code) => {
    if (languages[code]) {
      setCurrentLanguage(code);
      localStorage.setItem('language', code);
      document.documentElement.lang = code;
      // Force a refresh of all components using this context
      setRefreshKey(prev => prev + 1);
    }
  };

  // Set language on first load
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      language: languages[currentLanguage], 
      changeLanguage,
      languages,
      refreshKey  // Include this to trigger re-renders
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using this context
export const useLanguage = () => useContext(LanguageContext); 