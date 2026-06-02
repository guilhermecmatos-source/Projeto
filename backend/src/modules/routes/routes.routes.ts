import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockRoutes, mockVehicles } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/', (_req, res: Response) => {
  res.json({ success: true, data: mockRoutes });
});

router.get('/tracking/live', (_req, res: Response) => {
  const live = mockVehicles
    .filter((v) => v.status === 'em_rota')
    .map((v) => ({
      vehicleId: v.id,
      name: v.name,
      type: v.type,
      lat: v.latitude,
      lng: v.longitude,
      plate: v.plate,
    }));
  res.json({ success: true, data: live });
});

router.get('/history', (_req, res: Response) => {
  res.json({
    success: true,
    data: mockRoutes.filter((r) => r.status === 'concluida').map((r) => ({
      ...r,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      fuelCost: 380,
      onTime: true,
    })),
  });
});

export default router;
