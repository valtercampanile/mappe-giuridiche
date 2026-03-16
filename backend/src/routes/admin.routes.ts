import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

router.use(requireAuth, requireAdmin);

router.post('/upload', (req, res, next) => adminController.upload(req, res, next));
router.get('/uploads', (req, res, next) => adminController.listUploads(req, res, next));
router.get('/upload/:id', (req, res, next) => adminController.getUpload(req, res, next));
router.post('/upload/:id/approve', (req, res, next) => adminController.approve(req, res, next));
router.delete('/upload/:id', (req, res, next) => adminController.deleteUpload(req, res, next));

export default router;
