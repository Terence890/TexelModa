import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import productsData, { filterProducts } from '../data/products';
import { listZapposProducts } from '../api/zapposAPI';
import ProductCard from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';

const ShopPage = () => {
  const { currentLanguage } = useLanguage();
  
  // State for filter options
  const [filters, setFilters] = useState({
    gender: '',
    category: '',
    colors: [],
    sizes: [],
    minPrice: '',
    maxPrice: '',
    search: '',
    featured: false,
    newArrivals: false,
  });

  // Available filter options
  const categories = [
    'dresses', 'tops', 'sweaters', 'blazers', 'suits', 
    'jackets', 'casual', 'business-casual', 'shirts', 'outerwear'
  ];
  
  const colors = [
    'white', 'black', 'blue', 'grey', 'red', 'green', 
    'yellow', 'purple', 'pink', 'navy', 'beige', 'denim', 'floral'
  ];
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // State for filtered products
  const [products, setProducts] = useState([]);
  const [zapposProducts, setZapposProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for sort option
  const [sortBy, setSortBy] = useState('featured');
  
  // State for mobile filters visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products when filters change
  useEffect(() => {
    let filteredProducts = filterProducts(filters);
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts = filteredProducts.filter(p => p.isNew).concat(
          filteredProducts.filter(p => !p.isNew)
        );
        break;
      case 'featured':
      default:
        filteredProducts = filteredProducts.filter(p => p.isFeatured).concat(
          filteredProducts.filter(p => !p.isFeatured)
        );
        break;
    }
    
    setProducts(filteredProducts);
  }, [filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    if (type === 'color') {
      setFilters(prev => {
        const colors = prev.colors.includes(value)
          ? prev.colors.filter(color => color !== value)
          : [...prev.colors, value];
        return { ...prev, colors };
      });
    } else if (type === 'size') {
      setFilters(prev => {
        const sizes = prev.sizes.includes(value)
          ? prev.sizes.filter(size => size !== value)
          : [...prev.sizes, value];
        return { ...prev, sizes };
      });
    } else if (type === 'checkbox') {
      setFilters(prev => ({ ...prev, [value]: !prev[value] }));
    } else {
      setFilters(prev => ({ ...prev, [type]: value }));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      gender: '',
      category: '',
      colors: [],
      sizes: [],
      minPrice: '',
      maxPrice: '',
      search: '',
      featured: false,
      newArrivals: false,
    });
    setSortBy('featured');
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'colors' || key === 'sizes') {
      return count + value.length;
    }
    if (key === 'featured' || key === 'newArrivals') {
      return count + (value ? 1 : 0);
    }
    return count + (value ? 1 : 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Page Header - Enhanced with animation and spacing */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3 dark:text-white">
          {translate('shop.title', currentLanguage)}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto dark:text-gray-100">
          {translate('shop.subtitle', currentLanguage) || "Discover our latest arrivals and bestsellers"}
        </p>
      </motion.div>

      {/* Search & Sort Bar (Desktop) - Improved alignment and visual hierarchy */}
      <div className="hidden md:flex justify-between items-center mb-8 bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm">
        <div className="relative w-80">
          <input
            type="text"
            placeholder={translate('shop.searchPlaceholder', currentLanguage) || "Search products..."}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center">
          <label htmlFor="sortBy" className="mr-3 text-gray-700 font-medium">
            {translate('shop.filter.sort', currentLanguage)}:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <option value="featured">{translate('shop.sort.featured', currentLanguage) || "Featured"}</option>
            <option value="newest">{translate('shop.sort.newest', currentLanguage) || "Newest"}</option>
            <option value="price-low-high">{translate('shop.sort.lowToHigh', currentLanguage) || "Price: Low to High"}</option>
            <option value="price-high-low">{translate('shop.sort.highToLow', currentLanguage) || "Price: High to Low"}</option>
            <option value="rating">{translate('shop.sort.rating', currentLanguage) || "Highest Rated"}</option>
          </select>
        </div>
      </div>

      {/* Mobile Search and Filter */}
      <div className="md:hidden mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder={translate('shop.searchPlaceholder', currentLanguage) || "Search products..."}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="bg-white text-gray-800 py-3 px-5 rounded-md flex items-center font-medium shadow-sm border border-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            {translate('shop.filters', currentLanguage) || "Filters"}
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary bg-white shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
          >
            <option value="featured">{translate('shop.sort.featured', currentLanguage) || "Featured"}</option>
            <option value="newest">{translate('shop.sort.newest', currentLanguage) || "Newest"}</option>
            <option value="price-low-high">{translate('shop.sort.lowToHigh', currentLanguage) || "Price: Low to High"}</option>
            <option value="price-high-low">{translate('shop.sort.highToLow', currentLanguage) || "Price: High to Low"}</option>
            <option value="rating">{translate('shop.sort.rating', currentLanguage) || "Highest Rated"}</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Filters (Desktop) */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm dark:shadow-gray-800 mb-6 transition-colors">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{translate('shop.filters', currentLanguage) || "Filters"}</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary dark:text-primary-light hover:text-primary/80 dark:hover:text-primary-light/80 font-medium text-sm flex items-center"
                >
                  {translate('shop.clearFilters', currentLanguage) || "Clear All"}
                </button>
              )}
            </div>
            
            {/* Gender Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.gender', currentLanguage) || "Gender"}
              </h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === ''}
                    onChange={() => handleFilterChange('gender', '')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.all', currentLanguage) || "All"}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === 'women'}
                    onChange={() => handleFilterChange('gender', 'women')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.women', currentLanguage) || "Women"}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    checked={filters.gender === 'men'}
                    onChange={() => handleFilterChange('gender', 'men')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.men', currentLanguage) || "Men"}</span>
                </label>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.category', currentLanguage) || "Category"}
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === ''}
                    onChange={() => handleFilterChange('category', '')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.all', currentLanguage) || "All"}</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => handleFilterChange('category', cat)}
                      className="mr-3 text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="capitalize text-gray-700 dark:text-white">{translate(`shop.category.${cat.replace('-', '')}`, currentLanguage) || cat.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-8">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.price', currentLanguage) || "Price Range"}
              </h4>
              <div className="flex items-center space-x-2">
                <div className="flex-grow">
                  <label className="sr-only">{translate('shop.filter.minPrice', currentLanguage) || "Min Price"}</label>
                  <input
                    type="number"
                    placeholder={translate('shop.filter.min', currentLanguage) || "Min"}
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </div>
                <div className="text-gray-400">-</div>
                <div className="flex-grow">
                  <label className="sr-only">{translate('shop.filter.maxPrice', currentLanguage) || "Max Price"}</label>
                  <input
                    type="number"
                    placeholder={translate('shop.filter.max', currentLanguage) || "Max"}
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Colors */}
            <div className="mb-8">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.colors', currentLanguage) || "Colors"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => {
                  const colorMap = {
                    'white': 'bg-white border border-gray-200',
                    'black': 'bg-black',
                    'grey': 'bg-gray-500',
                    'blue': 'bg-blue-500',
                    'navy': 'bg-blue-800',
                    'red': 'bg-red-500',
                    'green': 'bg-green-500',
                    'yellow': 'bg-yellow-400',
                    'purple': 'bg-purple-500',
                    'pink': 'bg-pink-400',
                    'orange': 'bg-orange-500',
                    'brown': 'bg-amber-700',
                    'beige': 'bg-amber-100',
                    'floral': 'bg-gradient-to-r from-pink-300 via-green-200 to-blue-300',
                    'denim': 'bg-blue-700',
                  };
                  
                  return (
                    <button
                      key={color}
                      onClick={() => handleFilterChange('color', color)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        filters.colors.includes(color) ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                      title={translate(`shop.color.${color}`, currentLanguage) || color.charAt(0).toUpperCase() + color.slice(1)}
                    >
                      <span className={`w-6 h-6 rounded-full ${colorMap[color] || 'bg-gray-200'}`}></span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Sizes */}
            <div className="mb-8">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.sizes', currentLanguage) || "Sizes"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('size', size)}
                    className={`min-w-[40px] h-10 px-2 border rounded flex items-center justify-center text-sm transition-colors ${
                      filters.sizes.includes(size) 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Special Filters */}
            <div className="mb-4">
              <h4 className="font-medium mb-3 text-gray-700 border-b pb-2 dark:text-white">
                {translate('shop.filter.special', currentLanguage) || "Special"}
              </h4>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.newArrivals}
                    onChange={() => handleFilterChange('checkbox', 'newArrivals')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.newArrivals', currentLanguage) || "New Arrivals"}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={() => handleFilterChange('checkbox', 'featured')}
                    className="mr-3 text-primary focus:ring-primary h-4 w-4 rounded"
                  />
                  <span className="text-gray-700 dark:text-white">{translate('shop.filter.featured', currentLanguage) || "Featured Items"}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="flex-grow">
          {/* Results Summary */}
          <div className="bg-white dark:bg-surface-dark rounded-lg p-4 mb-6 shadow-sm dark:shadow-gray-800 flex justify-between items-center transition-colors">
            <p className="text-gray-600 dark:text-gray-300 dark:text-gray-100">
              {translate('shop.showing', currentLanguage) || "Showing"} <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> {translate('shop.products', currentLanguage) || "products"}
              {filters.category && <span className="ml-1">{translate('shop.in', currentLanguage) || "in"} <span className="capitalize font-medium dark:text-white">{filters.category.replace('-', ' ')}</span></span>}
              {filters.gender && <span className="ml-1">{translate('shop.for', currentLanguage) || "for"} <span className="capitalize font-medium dark:text-white">{filters.gender}</span></span>}
            </p>
            
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-primary dark:text-primary-light hover:text-primary/80 dark:hover:text-primary-light/80 font-medium flex items-center text-sm md:hidden"
              >
                <span>{translate('shop.clearFilters', currentLanguage) || "Clear filters"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-10 text-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{translate('shop.noProducts', currentLanguage) || "No products found"}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 dark:text-gray-100">{translate('shop.tryAdjusting', currentLanguage) || "Try adjusting your filters or search to find what you're looking for."}</p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                {translate('shop.resetFilters', currentLanguage) || "Reset Filters"}
              </button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowMobileFilters(false)}
            ></motion.div>
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-md bg-white z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-xl">{translate('shop.filters', currentLanguage) || "Filters"}</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Gender Filter - Mobile */}
                <div className="mb-6 border-b pb-4">
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-white">{translate('shop.filter.gender', currentLanguage) || "Gender"}</h4>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender-mobile"
                        checked={filters.gender === ''}
                        onChange={() => handleFilterChange('gender', '')}
                        className="mr-3 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-gray-700 dark:text-white">{translate('shop.filter.all', currentLanguage) || "All"}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender-mobile"
                        checked={filters.gender === 'women'}
                        onChange={() => handleFilterChange('gender', 'women')}
                        className="mr-3 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-gray-700 dark:text-white">{translate('shop.filter.women', currentLanguage) || "Women"}</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender-mobile"
                        checked={filters.gender === 'men'}
                        onChange={() => handleFilterChange('gender', 'men')}
                        className="mr-3 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-gray-700 dark:text-white">{translate('shop.filter.men', currentLanguage) || "Men"}</span>
                    </label>
                  </div>
                </div>
                
                {/* Category Filter - Mobile */}
                <div className="mb-6 border-b pb-4">
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-white">{translate('shop.filter.category', currentLanguage) || "Category"}</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category-mobile"
                        checked={filters.category === ''}
                        onChange={() => handleFilterChange('category', '')}
                        className="mr-3 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-gray-700 dark:text-white">{translate('shop.filter.all', currentLanguage) || "All"}</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={`mobile-${cat}`} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category-mobile"
                          checked={filters.category === cat}
                          onChange={() => handleFilterChange('category', cat)}
                          className="mr-3 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="capitalize text-gray-700 dark:text-white">{translate(`shop.category.${cat.replace('-', '')}`, currentLanguage) || cat.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range - Mobile */}
                <div className="mb-6 border-b pb-4">
                  <h4 className="font-medium mb-3 text-gray-700 dark:text-white">{translate('shop.filter.price', currentLanguage) || "Price Range"}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <label className="sr-only">{translate('shop.filter.minPrice', currentLanguage) || "Min Price"}</label>
                      <input
                        type="number"
                        placeholder={translate('shop.filter.min', currentLanguage) || "Min"}
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </div>
                    <div className="text-gray-400">-</div>
                    <div className="flex-grow">
                      <label className="sr-only">{translate('shop.filter.maxPrice', currentLanguage) || "Max Price"}</label>
                      <input
                        type="number"
                        placeholder={translate('shop.filter.max', currentLanguage) || "Max"}
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Mobile action buttons */}
                <div className="flex space-x-3 mt-6 sticky bottom-0 pt-4 pb-4 bg-white border-t">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                  >
                    {translate('shop.clearAll', currentLanguage) || "Clear All"}
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 font-medium"
                  >
                    {translate('shop.applyFilters', currentLanguage) || "Apply Filters"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShopPage; 