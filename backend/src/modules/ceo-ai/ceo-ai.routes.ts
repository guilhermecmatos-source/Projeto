import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth';
import { processCeoQuestion } from './ceo-ai.service';

const router = Router();
router.use(authMiddleware);

router.post('/ask', (req: AuthRequest, res: Response) => {
  const { question } = req.body;
  if (!question?.trim()) {
    res.status(400).json({ success: false, error: 'Pergunta obrigatória' });
    return;
  }
  const { answer, sources } = processCeoQuestion(question);
  res.json({
    success: true,
    data: {
      question,
      answer,
      sources,
      timestamp: new Date().toISOString(),
    },
  });
});

router.get('/suggestions', (_req, res: Response) => {
  res.json({
    success: true,
    data: [
      'Onde estou perdendo dinheiro?',
      'Qual setor apresenta maior risco?',
      'Como reduzir custos operacionais?',
      'Qual rota está gerando mais despesas?',
      'Qual região deveria receber uma nova filial?',
      'Qual a previsão de demanda para os próximos 90 dias?',
    ],
  });
});

export default router;
