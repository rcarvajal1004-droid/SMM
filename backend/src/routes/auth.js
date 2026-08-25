import { Router } from 'express';
import { authService } from '../modules/auth/auth.service.js';
import { validate, registerSchema, loginSchema } from '../shared/schemas.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.validated);
    res.status(201).json(result);
  } catch (error) { next(error); }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    res.json(await authService.login(req.validated.identifier.trim().toLowerCase(), req.validated.password));
  } catch (error) { next(error); }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required', requestId: req.requestId });
    res.json(await authService.refresh(refreshToken));
  } catch (error) { next(error); }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    res.json(await authService.logout(req.user.id));
  } catch (error) { next(error); }
});

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'currentPassword and newPassword are required', requestId: req.requestId });
    if (newPassword.length < 8) return res.status(400).json({ error: 'newPassword must be at least 8 characters', requestId: req.requestId });
    res.json(await authService.changePassword(req.user.id, currentPassword, newPassword));
  } catch (error) { next(error); }
});

export default router;
