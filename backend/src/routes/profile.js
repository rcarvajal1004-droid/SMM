import { Router } from 'express';
import { userRepository } from '../modules/users/user.repository.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.json({ id: user.id, username: user.username, balance: user.balance, apiKey: null });
  } catch (error) { next(error); }
});

export default router;