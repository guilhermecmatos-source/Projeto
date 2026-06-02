import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockDrivers } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/', (_req, res: Response) => {
  res.json({ success: true, data: mockDrivers });
});

router.get('/:id', (req, res: Response) => {
  const d = mockDrivers.find((x) => x.id === parseInt(req.params.id, 10));
  if (!d) return res.status(404).json({ success: false, error: 'Motorista não encontrado' });
  res.json({ success: true, data: d });
});

export default router;
