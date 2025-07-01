import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

const ContactPage = () => {
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-10 min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          {translate('contact.title', currentLanguage) || 'Contact'}
        </h1>
        <p className="text-center text-lg text-gray-700 dark:text-gray-200 mb-10">
          {translate('contact.subtitle', currentLanguage) || "Want to contact us? Choose an option below and we'll be happy to help."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start w-full">
          {/* Left: Contact Info */}
          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {translate('contact.info.title', currentLanguage) || 'Contact Us'}
              </h2>
              <p className="text-gray-700 dark:text-gray-200">
                {translate('contact.info.subtitle', currentLanguage) || 'Have something to say? We are here to help. Fill up the form or send email or call phone.'}
              </p>
            </div>
            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
              <FiMapPin className="text-xl" />
              <span>{translate('contact.info.address', currentLanguage) || '14th avenue glory road'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
              <FiMail className="text-xl" />
              <span>{translate('contact.info.email', currentLanguage) || 'hello@company.com'}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
              <FiPhone className="text-xl" />
              <span>{translate('contact.info.phone', currentLanguage) || '+51 11111111111'}</span>
            </div>
          </div>
          {/* Right: Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 flex flex-col space-y-6 w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder={translate('contact.form.name', currentLanguage) || 'Full Name'}
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={translate('contact.form.email', currentLanguage) || 'Email Address'}
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder={translate('contact.form.message', currentLanguage) || 'Message'}
              rows={5}
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-md font-semibold text-lg bg-primary hover:bg-primary/90 dark:bg-primary-light text-white shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {translate('contact.form.sending', currentLanguage) || 'Sending...'}
                </span>
              ) : (
                translate('contact.form.submit', currentLanguage) || 'Send Message'
              )}
            </button>
            {submitStatus === 'success' && (
              <div className="text-green-600 dark:text-green-400 text-center font-semibold mt-2">
                {translate('contact.form.success', currentLanguage) || 'Message sent successfully!'}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="text-red-600 dark:text-red-400 text-center font-semibold mt-2">
                {translate('contact.form.error', currentLanguage) || 'Something went wrong. Please try again.'}
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage; 