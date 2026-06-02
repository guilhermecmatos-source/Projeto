import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Token não fornecido' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
  }
}
