import { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.middleware';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user || authReq.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: 'Accesso riservato agli amministratori',
      code: 'FORBIDDEN',
    });
    return;
  }

  next();
}
