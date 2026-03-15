import { Request, Response, NextFunction } from 'express';
import { authService, AuthError } from '../services/auth.service';
import type { RegisterInput, LoginInput, RefreshInput } from '../models/schemas/auth.schema';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

function handleAuthError(err: unknown, next: NextFunction) {
  if (err instanceof AuthError) {
    next(err);
    return;
  }
  next(err);
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body as RegisterInput;
      const result = await authService.register(email, password, name);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      handleAuthError(err, next);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginInput;
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err) {
      handleAuthError(err, next);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as RefreshInput;
      const result = await authService.refresh(refreshToken);
      res.json({ success: true, data: result });
    } catch (err) {
      handleAuthError(err, next);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as RefreshInput;
      await authService.logout(refreshToken);
      res.json({ success: true, data: { message: 'Logout effettuato' } });
    } catch (err) {
      handleAuthError(err, next);
    }
  },

  me(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest;
    res.json({ success: true, data: { user: authReq.user } });
  },
};
