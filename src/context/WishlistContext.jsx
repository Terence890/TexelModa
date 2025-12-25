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
    const savedVersion = localStorage.getItem('wishlistVersion');
    if (savedVersion !== WISHLIST_VERSION) {
      localStorage.removeItem('wishlist');
      localStorage.setItem('wishlistVersion', WISHLIST_VERSION);
      return [];
    }
    
    const savedWishlist = localStorage.getItem('wishlist');
    const items = savedWishlist ? JSON.parse(savedWishlist) : [];
    return items;
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    if (!product || !product.id) {
      return;
    }

    setWishlistItems(prevItems => {
      const exists = prevItems.some(item => item.id === product.id);
      
      if (exists) {
        return prevItems;
      }

      const newItem = {
        id: product.id,
        name: product.name || 'Product',
        image: product.image || '/images/products/female_01.jpg',
        price: typeof product.price === 'number' ? product.price : 0,
        category: product.category || '',
        inStock: product.inStock !== false,
      };

      const newItems = [...prevItems, newItem];
      return newItems;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      return newItems;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
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