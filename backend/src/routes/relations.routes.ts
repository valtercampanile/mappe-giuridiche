import { Router } from 'express';
import { relationsController } from '../controllers/relations.controller';

const router = Router();

router.get('/tensioni', (req, res, next) => relationsController.getTensioni(req, res, next));

export default router;
