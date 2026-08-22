import { Router } from 'express';

const router = Router();

const profile = {
  id: 1,
  username: 'demo_user',
  balance: 156.75,
  apiKey: 'sk_mock_key'
};

router.get('/', (req, res) => {
  res.json(profile);
});

export default router;
