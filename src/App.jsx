import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './App.css'
import { translate } from './utils/translate'

// Context
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'

// E-commerce Components

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const TryOnPage = lazy(() => import('./pages/TryOnPage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const CheckoutSuccessPage = lazy(() => import('./pages/CheckoutSuccessPage'))
const CheckoutCancelPage = lazy(() => import('./pages/CheckoutCancelPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
  </div>
)

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can log errorInfo to an error reporting service here
    // console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-light hover:bg-primary-dark text-white rounded-md transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Meta tags manager
const MetaTags = ({ title, description }) => {
  useEffect(() => {
    // Update title
    document.title = `${title} | Texel Moda`

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)

    // Update OpenGraph tags
    const updateMetaTag = (property, content) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`)
      if (!metaTag) {
        metaTag = document.createElement('meta')
        metaTag.setAttribute('property', property)
        document.head.appendChild(metaTag)
      }
      metaTag.setAttribute('content', content)
    }

    updateMetaTag('og:title', `${title} | Texel Moda`)
    updateMetaTag('og:description', description)
    updateMetaTag('twitter:title', `${title} | Texel Moda`)
    updateMetaTag('twitter:description', description)
  }, [title, description])

  return null
}

// Page transition wrapper with meta tags
const PageTransition = ({ children, title, description }) => {
  const location = useLocation()
  
  return (
    <>
      <MetaTags title={title} description={description} />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

// Global error handler
const handleError = (error) => {
  // Here you can add error reporting service integration
  // e.g., Sentry, LogRocket, etc.
}

function App() {
  useEffect(() => {
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  const { currentLanguage } = useLanguage();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={
                      <PageTransition title="Home" description="Welcome to Texel Moda - Your Virtual Fashion Experience">
                        <HomePage />
                      </PageTransition>
                    } />
                    <Route path="/try-on" element={
                      <PageTransition title="Virtual Try-On" description="Try on clothes virtually with our advanced AI technology">
                        <TryOnPage />
                      </PageTransition>
                    } />
                    <Route path="/shop" element={
                      <PageTransition title="Shop" description="Browse our latest collection of fashion items">
                        <ShopPage />
                      </PageTransition>
                    } />
                    <Route path="/contact" element={
                      <PageTransition title="Contact" description="Get in touch with our team">
                        <ContactPage />
                      </PageTransition>
                    } />
                    <Route path="/about" element={
                      <PageTransition title="About" description="Learn more about Texel Moda and our mission">
                        <AboutPage />
                      </PageTransition>
                    } />
                    <Route path="/account" element={
                      <PageTransition title="My Account" description="Manage your account, orders, and preferences">
                        <AccountPage />
                      </PageTransition>
                    } />
                    <Route path="/profile" element={
                      <PageTransition title="Profile" description="Manage your profile and addresses">
                        <ProfilePage />
                      </PageTransition>
                    } />
                    <Route path="/orders" element={
                      <PageTransition title="My Orders" description="View and manage your orders">
                        <OrdersPage />
                      </PageTransition>
                    } />
                    <Route path="/product/:id" element={
                      <PageTransition title="Product Details" description="View product details and specifications">
                        <ProductDetailsPage />
                      </PageTransition>
                    } />
                    <Route path="/checkout" element={
                      <PageTransition title="Checkout" description="Complete your order">
                        <CheckoutPage />
                      </PageTransition>
                    } />
                    <Route path="/checkout/success" element={
                      <PageTransition title="Payment Successful" description="Your order has been placed successfully">
                        <CheckoutSuccessPage />
                      </PageTransition>
                    } />
                    <Route path="/checkout/cancel" element={
                      <PageTransition title="Payment Cancelled" description="Your payment was cancelled">
                        <CheckoutCancelPage />
                      </PageTransition>
                    } />
                    <Route path="*" element={
                      <PageTransition title="Page Not Found" description="The page you're looking for doesn't exist">
                        <div className="min-h-[60vh] flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                              The page you're looking for doesn't exist.
                            </p>
                            <Link 
                              to="/"
                              className="inline-flex items-center px-6 py-3 rounded-md bg-primary-light text-white hover:bg-primary-light/90 transition-colors"
                            >
                              <span>Go Home</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </PageTransition>
                    } />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
