import 'dotenv/config';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'development-only-change-this-secret';
if (nodeEnv === 'production' && (jwtSecret === 'development-only-change-this-secret' || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

export const env = {
  port: Number(process.env.PORT || 3000),
  allowedOrigins,
  nodeEnv,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',
  database: {
    server: process.env.DB_SERVER || 'localhost',
    instance: process.env.DB_INSTANCE || '',
    port: Number(process.env.DB_PORT || 1433),
    name: process.env.DB_NAME || 'SmmDb',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    trustedConnection: process.env.DB_TRUSTED_CONNECTION !== 'false',
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false'
  }
};