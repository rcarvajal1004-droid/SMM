import { Router } from 'express';
import { ordersService } from './orders.service.js';
import { validateOrder } from '../../middleware/validate.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try { res.json(await ordersService.list(req.user.id)); } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try { res.json(await ordersService.getById(req.user.id, req.params.id)); } catch (error) { next(error); }
});

router.post('/', validateOrder, async (req, res, next) => {
  try { res.status(201).json(await ordersService.create(req.user, req.validated)); } catch (error) { next(error); }
});

router.post('/:id/cancel', async (req, res, next) => {
  try { res.json(await ordersService.cancel(req.user.id, req.params.id)); } catch (error) { next(error); }
});

export default router;