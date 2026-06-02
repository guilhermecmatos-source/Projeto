import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { simulateTwinScenario } from './digital-twin.service';

const router = Router();
router.use(authMiddleware);

router.get('/scenarios', (_req, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'veiculo_quebra', label: 'E se um veículo quebrar?', icon: 'truck' },
      { id: 'contratacao', label: 'E se eu contratar mais funcionários?', icon: 'users' },
      { id: 'nova_unidade', label: 'E se eu abrir uma nova unidade?', icon: 'building' },
      { id: 'demanda', label: 'E se a demanda crescer 30%?', icon: 'trending-up' },
    ],
  });
});

router.post('/simulate', (req, res: Response) => {
  const { eventType, params } = req.body;
  if (!eventType) {
    res.status(400).json({ success: false, error: 'eventType obrigatório' });
    return;
  }
  const result = simulateTwinScenario({ eventType, params: params || {} });
  res.json({ success: true, data: result });
});

router.get('/state', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      syncedAt: new Date().toISOString(),
      entities: { vehicles: 6, drivers: 3, routes: 3, products: 4, branches: 3, orders: 3 },
      healthScore: 92,
      status: 'operational',
    },
  });
});

export default router;
