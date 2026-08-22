import express from 'express';
import cors from 'cors';
import servicesRouter from './routes/services.js';
import ordersRouter from './routes/orders.js';
import balanceRouter from './routes/balance.js';
import profileRouter from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/smm/services', servicesRouter);
app.use('/api/smm/orders', ordersRouter);
app.use('/api/smm/balance', balanceRouter);
app.use('/api/smm/profile', profileRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
