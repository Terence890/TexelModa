/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXXXXX (e.g., ORD-20241219-123456)
 */
export const generateOrderNumber = async () => {
  const prefix = 'ORD';
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  
  return `${prefix}-${dateStr}-${randomNum}`;
};

/**
 * Generate order number and ensure uniqueness
 */
export const generateUniqueOrderNumber = async (OrderModel) => {
  let orderNumber;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    orderNumber = await generateOrderNumber();
    const existingOrder = await OrderModel.findOne({ orderNumber });
    
    if (!existingOrder) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique order number after multiple attempts');
  }

  return orderNumber;
};

