import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockVehicles } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/', (_req, res: Response) => {
  res.json({ success: true, data: mockVehicles });
});

router.get('/:id', (req, res: Response) => {
  const v = mockVehicles.find((x) => x.id === parseInt(req.params.id, 10));
  if (!v) return res.status(404).json({ success: false, error: 'Veículo não encontrado' });
  res.json({ success: true, data: v });
});

router.get('/types/summary', (_req, res: Response) => {
  const summary = ['caminhao', 'carro', 'moto', 'drone', 'robo'].map((type) => ({
    type,
    count: mockVehicles.filter((v) => v.type === type).length,
    active: mockVehicles.filter((v) => v.type === type && v.status === 'em_rota').length,
  }));
  res.json({ success: true, data: summary });
});

export default router;
