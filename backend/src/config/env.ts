import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fleet_ai',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fleet-ai-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  useMockData: process.env.USE_MOCK_DATA === 'true' || process.env.USE_MOCK_DATA === '1',
};
