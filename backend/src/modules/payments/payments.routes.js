import { Router } from 'express';
import { paymentsService } from './payments.service.js';
import { authenticate } from '../../middleware/auth.js';
import { validate, addFundsSchema } from '../../shared/schemas.js';

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    res.json(await paymentsService.list(req.user.id));
  } catch (error) { next(error); }
});

router.post('/', authenticate, validate(addFundsSchema), async (req, res, next) => {
  try {
    const { amount, provider, providerReference } = req.validated;
    const payment = await paymentsService.create(req.user.id, { amount, provider, providerReference });
    res.status(201).json(payment);
  } catch (error) { next(error); }
});

router.post('/:id/approve', authenticate, async (req, res, next) => {
  try {
    const payment = await paymentsService.approve(Number(req.params.id));
    if (payment.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(payment);
  } catch (error) { next(error); }
});

router.post('/:id/reject', authenticate, async (req, res, next) => {
  try {
    const payment = await paymentsService.reject(Number(req.params.id));
    if (payment.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(payment);
  } catch (error) { next(error); }
});

router.post('/:id/refund', authenticate, async (req, res, next) => {
  try {
    const payment = await paymentsService.refund(Number(req.params.id));
    if (payment.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(payment);
  } catch (error) { next(error); }
});

export default router;