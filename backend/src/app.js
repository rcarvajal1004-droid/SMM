import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestId } from './middleware/request-id.js';
import { requestLogger } from './middleware/request-logger.js';
import { auditLog } from './middleware/audit-logger.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { authenticate } from './middleware/auth.js';
import { apiRateLimit, authRateLimit } from './middleware/rate-limit.js';
import authRouter from './routes/auth.js';
import servicesRouter from './routes/services.js';
import ordersRouter from './routes/orders.js';
import balanceRouter from './routes/balance.js';
import profileRouter from './routes/profile.js';
import paymentsRouter from './modules/payments/payments.routes.js';
import bookingRouter from './modules/booking/booking.routes.js';
import quotesRouter from './modules/quotes/quotes.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.allowedOrigins }));
  app.use(helmet());
  app.use(express.json({ limit: '100kb' }));
  app.use(requestId);
  app.use(requestLogger);
  app.use(auditLog);
  app.use('/api/v1', apiRateLimit);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'smm-backend', environment: env.nodeEnv });
  });

  app.use(['/api/v1/auth', '/api/auth'], authRateLimit, authRouter);
  app.use(['/api/v1/smm/services', '/api/smm/services'], servicesRouter);
  app.use(['/api/v1/smm/orders', '/api/smm/orders'], authenticate, ordersRouter);
  app.use(['/api/v1/smm/balance', '/api/smm/balance'], authenticate, balanceRouter);
  app.use(['/api/v1/smm/profile', '/api/smm/profile'], authenticate, profileRouter);
  app.use(['/api/v1/smm/payments', '/api/smm/payments'], authenticate, paymentsRouter);
  app.use(['/api/v1/climatech/booking', '/api/climatech/booking'], authenticate, bookingRouter);
  app.use(['/api/v1/climatech/quotes', '/api/climatech/quotes'], authenticate, quotesRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
