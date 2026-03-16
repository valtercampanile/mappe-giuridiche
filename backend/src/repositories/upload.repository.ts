import { Prisma } from '@prisma/client';
import prisma from '../config/database';

interface CreateUploadInput {
  uploadedBy: string;
  filename: string;
  proposedEntities: Prisma.InputJsonValue;
}

export const uploadRepository = {
  async create(input: CreateUploadInput) {
    return prisma.documentUpload.create({
      data: {
        uploadedBy: input.uploadedBy,
        filename: input.filename,
        status: 'REVIEW',
        proposedEntities: input.proposedEntities,
      },
    });
  },

  async findById(id: string) {
    return prisma.documentUpload.findUnique({ where: { id } });
  },

  async findAll() {
    return prisma.documentUpload.findMany({ orderBy: { createdAt: 'desc' } });
  },

  async updateStatus(id: string, status: string, approvedAt?: Date) {
    return prisma.documentUpload.update({
      where: { id },
      data: {
        status: status as Prisma.DocumentUploadUpdateInput['status'],
        approvedAt,
      },
    });
  },
};
