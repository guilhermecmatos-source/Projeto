import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { mockIncidents, mockVehicles, mockAlerts } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/overview', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      activeRoutes: 2,
      vehiclesInTransit: mockVehicles.filter((v) => v.status === 'em_rota').length,
      openIncidents: mockIncidents.filter((i) => i.status !== 'resolvida').length,
      criticalAlerts: mockAlerts.filter((a) => a.type === 'critico').length,
      fleetHealth: 92,
    },
  });
});

router.get('/incidents', (_req, res: Response) => {
  res.json({ success: true, data: mockIncidents });
});

router.post('/incidents/:id/resolve', (req, res: Response) => {
  const id = parseInt(req.params.id, 10);
  res.json({ success: true, data: { id, status: 'resolvida', resolvedAt: new Date().toISOString() } });
});

router.get('/realtime', (_req, res: Response) => {
  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      vehicles: mockVehicles.map((v) => ({ ...v, speed: Math.floor(Math.random() * 60) + 20 })),
      incidents: mockIncidents,
    },
  });
});

export default router;
