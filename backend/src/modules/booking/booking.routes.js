import { Router } from 'express';
import { bookingService } from './booking.service.js';
import { authenticate } from '../../middleware/auth.js';
import { z } from 'zod';

const createBookingSchema = z.object({
  serviceType: z.enum(['HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair', 'Maintenance', 'Inspection']),
  address: z.string().min(10).max(500),
  preferredDate: z.string().date(),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  notes: z.string().max(1000).optional(),
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
  try { res.json(await bookingService.list(req.user.id)); } catch (error) { next(error); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try { res.json(await bookingService.getById(req.user.id, req.params.id)); } catch (error) { next(error); }
});

router.post('/', authenticate, validate(createBookingSchema), async (req, res, next) => {
  try { res.status(201).json(await bookingService.create(req.user.id, req.validated)); } catch (error) { next(error); }
});

router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try { res.json(await bookingService.cancel(req.user.id, req.params.id)); } catch (error) { next(error); }
});

export default router;