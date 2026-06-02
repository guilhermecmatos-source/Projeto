import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockClients, mockOrders } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/clients', (_req, res: Response) => {
  res.json({ success: true, data: mockClients });
});

router.get('/orders', (_req, res: Response) => {
  res.json({ success: true, data: mockOrders });
});

router.get('/reports/summary', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      totalOrders: mockOrders.length,
      totalRevenue: mockOrders.reduce((s, o) => s + o.totalAmount, 0),
      pendingOrders: mockOrders.filter((o) => o.status === 'pendente').length,
      topClients: mockClients.sort((a, b) => b.totalPurchases - a.totalPurchases).slice(0, 5),
    },
  });
});

export default router;
