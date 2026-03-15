import { Prisma } from '@prisma/client';
import { entityRepository } from '../repositories/entity.repository';
import { relationRepository } from '../repositories/relation.repository';
import { AppError } from '../utils/errors';
import type { EntityFilters } from '../types/entity.types';

interface CreateEntityInput {
  id: string;
  type: string;
  label: string;
  short?: string;
  fonte?: string;
  zonaGrigia?: boolean;
  tags?: string[];
  materiaId: string;
  data: unknown;
}

export const entitiesService = {
  async getEntities(filters: EntityFilters) {
    return entityRepository.findMany(filters);
  },

  async getEntityById(id: string) {
    const entity = await entityRepository.findById(id);
    if (!entity) {
      throw new AppError('Entità non trovata', 'ENTITY_NOT_FOUND', 404);
    }
    return entity;
  },

  async getEntityGraph(id: string, depth = 1) {
    const entity = await entityRepository.findById(id);
    if (!entity) {
      throw new AppError('Entità non trovata', 'ENTITY_NOT_FOUND', 404);
    }
    return entityRepository.findNeighbors(id, depth);
  },

  async getTensioni(materiaId?: string) {
    return relationRepository.findTensioni(materiaId);
  },

  async createEntity(input: CreateEntityInput) {
    return entityRepository.create({
      ...input,
      data: input.data as Prisma.InputJsonValue,
    });
  },

  async updateEntity(id: string, input: Record<string, unknown>) {
    const entity = await entityRepository.findById(id);
    if (!entity) {
      throw new AppError('Entità non trovata', 'ENTITY_NOT_FOUND', 404);
    }
    return entityRepository.update(id, input);
  },

  async archiveEntity(id: string) {
    const entity = await entityRepository.findById(id);
    if (!entity) {
      throw new AppError('Entità non trovata', 'ENTITY_NOT_FOUND', 404);
    }
    return entityRepository.archive(id);
  },
};
