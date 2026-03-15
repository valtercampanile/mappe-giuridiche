import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

export interface JwtPayload {
  userId: string;
  role: string;
  subscriptionTier: string;
}

function parseToSeconds(expr: string): number {
  const match = expr.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error(`Invalid duration: ${expr}`);
  const value = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { m: 60, h: 3600, d: 86400 };
  return value * multipliers[match[2]];
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: parseToSeconds(authConfig.jwtExpiresIn),
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId, jti: crypto.randomUUID() }, authConfig.jwtRefreshSecret, {
    expiresIn: parseToSeconds(authConfig.jwtRefreshExpiresIn),
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, authConfig.jwtRefreshSecret) as { userId: string };
}
