import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { currentLanguage } = useLanguage();
  const [error, setError] = useState(null);
  
  // Refs for GSAP animations
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const heroCaptionRef = useRef(null);
  const featuresRef = useRef([]);
  const canvasRef = useRef(null);

  // Custom particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      particles = [];
      const numberOfParticles = 50;
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
        });
      }
    };

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    try {
      createParticles();
      animate();
    } catch (error) {
      console.error('Error in particle animation:', error);
      setError('Failed to load animations. Please refresh the page.');
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    try {
      // Hero text entrance
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
      );
      // Hero image entrance
      gsap.fromTo(
        heroImgRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
      );
      // Hero caption entrance
      gsap.fromTo(
        heroCaptionRef.current,
        { opacity: 0, x: 20, y: 20 },
        { opacity: 1, x: 0, y: 0, duration: 0.7, delay: 1, ease: 'power3.out' }
      );
      // Features entrance
      featuresRef.current.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, delay: 1.2 + i * 0.15, ease: 'power3.out' }
        );
      });
    } catch (error) {
      console.error('Error in animations:', error);
      setError('Failed to load animations. Please refresh the page.');
    }
  }, []);

  // If there's an error, show error message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-light hover:bg-primary-dark text-white rounded-md transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Sample featured products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Classic White T-Shirt',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'T-Shirts',
      isFeatured: true,
    },
    {
      id: 2,
      name: 'Denim Jacket',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1544642899-f0d6e5f6ed6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Jackets',
      isFeatured: true,
    },
    {
      id: 3,
      name: 'Slim Fit Jeans',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Jeans',
      isFeatured: true,
    },
    {
      id: 4,
      name: 'Floral Summer Dress',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      category: 'Dresses',
      isFeatured: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Particle animation canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Rest of your existing JSX */}
      <div className="relative z-10">
        {/* Hero Section with Enhanced Animations */}
        <section aria-labelledby="hero-heading" className="relative bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-900 dark:to-indigo-950 dark:bg-gradient-to-r text-white py-24 overflow-hidden transition-colors duration-300">
          {/* Multiple Animated Blobs */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
            animate={{
              opacity: 0.4,
              scale: [1, 1.1, 1],
              x: [0, 40, -30, 0],
              y: [0, 30, -20, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut'
            }}
            className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-white/30 blur-3xl z-0 mix-blend-lighten"
          />
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
            animate={{
              opacity: 0.3,
              scale: [1, 1.15, 1],
              x: [0, -40, 30, 0],
              y: [0, -30, 20, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 1
            }}
            className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-purple-500/30 blur-3xl z-0 mix-blend-lighten"
          />
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
            animate={{
              opacity: 0.2,
              scale: [1, 1.2, 1],
              x: [0, 20, -20, 0],
              y: [0, -20, 20, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              delay: 2
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-3xl z-0 mix-blend-lighten"
          />

          {/* Animated Grid Lines */}
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[420px]">
              <div className="py-8">
                <motion.h1
                  id="hero-heading"
                  className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg dark:text-white"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  {translate('home.hero.title', currentLanguage)}
                </motion.h1>
                <motion.p
                  className="text-2xl md:text-3xl mb-10 text-blue-100 font-medium drop-shadow dark:text-blue-200"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                >
                  {translate('home.hero.subtitle', currentLanguage)}
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.3, delay: 0.4, ease: 'easeOut' }}
                >
                  <Link
                    to="/try-on"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-light hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {translate('home.hero.cta', currentLanguage)}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Enhanced SVG Wave */}
          <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <motion.path
                className="block dark:hidden"
                fill="#f9fafb"
                fillOpacity="1"
                d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,117.3C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                className="hidden dark:block"
                fill="#181e29"
                fillOpacity="1"
                d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,117.3C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </section>
        
        {/* Features Section */}
        <section aria-labelledby="features-heading" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl font-bold mb-4 dark:text-white">
                {translate('home.whyChoose', currentLanguage)}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto dark:text-gray-100">
                {translate('home.whyChooseDesc', currentLanguage)}
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  ),
                  title: translate('home.feature1.title', currentLanguage),
                  desc: translate('home.feature1.desc', currentLanguage)
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary dark:text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ),
                  title: translate('home.feature2.title', currentLanguage),
                  desc: translate('home.feature2.desc', currentLanguage)
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent dark:text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  ),
                  title: translate('home.feature3.title', currentLanguage),
                  desc: translate('home.feature3.desc', currentLanguage)
                }
              ].map((feature, i) => (
                <article
                  key={feature.title}
                  ref={el => featuresRef.current[i] = el}
                  className="bg-white dark:bg-surface-dark rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
                  onMouseEnter={e => gsap.to(e.currentTarget, { y: -10, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', duration: 0.3 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, boxShadow: '', duration: 0.3 })}
                >
                  <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      whileTap={{ scale: 0.95, rotate: -8 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 dark:text-gray-100">{feature.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Products */}
        <section aria-labelledby="products-heading" className="py-16 dark:bg-background-dark">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <header className="flex justify-between items-center mb-12">
              <h2 id="products-heading" className="text-3xl font-bold dark:text-white">
                {translate('home.featuredProducts', currentLanguage)}
              </h2>
              <Link to="/shop" className="text-primary dark:text-primary-light hover:text-primary/80 dark:hover:text-primary-light/80 font-medium flex items-center group" aria-label={translate('home.viewAllProducts', currentLanguage)}>
                <span>{translate('home.viewAll', currentLanguage)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </header>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} animateOnMount />
              ))}
            </div>
          </div>
        </section>
        
        {/* Try-On CTA */}
        <section aria-labelledby="try-on-heading" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                  <h2 id="try-on-heading" className="text-3xl font-bold text-white dark:text-white mb-4">{translate('home.tryBefore', currentLanguage) || "Try Before You Buy"}</h2>
                  <p className="text-indigo-100 dark:text-white mb-6">
                    {translate('home.tryDescription', currentLanguage) || "Experience our virtual fitting room today. Upload your photo and see how our clothes look on you instantly."}
                  </p>
                  <Link 
                    to="/try-on" 
                    className="inline-flex items-center bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-md font-semibold transition-colors group"
                    role="button"
                  >
                    <span className="dark:text-gray-900">{translate('home.tryOnNow', currentLanguage) || "Try On Now"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform dark:text-gray-900" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="flex justify-center items-center p-8 md:p-12">
                  <img 
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Virtual Try-On Preview"
                    className="max-w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section aria-labelledby="testimonials-heading" className="py-16 dark:bg-background-dark">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12">
              <h2 id="testimonials-heading" className="text-3xl font-bold mb-4 dark:text-white">
                {translate('home.testimonials', currentLanguage)}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto dark:text-gray-100">
                {translate('home.testimonialsDesc', currentLanguage)}
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonials content would go here */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage; 