import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';
import { authConfig } from '../config/auth';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

function parseExpiry(expr: string): Date {
  const match = expr.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error(`Invalid expiry format: ${expr}`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const ms = { m: 60_000, h: 3_600_000, d: 86_400_000 }[unit]!;
  return new Date(Date.now() + value * ms);
}

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  subscriptionTier: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    subscriptionTier: user.subscriptionTier,
  };
}

export const authService = {
  async register(email: string, password: string, name: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AuthError('Email già registrata', 'EMAIL_EXISTS', 409);
    }

    const passwordHash = await bcrypt.hash(password, authConfig.bcryptRounds);
    const user = await userRepository.create({ email, passwordHash, name });

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = signRefreshToken(user.id);
    const expiresAt = parseExpiry(authConfig.jwtRefreshExpiresIn);
    await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken, user: sanitizeUser(user) };
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthError('Credenziali non valide', 'INVALID_CREDENTIALS', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AuthError('Credenziali non valide', 'INVALID_CREDENTIALS', 401);
    }

    const accessToken = signAccessToken({
      userId: user.id,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    const refreshToken = signRefreshToken(user.id);
    const expiresAt = parseExpiry(authConfig.jwtRefreshExpiresIn);
    await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken, user: sanitizeUser(user) };
  },

  async refresh(refreshToken: string) {
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AuthError('Refresh token non valido', 'INVALID_REFRESH_TOKEN', 401);
    }

    const stored = await userRepository.findRefreshToken(refreshToken);
    if (!stored || stored.expiresAt < new Date()) {
      throw new AuthError('Refresh token non valido', 'INVALID_REFRESH_TOKEN', 401);
    }

    await userRepository.deleteRefreshToken(refreshToken);

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new AuthError('Utente non trovato', 'USER_NOT_FOUND', 401);
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    });
    const newRefreshToken = signRefreshToken(user.id);
    const expiresAt = parseExpiry(authConfig.jwtRefreshExpiresIn);
    await userRepository.saveRefreshToken(user.id, newRefreshToken, expiresAt);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(refreshToken: string) {
    try {
      await userRepository.deleteRefreshToken(refreshToken);
    } catch {
      // Token already deleted or not found — ignore
    }
  },
};
