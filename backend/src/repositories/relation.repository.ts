import { Prisma } from '@prisma/client';
import prisma from '../config/database';

interface CreateRelationInput {
  type: string;
  fromId: string;
  toId: string;
  label: string;
  data?: Prisma.InputJsonValue;
}

export const relationRepository = {
  async findTensioni(materiaId?: string) {
    const where: Prisma.RelationWhereInput = { type: 'TENSIONE' };

    if (materiaId) {
      where.from = { materiaId };
    }

    return prisma.relation.findMany({
      where,
      include: { from: true, to: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  async findByEntities(fromId: string, toId: string) {
    return prisma.relation.findMany({
      where: { fromId, toId },
    });
  },

  async create(input: CreateRelationInput) {
    return prisma.relation.create({
      data: {
        type: input.type as Prisma.RelationCreateInput['type'],
        fromId: input.fromId,
        toId: input.toId,
        label: input.label,
        data: input.data ?? Prisma.DbNull,
      },
    });
  },
};
