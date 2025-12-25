import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

const WISHLIST_VERSION = '1.1';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Check version and clear old wishlist if needed
    const savedVersion = localStorage.getItem('wishlistVersion');
    if (savedVersion !== WISHLIST_VERSION) {
      console.log('Wishlist version mismatch, clearing old wishlist');
      localStorage.removeItem('wishlist');
      localStorage.setItem('wishlistVersion', WISHLIST_VERSION);
      return [];
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    const items = savedWishlist ? JSON.parse(savedWishlist) : [];
    console.log('Loaded wishlist items from localStorage:', items);
    return items;
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    console.log('Wishlist saved to localStorage:', wishlistItems);
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    setWishlistItems(prevItems => {
      // Check if item already exists
      const exists = prevItems.some(item => item.id === product.id);
      
      if (exists) {
        console.log('Product already in wishlist:', product.id);
        return prevItems;
      }

      // Add item with proper structure
      const newItem = {
        id: product.id,
        name: product.name || 'Product',
        image: product.image || '/images/products/female_01.jpg',
        price: typeof product.price === 'number' ? product.price : 0,
        category: product.category || '',
        inStock: product.inStock !== false, // Default to true if not specified
      };

      const newItems = [...prevItems, newItem];
      console.log('Added to wishlist:', newItem);
      return newItems;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      console.log('Removed from wishlist:', productId);
      return newItems;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    console.log('Wishlist cleared');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;