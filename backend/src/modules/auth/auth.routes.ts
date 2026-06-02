import { Router, Request, Response } from 'express';
import { login, getProfile } from './auth.service';
import { authMiddleware, AuthRequest } from '../../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
      return;
    }
    const result = await login(email, password);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(401).json({ success: false, error: (e as Error).message });
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getProfile(req.user!.userId);
    res.json({ success: true, data: profile });
  } catch (e) {
    res.status(404).json({ success: false, error: (e as Error).message });
  }
});

export default router;
