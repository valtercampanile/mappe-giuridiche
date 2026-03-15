import { Request, Response, NextFunction } from 'express';
import { entitiesService } from '../services/entities.service';

export const relationsController = {
  async getTensioni(req: Request, res: Response, next: NextFunction) {
    try {
      const materiaId = req.query.materiaId as string | undefined;
      const tensioni = await entitiesService.getTensioni(materiaId);
      res.json({ success: true, data: tensioni });
    } catch (err) {
      next(err);
    }
  },
};
