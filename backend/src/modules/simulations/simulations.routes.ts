import { Router, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { runSimulation } from './simulations.service';
import { mockBranches } from '../../data/mockData';

const router = Router();
router.use(authMiddleware);

router.get('/branches', (_req, res: Response) => {
  res.json({ success: true, data: mockBranches });
});

router.post('/run', (req, res: Response) => {
  const { scenarioType, parameters } = req.body;
  if (!scenarioType) {
    res.status(400).json({ success: false, error: 'scenarioType obrigatório' });
    return;
  }
  const result = runSimulation({ scenarioType, parameters: parameters || {} });
  res.json({ success: true, data: result });
});

export default router;
