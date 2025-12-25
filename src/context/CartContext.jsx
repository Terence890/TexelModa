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

const CART_VERSION = '1.1'; // Keep at 1.1 to preserve existing carts

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    // Check version and clear old cart if needed
    const savedVersion = localStorage.getItem('cartVersion');
    if (savedVersion !== CART_VERSION) {
      console.log('Cart version mismatch, clearing old cart');
      localStorage.removeItem('cart');
      localStorage.setItem('cartVersion', CART_VERSION);
      return [];
    }
    
    // Load cart items from localStorage on initial render
    const savedCart = localStorage.getItem('cart');
    const items = savedCart ? JSON.parse(savedCart) : [];
    console.log('Loaded cart items from localStorage:', items);
    return items;
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
          size: item.size || '',
          color: item.color || '',
        }));
        setCartItems(apiItems);
        localStorage.setItem('cart', JSON.stringify(apiItems));
      }
    } catch (error) {
      console.error('Error loading cart from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncGuestCartToAPI = async () => {
    const guestCart = localStorage.getItem('cart');
    if (!guestCart) {
      loadCartFromAPI();
      return;
    }

    const guestItems = JSON.parse(guestCart);
    if (guestItems.length === 0) {
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
          size: item.size || '',
          color: item.color || '',
        }));
        setCartItems(apiItems);
        localStorage.setItem('cart', JSON.stringify(apiItems));
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      loadCartFromAPI();
    } finally {
      setIsSyncing(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    // Ensure product has all required fields
    if (!product || !product.id) {
      console.error('Invalid product:', product);
      return;
    }

    const itemSize = product.size || '';
    const itemColor = product.color || '';

    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.id === product.id && 
                item.size === itemSize && 
                item.color === itemColor
      );
      
      let newItems;
      if (existingItem) {
        // Update quantity if item exists
        newItems = prevItems.map(item =>
          item.id === product.id && 
          item.size === itemSize && 
          item.color === itemColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item with proper structure
        const newItem = { 
          id: product.id,
          name: product.name || 'Product',
          image: product.image || '/images/products/female_01.jpg',
          price: typeof product.price === 'number' ? product.price : 0,
          quantity: quantity,
          size: itemSize,
          color: itemColor,
        };
        newItems = [...prevItems, newItem];
      }

      // Save to localStorage immediately
      localStorage.setItem('cart', JSON.stringify(newItems));
      console.log('Cart updated:', newItems);

      // Sync with API if authenticated
      if (isAuthenticated) {
        const itemToSync = {
          productId: product.id,
          name: product.name || 'Product',
          image: product.image || '/images/products/female_01.jpg',
          price: typeof product.price === 'number' ? product.price : 0,
          quantity: existingItem ? existingItem.quantity + quantity : quantity,
          size: itemSize,
          color: itemColor,
        };

        if (existingItem) {
          // Update existing item
          cartAPI.updateItem(product.id, itemToSync.quantity, itemSize, itemColor).catch(err => {
            console.error('Error updating item in API:', err);
          });
        } else {
          // Add new item
          cartAPI.addItem(itemToSync).catch(err => {
            console.error('Error adding item to API:', err);
          });
        }
      }

      return newItems;
    });
  };

  const removeFromCart = async (productId, size = '', color = '') => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => 
        !(item.id === productId && 
          item.size === size && 
          item.color === color)
      );
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      console.log('Item removed, cart:', newItems);

      // Remove from API if authenticated
      if (isAuthenticated) {
        cartAPI.removeItem(productId, size, color).catch(err => {
          console.error('Error removing item from API:', err);
        });
      }

      return newItems;
    });
  };

  const updateQuantity = async (productId, quantity, size = '', color = '') => {
    if (quantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      console.log('Quantity updated, cart:', newItems);

      // Update in API if authenticated
      if (isAuthenticated) {
        cartAPI.updateItem(productId, quantity, size, color).catch(err => {
          console.error('Error updating quantity in API:', err);
        });
      }

      return newItems;
    });
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    console.log('Cart cleared');

    // Clear API cart if authenticated
    if (isAuthenticated) {
      cartAPI.clearCart().catch(err => {
        console.error('Error clearing cart in API:', err);
      });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return count + quantity;
    }, 0);
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
