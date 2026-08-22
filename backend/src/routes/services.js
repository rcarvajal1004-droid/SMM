import { Router } from 'express';
import { SmmService } from '../models/index.js';

const router = Router();

let services = [
  { id: 1, name: 'Instagram Followers', category: 'Instagram', ratePer1000: 12.5, min: 50, max: 10000, description: 'Seguidores reales de Instagram' },
  { id: 2, name: 'Instagram Likes', category: 'Instagram', ratePer1000: 5.0, min: 100, max: 50000, description: 'Likes en publicaciones de Instagram' },
  { id: 3, name: 'Instagram Views', category: 'Instagram', ratePer1000: 2.0, min: 500, max: 100000, description: 'Visualizaciones en reels' },
  { id: 4, name: 'TikTok Followers', category: 'TikTok', ratePer1000: 18.0, min: 50, max: 5000, description: 'Seguidores de TikTok' },
  { id: 5, name: 'TikTok Likes', category: 'TikTok', ratePer1000: 6.5, min: 100, max: 50000, description: 'Likes en videos de TikTok' },
  { id: 6, name: 'YouTube Views', category: 'YouTube', ratePer1000: 3.5, min: 500, max: 100000, description: 'Visualizaciones en YouTube' },
  { id: 7, name: 'YouTube Subscribers', category: 'YouTube', ratePer1000: 25.0, min: 50, max: 2000, description: 'Suscriptores de YouTube' },
  { id: 8, name: 'Spotify Plays', category: 'Spotify', ratePer1000: 15.0, min: 100, max: 10000, description: 'Reproducciones en Spotify' },
  { id: 9, name: 'Telegram Members', category: 'Telegram', ratePer1000: 20.0, min: 50, max: 5000, description: 'Miembros para canal de Telegram' }
];

router.get('/', (req, res) => {
  res.json(services);
});

router.get('/:id', (req, res) => {
  const service = services.find(s => s.id === parseInt(req.params.id));
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

export default router;
