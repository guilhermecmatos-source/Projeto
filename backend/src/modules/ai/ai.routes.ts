import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockAiPredictions, mockRoutes, mockVehicles } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/predictions', (_req, res: Response) => {
  res.json({ success: true, data: mockAiPredictions });
});

router.get('/route-suggestions', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      routeId: 2,
      current: { distance: 35.2, cost: 535, duration: 90 },
      suggested: { distance: 27.2, cost: 490, duration: 72, savings: 45, via: 'Av. Radial Leste' },
      confidence: 91,
    },
  });
});

router.get('/bottlenecks', (_req, res: Response) => {
  res.json({
    success: true,
    data: [
      { location: 'CD Osasco', type: 'separacao', peak: '14:00-16:00', severity: 'media', impact: 'Atraso médio +25 min' },
      { location: 'Marginal Tietê', type: 'transito', peak: '17:00-19:00', severity: 'alta', impact: 'Rotas RT-001, RT-002' },
    ],
  });
});

router.get('/strategic-recommendations', (_req, res: Response) => {
  res.json({
    success: true,
    data: [
      { priority: 1, title: 'Consolidar rotas zona leste', impact: 'R$ 12.400/mês', effort: 'baixo' },
      { priority: 2, title: 'Reposição urgente SKU-002', impact: 'Evitar R$ 45K/dia parada', effort: 'baixo' },
      { priority: 3, title: 'Expandir frota drones última milha', impact: 'ROI 8 meses', effort: 'medio' },
      { priority: 4, title: 'Filial Interior SP', impact: 'R$ 1.2M receita/ano', effort: 'alto' },
    ],
  });
});

router.post('/delay-prediction', (req, res: Response) => {
  const routeId = req.body.routeId || 1;
  res.json({
    success: true,
    data: {
      routeId,
      probability: 0.87,
      estimatedDelayMin: 15,
      factors: ['Trânsito Marginal', 'Hora pico', 'Histórico rota'],
    },
  });
});

export default router;
