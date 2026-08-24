import { Router } from 'express';
import { ordersService } from './orders.service.js';
import { validateOrder } from '../../middleware/validate.js';

const router = Router();

router.get('/', (_req, res) => res.json(ordersService.list()));
router.post('/', validateOrder, (req, res) => res.status(201).json(ordersService.create(req.body)));

export default router;