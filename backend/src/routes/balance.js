import { Router } from 'express';

const router = Router();

let balance = 156.75;

router.get('/', (req, res) => {
  res.json({ balance });
});

router.post('/add', (req, res) => {
  const { amount } = req.body;
  if (amount && amount > 0) {
    balance += amount;
    res.json({ balance });
  } else {
    res.status(400).json({ error: 'Invalid amount' });
  }
});

export default router;
