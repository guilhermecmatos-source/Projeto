import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockProducts } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/products', (_req, res: Response) => {
  res.json({ success: true, data: mockProducts });
});

router.get('/alerts', (_req, res: Response) => {
  const lowStock = mockProducts.filter((p) => p.currentStock < p.minStock);
  res.json({
    success: true,
    data: lowStock.map((p) => ({
      productId: p.id,
      sku: p.sku,
      name: p.name,
      current: p.currentStock,
      minimum: p.minStock,
      severity: p.currentStock < p.minStock * 0.5 ? 'critico' : 'aviso',
    })),
  });
});

router.get('/movements', (_req, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 1, productName: 'Óleo Lubrificante 5L', type: 'entrada', quantity: 50, date: new Date().toISOString() },
      { id: 2, productName: 'Pneu 295/80 R22.5', type: 'saida', quantity: 4, date: new Date(Date.now() - 3600000).toISOString() },
    ],
  });
});

export default router;
