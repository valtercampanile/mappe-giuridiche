import axios from 'axios';
import type { ApiResponse } from '../types/api.types';
import type { AuthTokens, User } from '../types/entity.types';

const BASE = '/api/v1/auth';

export async function loginApi(email: string, password: string): Promise<AuthTokens> {
  const res = await axios.post<ApiResponse<AuthTokens>>(`${BASE}/login`, { email, password });
  return res.data.data;
}

export async function registerApi(
  email: string,
  password: string,
  name: string,
): Promise<AuthTokens> {
  const res = await axios.post<ApiResponse<AuthTokens>>(`${BASE}/register`, {
    email,
    password,
    name,
  });
  return res.data.data;
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await axios.post(`${BASE}/logout`, { refreshToken });
}

export async function refreshApi(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    `${BASE}/refresh`,
    { refreshToken },
  );
  return res.data.data;
}

export async function getMeApi(accessToken: string): Promise<User> {
  const res = await axios.get<ApiResponse<{ user: User }>>(`${BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data.data.user;
}
