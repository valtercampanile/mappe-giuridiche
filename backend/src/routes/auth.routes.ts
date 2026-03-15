import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { RegisterSchema, LoginSchema, RefreshSchema } from '../models/schemas/auth.schema';

const router = Router();

router.post('/register', validate(RegisterSchema), (req, res, next) =>
  authController.register(req, res, next),
);
router.post('/login', validate(LoginSchema), (req, res, next) =>
  authController.login(req, res, next),
);
router.post('/refresh', validate(RefreshSchema), (req, res, next) =>
  authController.refresh(req, res, next),
);
router.post('/logout', validate(RefreshSchema), (req, res, next) =>
  authController.logout(req, res, next),
);
router.get('/me', requireAuth, (req, res) => authController.me(req, res));

export default router;
