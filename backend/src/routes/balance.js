import { Router } from 'express';
import { validateBalance } from '../middleware/validate.js';
import { userRepository } from '../modules/users/user.repository.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.json({ balance: user.balance });
  } catch (error) { next(error); }
});

router.post('/add', validateBalance, async (req, res, next) => {
  try {
    const { amount, provider, providerReference } = req.validated;
    await userRepository.addBalanceTransaction(req.user.id, amount, 'Credit', providerReference || `${provider}-add`);
    const user = await userRepository.findById(req.user.id);
    req.user.balance = user.balance;
    res.json({ balance: user.balance });
  } catch (error) { next(error); }
});

export default router;