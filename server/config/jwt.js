import dotenv from 'dotenv';

dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
};

// Validate that secrets are set in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-refresh-secret-change-in-production') {
    throw new Error('JWT_REFRESH_SECRET must be set in production environment');
  }
}

