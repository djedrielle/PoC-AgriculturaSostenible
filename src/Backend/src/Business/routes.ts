import { Router } from 'express';

export const router = Router();

router.get('/status', (req, res) => {
  res.json({ message: 'API funcionando correctamente 🚀' });
});
