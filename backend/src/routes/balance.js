import { Router } from 'express';
import { validateBalance } from '../middleware/validate.js';

const router = Router();

let balance = 156.75;

router.get('/', (req, res) => {
  res.json({ balance });
});

router.post('/add', validateBalance, (req, res) => {
  balance += req.body.amount;
  res.json({ balance });
});

export default router;
