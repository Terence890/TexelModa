import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
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

  return (
    <footer 
      ref={footerRef}
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
      aria-label="Footer"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Brand Section */}
          <Link to="/" className="inline-block mb-8">
            <span className="inline-block align-middle">
              <svg width="180" height="40" viewBox="0 0 180 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footer-texel-gradient" x1="0" y1="0" x2="70" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ec6cb9" />
                    <stop offset="1" stopColor="#a084ee" />
                  </linearGradient>
                  <linearGradient id="footer-moda-gradient" x1="70" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a084ee" />
                    <stop offset="1" stopColor="#4fd1e6" />
                  </linearGradient>
                </defs>
                <text x="0" y="28" fontFamily="'Poppins', sans-serif" fontWeight="bold" fontSize="32">
                  <tspan fill="url(#footer-texel-gradient)">Texel </tspan>
                  <tspan fill="url(#footer-moda-gradient)">Moda</tspan>
                </text>
              </svg>
            </span>
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            {translate('footer.description', currentLanguage)}
          </p>
          <div className="flex space-x-6 mb-8">
            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => {
              const socialIcons = {
                twitter: <motion.div whileHover={{ scale: 1.15, rotate: 8 }} whileTap={{ scale: 0.95, rotate: -8 }} transition={{ type: 'spring', stiffness: 300 }}><FaTwitter className="h-6 w-6" /></motion.div>,
                facebook: <motion.div whileHover={{ scale: 1.15, rotate: 8 }} whileTap={{ scale: 0.95, rotate: -8 }} transition={{ type: 'spring', stiffness: 300 }}><FaFacebook className="h-6 w-6" /></motion.div>,
                instagram: <motion.div whileHover={{ scale: 1.15, rotate: 8 }} whileTap={{ scale: 0.95, rotate: -8 }} transition={{ type: 'spring', stiffness: 300 }}><FaInstagram className="h-6 w-6" /></motion.div>,
                linkedin: <motion.div whileHover={{ scale: 1.15, rotate: 8 }} whileTap={{ scale: 0.95, rotate: -8 }} transition={{ type: 'spring', stiffness: 300 }}><FaLinkedin className="h-6 w-6" /></motion.div>,
              };
              return (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary-light dark:text-gray-400 dark:hover:text-primary-dark transition-colors"
                  aria-label={`Follow us on ${social}`}
                >
                  <span className="sr-only">{social}</span>
                  {socialIcons[social]}
                </a>
              );
            })}
          </div>
        </div>
        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {translate('footer.copyright', currentLanguage).replace('{year}', new Date().getFullYear())}
            </p>
            <div className="flex items-center justify-center gap-6">
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 