import { Router } from 'express';
import { servicesRepository } from '../modules/services/services.repository.js';
import { validate, createServiceSchema, updateServiceSchema } from '../shared/schemas.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    res.json(await servicesRepository.findAll());
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const service = await servicesRepository.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) { next(error); }
});

router.post('/', authenticate, validate(createServiceSchema), async (req, res, next) => {
  try {
    const service = await servicesRepository.create(req.validated);
    res.status(201).json(service);
  } catch (error) { next(error); }
});

router.patch('/:id', authenticate, validate(updateServiceSchema), async (req, res, next) => {
  try {
    const service = await servicesRepository.update(Number(req.params.id), req.validated);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) { next(error); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const deleted = await servicesRepository.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.status(204).end();
  } catch (error) { next(error); }
});

export default router;