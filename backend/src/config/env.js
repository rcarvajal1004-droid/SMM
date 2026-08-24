const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 3000),
  allowedOrigins,
  nodeEnv: process.env.NODE_ENV || 'development'
};