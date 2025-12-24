import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { translate } from '../utils/translate';
import { 
  FaHeart, 
  FaShoppingCart, 
  FaStar, 
  FaChevronLeft, 
  FaShareAlt,
  FaCheck,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaPlay
} from 'react-icons/fa';
import apiClient from '../utils/apiClient';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const response = await apiClient.get(`/api/products/${id}`);
          if (response.data.success) {
            setProduct(response.data.product);
            if (response.data.product.colors && response.data.product.colors.length > 0) {
              setSelectedColor(response.data.product.colors[0]);
            }
            if (response.data.product.sizes && response.data.product.sizes.length > 0) {
              setSelectedSize(response.data.product.sizes[0]);
            }
          }
        } catch (apiError) {
          // Fallback to local products if API fails
          const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const foundProduct = localProducts.find(p => p.id === id || p._id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.colors && foundProduct.colors.length > 0) {
              setSelectedColor(foundProduct.colors[0]);
            }
            if (foundProduct.sizes && foundProduct.sizes.length > 0) {
              setSelectedSize(foundProduct.sizes[0]);
            }
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    
    addToCart(cartItem);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isInWishlist = product && wishlistItems.some(item => item.id === product.id || item._id === product._id);
  
  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      removeFromWishlist(product.id || product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleTryOn = () => {
    if (!product) return;
    navigate('/try-on', { state: { selectedClothing: product.image } });
  };

  const images = product?.images || (product?.image ? [product.image] : []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
          isDarkMode ? 'border-primary-light' : 'border-primary-dark'
        }`}></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className={`text-center rounded-2xl shadow-lg p-8 ${
          isDarkMode
            ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
            : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {error || 'Product Not Found'}
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/shop"
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
              isDarkMode
                ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-xl transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <FaChevronLeft className="w-4 h-4" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className={`rounded-2xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
            }`}>
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-[600px] object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? isDarkMode
                          ? 'border-primary-light ring-2 ring-primary-light'
                          : 'border-primary-dark ring-2 ring-primary-dark'
                        : isDarkMode
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Badges */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {product.category || 'Uncategorized'}
              </span>
              <div className="flex space-x-2">
                {product.isNew && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white'
                      : 'bg-gradient-to-r from-primary-light to-primary-dark text-white'
                  }`}>
                    NEW
                  </span>
                )}
                {product.isFeatured && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Product Name */}
            <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({product.reviewCount || 0} {translate('product.reviews', currentLanguage) || 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className={`text-4xl font-bold ${
                isDarkMode ? 'text-primary-light' : 'text-primary-dark'
              }`}>
                ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className={`text-xl line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className={`rounded-xl p-4 ${
                isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50'
              }`}>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {translate('product.size', currentLanguage) || 'Size'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? isDarkMode
                            ? 'bg-gradient-to-r from-primary-dark to-primary-light text-white shadow-md'
                            : 'bg-gradient-to-r from-primary-light to-primary-dark text-white shadow-md'
                          : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className={`block text-sm font-semibold mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {translate('product.color', currentLanguage) || 'Color'}
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
                        colorMap[color] || 'bg-gray-200'
                      } ${
                        selectedColor === color
                          ? isDarkMode
                            ? 'ring-4 ring-primary-light'
                            : 'ring-4 ring-primary-dark'
                          : isDarkMode
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {translate('product.quantity', currentLanguage) || 'Quantity'}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  -
                </button>
                <span className={`text-lg font-semibold w-12 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-primary-dark to-primary-light hover:from-primary-light hover:to-primary-dark text-white'
                      : 'bg-gradient-to-r from-primary-light to-primary-dark hover:from-primary-dark hover:to-primary-light text-white'
                  }`}
                >
                  <FaShoppingCart className="w-5 h-5" />
                  <span>{translate('product.addToCart', currentLanguage) || 'Add to Cart'}</span>
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-14 h-14 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                    isInWishlist
                      ? isDarkMode
                        ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                        : 'bg-red-50 text-red-600 border-2 border-red-200'
                      : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <FaHeart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleTryOn}
                  className={`w-14 h-14 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                  }`}
                  title={translate('product.tryOnThis', currentLanguage) || 'Try On'}
                >
                  <FaPlay className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`rounded-xl p-4 flex items-center space-x-3 ${
                    isDarkMode ? 'bg-green-900/20 border border-green-500/50' : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <FaCheck className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                    {translate('product.addedToCart', currentLanguage) || 'Added to cart successfully!'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Features */}
            <div className={`rounded-2xl shadow-lg p-6 ${
              isDarkMode
                ? 'bg-gray-800/50 backdrop-blur-md border border-gray-700/50'
                : 'bg-white/50 backdrop-blur-md border border-gray-200/50'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaTruck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('product.freeShipping', currentLanguage) || 'Free Shipping'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {translate('product.onOrdersOver', currentLanguage) || 'On orders over $50'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaUndo className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('product.easyReturns', currentLanguage) || 'Easy Returns'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {translate('product.within30Days', currentLanguage) || 'Within 30 days'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-primary-dark to-primary-light'
                      : 'bg-gradient-to-br from-primary-light to-primary-dark'
                  }`}>
                    <FaShieldAlt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {translate('product.securePayment', currentLanguage) || 'Secure Payment'}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {translate('product.encrypted', currentLanguage) || '100% Encrypted'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;

