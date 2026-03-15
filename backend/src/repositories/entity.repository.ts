import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import type { EntityFilters } from '../types/entity.types';

const DEFAULT_LIMIT = 20;

interface CreateEntityInput {
  id: string;
  type: string;
  label: string;
  short?: string;
  fonte?: string;
  zonaGrigia?: boolean;
  tags?: string[];
  materiaId: string;
  data: Prisma.InputJsonValue;
}

interface UpdateEntityInput {
  label?: string;
  short?: string;
  zonaGrigia?: boolean;
  tags?: string[];
  data?: Prisma.InputJsonValue;
}

function buildWhere(filters: EntityFilters): Prisma.EntityWhereInput {
  const where: Prisma.EntityWhereInput = { archived: false };

  if (filters.type) where.type = filters.type as Prisma.EntityWhereInput['type'];
  if (filters.materiaId) where.materiaId = filters.materiaId;
  if (filters.zonaGrigia !== undefined) where.zonaGrigia = filters.zonaGrigia;
  if (filters.q) where.label = { contains: filters.q, mode: 'insensitive' };
  if (filters.lezioneId) {
    where.lezioni = { some: { lezioneId: filters.lezioneId } };
  }

  return where;
}

export const entityRepository = {
  async findMany(filters: EntityFilters) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? DEFAULT_LIMIT;
    const skip = (page - 1) * limit;
    const where = buildWhere(filters);

    const [data, total] = await Promise.all([
      prisma.entity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      prisma.entity.count({ where }),
    ]);

    return { data, total, page, limit };
  },

  async findById(id: string) {
    return prisma.entity.findUnique({
      where: { id },
      include: {
        lezioni: { include: { lezione: true } },
      },
    });
  },

  async findNeighbors(id: string, depth = 1) {
    const nodeIds = new Set<string>([id]);
    const allEdges: Awaited<ReturnType<typeof prisma.relation.findMany>> = [];

    let frontier = [id];
    for (let d = 0; d < depth; d++) {
      const edges = await prisma.relation.findMany({
        where: {
          OR: [{ fromId: { in: frontier } }, { toId: { in: frontier } }],
        },
      });
      const nextFrontier: string[] = [];
      for (const edge of edges) {
        if (!nodeIds.has(edge.fromId)) {
          nodeIds.add(edge.fromId);
          nextFrontier.push(edge.fromId);
        }
        if (!nodeIds.has(edge.toId)) {
          nodeIds.add(edge.toId);
          nextFrontier.push(edge.toId);
        }
        allEdges.push(edge);
      }
      frontier = nextFrontier;
      if (frontier.length === 0) break;
    }

    const nodes = await prisma.entity.findMany({
      where: { id: { in: Array.from(nodeIds) } },
    });

    // Deduplicate edges by id
    const edgeMap = new Map(allEdges.map((e) => [e.id, e]));

    return { nodes, edges: Array.from(edgeMap.values()) };
  },

  async create(input: CreateEntityInput) {
    return prisma.entity.create({
      data: {
        id: input.id,
        type: input.type as Prisma.EntityCreateInput['type'],
        label: input.label,
        short: input.short,
        fonte: (input.fonte as Prisma.EntityCreateInput['fonte']) ?? 'DOCENTE',
        zonaGrigia: input.zonaGrigia ?? false,
        tags: input.tags ?? [],
        materiaId: input.materiaId,
        data: input.data,
      },
    });
  },

  async update(id: string, input: UpdateEntityInput) {
    return prisma.entity.update({
      where: { id },
      data: input,
    });
  },

  async archive(id: string) {
    return prisma.entity.update({
      where: { id },
      data: { archived: true },
    });
  },
};
