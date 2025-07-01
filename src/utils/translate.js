import translations from '../translations';

export const translate = (key, language = 'en') => {
  // Default to English if translation not available
  if (!translations[language] || !translations[language][key]) {
    return translations.en[key] || key;
  }
  return translations[language][key];
}; 