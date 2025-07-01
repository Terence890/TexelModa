import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon, FaGlobe } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // GSAP entrance animation
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    // GSAP nav items stagger animation
    gsap.fromTo(
      navRef.current.children,
      { opacity: 0, y: -20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3
      }
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      // GSAP shadow/blur effect on scroll
      if (window.scrollY > 20) {
        gsap.to(headerRef.current, {
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(8px)',
          background: isDarkMode
            ? 'rgba(17, 24, 39, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          duration: 0.4,
        });
      } else {
        gsap.to(headerRef.current, {
          boxShadow: '0 0px 0px 0 rgba(0,0,0,0)',
          backdropFilter: 'blur(0px)',
          background: 'transparent',
          duration: 0.4,
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkMode]);

  const navItems = [
    { path: '/', label: translate('nav.home', currentLanguage) },
    { path: '/try-on', label: translate('nav.tryon', currentLanguage) },
    { path: '/shop', label: translate('nav.shop', currentLanguage) },
    { path: '/ecommerce', label: translate('nav.ecommerce', currentLanguage) },
    { path: '/about', label: translate('nav.about', currentLanguage) },
    { path: '/contact', label: translate('nav.contact', currentLanguage) },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-lg' // fallback for users without JS
          : ''
      }`}
      style={{ willChange: 'transform, box-shadow, backdrop-filter, background' }}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/image.png" alt="Texelmode Logo" style={{ height: 40 }} />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5ca7] via-[#a259e6] to-[#3ed6e0] bg-clip-text text-transparent drop-shadow">
                Texel Moda
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
                <Link 
                key={item.path}
                to={item.path}
                className={`relative group ${
                  location.pathname === item.path
                    ? 'text-primary-light dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className="relative py-2">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-light dark:bg-primary-dark transition-all duration-300 group-hover:w-full" />
                </span>
                </Link>
            ))}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              aria-label={translate('theme.switchToLight', currentLanguage)}
            >
              {isDarkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
            </button>

            {/* Desktop Language Selector */}
            <LanguageSelector />

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block w-full h-0.5 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''} ${isDarkMode ? 'bg-white' : 'bg-current'}`} />
                <span className={`block w-full h-0.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''} ${isDarkMode ? 'bg-white' : 'bg-current'}`} />
                <span className={`block w-full h-0.5 transform transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''} ${isDarkMode ? 'bg-white' : 'bg-current'}`} />
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div
          style={{ 
            maxHeight: isMobileMenuOpen ? '300px' : '0',
            opacity: isMobileMenuOpen ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            background: isMobileMenuOpen
              ? (isDarkMode ? '#181e29' : '#fff')
              : 'transparent',
          }}
          className="md:hidden overflow-hidden"
        >
          <nav className="py-4 space-y-2">
            {navItems.map((item) => (
                <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-light/10 text-primary-light dark:text-primary-dark'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
                </Link>
            ))}
            <div className="flex items-center space-x-4 mt-4 px-4">
              {/* Theme Toggle Mobile */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                aria-label={translate('theme.switchToLight', currentLanguage)}
              >
                {isDarkMode ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
              </button>
              {/* Mobile Language Selector */}
              <div className="dark:text-white">
                <LanguageSelector />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 