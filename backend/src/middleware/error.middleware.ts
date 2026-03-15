import { Request, Response, NextFunction } from 'express';
import { AuthError } from '../services/auth.service';
import logger from '../utils/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AuthError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });

  res.status(500).json({
    success: false,
    error: 'Errore interno del server',
    code: 'INTERNAL_ERROR',
  });
}
