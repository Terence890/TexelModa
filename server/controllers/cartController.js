import Cart from '../models/Cart.js';

/**
 * Get user cart
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

/**
 * Add item to cart
 */
export const addItem = async (req, res) => {
  try {
    const { productId, name, image, price, quantity = 1, size, color } = req.body;

    if (!productId || !name || !image || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productId, name, image, price',
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.size === (size || '') && item.color === (color || '')
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        image,
        price,
        quantity,
        size: size || '',
        color: color || '',
        addedAt: new Date(),
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart',
      data: { cart },
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message,
    });
  }
};

/**
 * Update cart item quantity
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.find(item => item.productId === id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart item updated',
      data: { cart },
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message,
    });
  }
};

/**
 * Remove item from cart
 */
export const removeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(item => item.productId !== id);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

/**
 * Clear cart
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { cart },
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message,
    });
  }
};

/**
 * Sync guest cart with user cart
 */
export const syncCart = async (req, res) => {
  try {
    const { guestItems } = req.body; // Array of cart items from localStorage

    if (!Array.isArray(guestItems)) {
      return res.status(400).json({
        success: false,
        message: 'guestItems must be an array',
      });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    // Merge guest items with existing cart items
    guestItems.forEach(guestItem => {
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === guestItem.id && 
                item.size === (guestItem.size || '') && 
                item.color === (guestItem.color || '')
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart.items[existingItemIndex].quantity += guestItem.quantity || 1;
      } else {
        // Add new item
        cart.items.push({
          productId: guestItem.id,
          name: guestItem.name,
          image: guestItem.image,
          price: guestItem.price,
          quantity: guestItem.quantity || 1,
          size: guestItem.size || '',
          color: guestItem.color || '',
          addedAt: new Date(),
        });
      }
    });

    await cart.save();

    res.json({
      success: true,
      message: 'Cart synced successfully',
      data: { cart },
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing cart',
      error: error.message,
    });
  }
};

