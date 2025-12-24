import mongoose from 'mongoose';

/**
 * Middleware to check database connection
 * Returns 503 if database is not connected
 */
export const checkDatabase = (req, res, next) => {
  const readyState = mongoose.connection.readyState;
  
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection not available. Please try again later.',
      error: `Database readyState: ${getReadyStateName(readyState)}`,
    });
  }
  
  next();
};

/**
 * Get human-readable readyState name
 */
function getReadyStateName(state) {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}

