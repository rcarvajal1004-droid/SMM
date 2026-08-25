import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { authService } from '../modules/auth/auth.service.js';

export async function authenticate(req, res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required', requestId: req.requestId });
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret);
    const user = await authService.findById(Number(payload.sub));
    if (!user) return res.status(401).json({ error: 'User not found', requestId: req.requestId });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token', requestId: req.requestId });
  }
}
