import prisma from '../config/database';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  name: string;
}

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async create(data: CreateUserInput) {
    return prisma.user.create({ data });
  },

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  },

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({ where: { token } });
  },

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  },
};
