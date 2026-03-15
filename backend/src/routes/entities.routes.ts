import { Router } from 'express';
import { entitiesController } from '../controllers/entities.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { CreateEntitySchema, UpdateEntitySchema } from '../models/schemas/entity.schema';

const router = Router();

router.get('/', (req, res, next) => entitiesController.list(req, res, next));
router.get('/:id', (req, res, next) => entitiesController.getById(req, res, next));
router.get('/:id/graph', (req, res, next) => entitiesController.getGraph(req, res, next));

router.post('/', requireAuth, requireAdmin, validate(CreateEntitySchema), (req, res, next) =>
  entitiesController.create(req, res, next),
);

router.put('/:id', requireAuth, requireAdmin, validate(UpdateEntitySchema), (req, res, next) =>
  entitiesController.update(req, res, next),
);

router.delete('/:id', requireAuth, requireAdmin, (req, res, next) =>
  entitiesController.archive(req, res, next),
);

export default router;
