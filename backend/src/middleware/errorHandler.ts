import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Fleet AI Error]', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Erro interno do servidor' : err.message,
  });
}
