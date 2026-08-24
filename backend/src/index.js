import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestId } from './middleware/request-id.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import servicesRouter from './routes/services.js';
import ordersRouter from './routes/orders.js';
import balanceRouter from './routes/balance.js';
import profileRouter from './routes/profile.js';

const app = express();
app.use(cors({ origin: env.allowedOrigins }));
app.use(express.json({ limit: '100kb' }));
app.use(requestId);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'smm-backend', environment: env.nodeEnv }));

app.use('/api/smm/services', servicesRouter);
app.use('/api/smm/orders', ordersRouter);
app.use('/api/smm/balance', balanceRouter);
app.use('/api/smm/profile', profileRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
