import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartAPI from '../api/cart';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cart from API when user logs in and sync guest cart
  useEffect(() => {
    if (isAuthenticated && user && !isSyncing) {
      const guestCart = localStorage.getItem('cart');
      const guestItems = guestCart ? JSON.parse(guestCart) : [];
      
      if (guestItems.length > 0) {
        // Sync guest cart first, then load from API
        syncGuestCartToAPI();
      } else {
        // Just load from API
        loadCartFromAPI();
      }
    }
  }, [isAuthenticated, user?.id]);

  const loadCartFromAPI = async () => {
    setIsLoading(true);
    try {
      const response = await cartAPI.getCart();
      if (response.data.success) {
        const apiItems = response.data.data.cart.items.map(item => ({
          id: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));
        setCartItems(apiItems);
        localStorage.setItem('cart', JSON.stringify(apiItems));
      }
    } catch (error) {
      // Error loading cart from API
    } finally {
      setIsLoading(false);
    }
  };

  const syncGuestCartToAPI = async () => {
    const guestCart = localStorage.getItem('cart');
    if (!guestCart) {
      // No guest cart, just load from API
      loadCartFromAPI();
      return;
    }

    const guestItems = JSON.parse(guestCart);
    if (guestItems.length === 0) {
      // Empty guest cart, just load from API
      loadCartFromAPI();
      return;
    }

    setIsSyncing(true);
    try {
      const response = await cartAPI.syncCart(guestItems);
      if (response.data.success) {
        const apiItems = response.data.data.cart.items.map(item => ({
          id: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }));
        setCartItems(apiItems);
        localStorage.setItem('cart', JSON.stringify(apiItems));
      }
    } catch (error) {
      // Fallback to loading from API
      loadCartFromAPI();
    } finally {
      setIsSyncing(false);
    }
  };

  // Note: Individual operations (add, update, remove) handle API calls directly
  // This function is kept for potential future bulk operations

  const addToCart = async (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && 
                item.size === (product.size || '') && 
                item.color === (product.color || '')
      );
      
      let newItems;
      if (existingItem) {
        // Update quantity if item exists
        newItems = prevItems.map(item =>
          item.id === product.id && 
          item.size === (product.size || '') && 
          item.color === (product.color || '')
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...prevItems, { 
          ...product, 
          quantity,
          size: product.size || '',
          color: product.color || '',
        }];
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));

      // Add to API if authenticated
      if (isAuthenticated && !existingItem) {
        cartAPI.addItem({
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: quantity,
          size: product.size || '',
          color: product.color || '',
        }).catch(() => {
          // Error adding item to API
        });
      } else if (isAuthenticated && existingItem) {
        // Update quantity in API
        const updatedItem = newItems.find(item => 
          item.id === product.id && 
          item.size === (product.size || '') && 
          item.color === (product.color || '')
        );
        if (updatedItem) {
          cartAPI.updateItem(product.id, updatedItem.quantity).catch(() => {
            // Error updating item in API
          });
        }
      }

      return newItems;
    });
  };

  const removeFromCart = async (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));

      // Remove from API if authenticated
      if (isAuthenticated) {
        cartAPI.removeItem(productId).catch(() => {
          // Error removing item from API
        });
      }

      return newItems;
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));

      // Update in API if authenticated
      if (isAuthenticated) {
        cartAPI.updateItem(productId, quantity).catch(() => {
          // Error updating item in API
        });
      }

      return newItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');

    // Clear API cart if authenticated
    if (isAuthenticated) {
      cartAPI.clearCart().catch(() => {
        // Error clearing cart in API
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    isLoading,
    isSyncing,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart: loadCartFromAPI,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
