import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { mockKpis, mockAlerts } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/kpis', (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: mockKpis });
});

router.get('/charts/revenue', (_req, res: Response) => {
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  res.json({
    success: true,
    data: { labels, datasets: [{ label: 'Receita', data: mockKpis.revenueTrend }, { label: 'Custos', data: mockKpis.costTrend }] },
  });
});

router.get('/alerts', (_req, res: Response) => {
  res.json({ success: true, data: mockAlerts });
});

export default router;
