import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerRef = useRef(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: translate('footer.about', currentLanguage) || 'About Us', path: '/about' },
      { name: translate('footer.contact', currentLanguage) || 'Contact', path: '/contact' },
      { name: translate('footer.careers', currentLanguage) || 'Careers', path: '/careers' },
      { name: translate('footer.blog', currentLanguage) || 'Blog', path: '/blog' },
    ],
    support: [
      { name: translate('footer.faq', currentLanguage) || 'FAQ', path: '/faq' },
      { name: translate('footer.shipping', currentLanguage) || 'Shipping', path: '/shipping' },
      { name: translate('footer.returns', currentLanguage) || 'Returns', path: '/returns' },
      { name: translate('footer.sizeGuide', currentLanguage) || 'Size Guide', path: '/size-guide' },
    ],
    legal: [
      { name: translate('footer.privacy', currentLanguage) || 'Privacy Policy', path: '/privacy' },
      { name: translate('footer.terms', currentLanguage) || 'Terms of Service', path: '/terms' },
      { name: translate('footer.cookies', currentLanguage) || 'Cookie Policy', path: '/cookies' },
      { name: translate('footer.disclaimer', currentLanguage) || 'Disclaimer', path: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: <FaTwitter className="h-5 w-5" />, url: 'https://twitter.com/texelmoda' },
    { name: 'Facebook', icon: <FaFacebook className="h-5 w-5" />, url: 'https://facebook.com/texelmoda' },
    { name: 'Instagram', icon: <FaInstagram className="h-5 w-5" />, url: 'https://instagram.com/texelmoda' },
    { name: 'LinkedIn', icon: <FaLinkedin className="h-5 w-5" />, url: 'https://linkedin.com/company/texelmoda' },
    { name: 'GitHub', icon: <FaGithub className="h-5 w-5" />, url: 'https://github.com/texelmoda' },
  ];

  return (
    <footer 
      ref={footerRef}
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700"
      aria-label="Footer"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand & Description Column - LEFT ALIGNED */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/image.png" alt="TexelModa Logo" className="h-10 w-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5ca7] via-[#a259e6] to-[#3ed6e0] bg-clip-text text-transparent">
                TexelModa
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm text-left">
              {translate('footer.description', currentLanguage) || 'Experience the future of fashion with AI-powered virtual try-on technology. Shop confidently and discover your perfect style.'}
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {translate('footer.company', currentLanguage) || 'Company'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {translate('footer.support', currentLanguage) || 'Support'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {translate('footer.legal', currentLanguage) || 'Legal'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-light dark:hover:text-primary-dark transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  whileTap={{ scale: 0.95, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-primary-light hover:to-primary-dark hover:text-white transition-all duration-300"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
              © {currentYear} <span className="font-semibold bg-gradient-to-r from-[#ff5ca7] via-[#a259e6] to-[#3ed6e0] bg-clip-text text-transparent">TexelModa</span>. {translate('footer.rights', currentLanguage) || 'All rights reserved.'}
            </p>

            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {translate('footer.paymentMethods', currentLanguage) || 'We accept:'}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                  MC
                </div>
                <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;