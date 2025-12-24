import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object} Decoded token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtConfig.refreshSecret);
};

