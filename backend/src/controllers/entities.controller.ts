import { Request, Response, NextFunction } from 'express';
import { entitiesService } from '../services/entities.service';
import { EntityFiltersSchema } from '../models/schemas/entity.schema';
import type { CreateEntityInput, UpdateEntityInput } from '../models/schemas/entity.schema';

function paramId(req: Request): string {
  return req.params.id as string;
}

export const entitiesController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = EntityFiltersSchema.parse(req.query);
      const result = await entitiesService.getEntities(filters);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const entity = await entitiesService.getEntityById(paramId(req));
      res.json({ success: true, data: entity });
    } catch (err) {
      next(err);
    }
  },

  async getGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const depth = req.query.depth ? parseInt(req.query.depth as string, 10) : 1;
      const graph = await entitiesService.getEntityGraph(paramId(req), depth);
      res.json({ success: true, data: graph });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as CreateEntityInput;
      const entity = await entitiesService.createEntity(input);
      res.status(201).json({ success: true, data: entity });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const input = req.body as UpdateEntityInput;
      const updateData: Record<string, unknown> = {};
      if (input.label !== undefined) updateData.label = input.label;
      if (input.short !== undefined) updateData.short = input.short;
      if (input.zonaGrigia !== undefined) updateData.zonaGrigia = input.zonaGrigia;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.data !== undefined) updateData.data = input.data;

      const entity = await entitiesService.updateEntity(paramId(req), updateData);
      res.json({ success: true, data: entity });
    } catch (err) {
      next(err);
    }
  },

  async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const entity = await entitiesService.archiveEntity(paramId(req));
      res.json({ success: true, data: entity });
    } catch (err) {
      next(err);
    }
  },
};
