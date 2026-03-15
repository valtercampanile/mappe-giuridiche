import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Token di autenticazione mancante',
      code: 'MISSING_TOKEN',
    });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Token non valido o scaduto',
      code: 'INVALID_TOKEN',
    });
  }
}
