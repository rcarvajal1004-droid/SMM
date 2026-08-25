import { Router } from 'express';
import { quotesService } from './quotes.service.js';
import { authenticate } from '../../middleware/auth.js';
import { z } from 'zod';

const createQuoteSchema = z.object({
  serviceType: z.enum(['HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair']),
  propertyType: z.enum(['Residential', 'Commercial', 'Industrial']),
  squareFootage: z.number().int().min(100).max(100000),
  equipmentBrand: z.string().max(80).optional(),
  efficiencyRating: z.enum(['Standard', 'High', 'Premium']).optional(),
  details: z.record(z.unknown()).optional(),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors, requestId: req.requestId });
  }
  req.validated = result.data;
  next();
};

const router = Router();

router.get('/', authenticate, async (req, res, next) => {
  try { res.json(await quotesService.list(req.user.id)); } catch (error) { next(error); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try { res.json(await quotesService.getById(req.user.id, req.params.id)); } catch (error) { next(error); }
});

router.post('/', authenticate, validate(createQuoteSchema), async (req, res, next) => {
  try { res.status(201).json(await quotesService.create(req.user.id, req.validated)); } catch (error) { next(error); }
});

router.post('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required', requestId: req.requestId });
    res.json(await quotesService.updateStatus(req.user.id, req.params.id, status));
  } catch (error) { next(error); }
});

export default router;