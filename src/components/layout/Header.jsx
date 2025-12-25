import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useLanguage } from '../../context/LanguageContext';
import { translate } from '../../utils/translate';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FaSun, FaMoon, FaUser, FaSignInAlt, FaSignOutAlt, FaUserCircle, FaShoppingBag, FaUserPlus } from 'react-icons/fa';
import LanguageSelector from './LanguageSelector';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';
import ShoppingCart from '../ecommerce/ShoppingCart';
import Wishlist from '../ecommerce/Wishlist';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const userMenuRef = useRef(null);

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
    { path: '/about', label: translate('nav.about', currentLanguage) },
    { path: '/contact', label: translate('nav.contact', currentLanguage) },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'shadow-lg'
          : ''
      }`}
      style={{ willChange: 'transform, box-shadow, backdrop-filter, background' }}
    >
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo - Hide text on mobile, show only image */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img src="/image.png" alt="TexelModa Logo" className="h-7 sm:h-8 lg:h-10" />
            {/* Hide text on mobile (below sm), show on sm and up */}
            <span className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-[#ff5ca7] via-[#a259e6] to-[#3ed6e0] bg-clip-text text-transparent drop-shadow whitespace-nowrap">
              TexelModa
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
          
          {/* Right Section - Icons in specific order */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <>
                {/* Desktop User Menu */}
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode
                          ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                          : 'bg-gradient-to-br from-primary-light to-primary-dark'
                      }`}>
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium">
                      {user?.fullName || 'User'}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowUserMenu(false)}
                          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        
                        {/* Dropdown Panel */}
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl z-50 ${
                            isDarkMode
                              ? 'bg-gray-800/95 backdrop-blur-md border border-gray-700/50'
                              : 'bg-white/95 backdrop-blur-md border border-gray-200/50'
                          }`}
                        >
                          {/* User Info Header */}
                          <div className={`p-4 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            <div className="flex items-center space-x-3">
                              {user?.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.fullName}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                />
                              ) : (
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  isDarkMode
                                    ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                                    : 'bg-gradient-to-br from-primary-light to-primary-dark'
                                }`}>
                                  <FaUser className="w-6 h-6 text-white" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold truncate ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {user?.fullName || 'User'}
                                </p>
                                <p className={`text-xs truncate ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {user?.email || ''}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              to="/profile"
                              onClick={() => setShowUserMenu(false)}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                location.pathname === '/profile'
                                  ? isDarkMode
                                    ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                                    : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
                                  : isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <FaUser className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {translate('nav.profile', currentLanguage) || 'Profile'}
                              </span>
                            </Link>
                            
                            <Link
                              to="/account"
                              onClick={() => setShowUserMenu(false)}
                              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                location.pathname === '/account'
                                  ? isDarkMode
                                    ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                                    : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
                                  : isDarkMode
                                  ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                              }`}
                            >
                              <FaShoppingBag className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {translate('nav.orders', currentLanguage) || 'Orders'}
                              </span>
                            </Link>
                          </div>

                          {/* Divider */}
                          <div className={`border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                          }`} />

                          {/* Logout Button */}
                          <div className="p-2">
                            <button
                              onClick={handleLogout}
                              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isDarkMode
                                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                              }`}
                            >
                              <FaSignOutAlt className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {translate('auth.logout', currentLanguage) || 'Logout'}
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Profile Icon - Circular */}
                <Link
                  to="/profile"
                  className="lg:hidden flex-shrink-0"
                  aria-label="Profile"
                  title="Profile"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark transition-all duration-200"
                    />
                  ) : (
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gradient-to-br from-primary-dark to-primary-light border-gray-600 hover:border-primary-dark'
                        : 'bg-gradient-to-br from-primary-light to-primary-dark border-gray-300 hover:border-primary-light'
                    }`}>
                      <FaUser className="w-4 h-4 text-white" />
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                {/* 1. Login Icon - FIRST */}
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Login"
                  title="Login"
                >
                  <FaSignInAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* 2. Register Icon - SECOND */}
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Sign Up"
                  title="Sign Up"
                >
                  <FaUserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            {/* 3. Wishlist - THIRD */}
            <div className="flex-shrink-0">
              <Wishlist />
            </div>
            
            {/* 4. Shopping Cart - FOURTH */}
            <div className="flex-shrink-0">
              <ShoppingCart />
            </div>

            {/* 5. Language Selector - FIFTH */}
            <div className="flex-shrink-0">
              <LanguageSelector />
            </div>

            {/* 6. Theme Toggle - SIXTH */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label={translate('theme.switchToLight', currentLanguage)}
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <FaMoon className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaSun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* 7. Mobile Menu Button - LAST (Burger Icon) */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              title="Menu"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-around">
                <span className={`block w-full h-0.5 transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''} ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`} />
                <span className={`block w-full h-0.5 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''} ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`} />
                <span className={`block w-full h-0.5 transform transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''} ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`} />
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - ONLY NAVIGATION LINKS */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden overflow-hidden border-t ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <nav className="py-3 space-y-1">
                {/* Navigation Links Only */}
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg mx-2 transition-colors text-sm sm:text-base ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-primary-light to-primary-dark text-white font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* User Menu in Mobile (if authenticated) */}
                {isAuthenticated && (
                  <>
                    <div className={`border-t my-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <FaUser className="w-4 h-4" />
                      <span className="font-medium">{translate('nav.profile', currentLanguage) || 'Profile'}</span>
                    </Link>
                    
                    <Link
                      to="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <FaShoppingBag className="w-4 h-4" />
                      <span className="font-medium">{translate('nav.orders', currentLanguage) || 'Orders'}</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                        isDarkMode
                          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                          : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      <span className="font-medium">{translate('auth.logout', currentLanguage) || 'Logout'}</span>
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
        onSwitchToForgotPassword={() => {
          setShowLoginModal(false);
          setShowForgotPasswordModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSwitchToLogin={() => {
          setShowForgotPasswordModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
  );
};

export default Header;