import { create } from 'zustand';
import type { User } from '../types/entity.types';
import { loginApi, registerApi, logoutApi, refreshApi } from '../services/auth.api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<string | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginApi(email, password);
      set({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isLoading: false,
      });
    } catch (err) {
      const message = extractError(err);
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const result = await registerApi(email, password, name);
      set({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isLoading: false,
      });
    } catch (err) {
      const message = extractError(err);
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: async () => {
    const { refreshToken } = get();
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // Ignore logout errors
      }
    }
    set({ user: null, accessToken: null, refreshToken: null });
  },

  refreshSession: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return null;

    try {
      const result = await refreshApi(refreshToken);
      set({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      return result.accessToken;
    } catch {
      set({ user: null, accessToken: null, refreshToken: null });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));

function extractError(err: unknown): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as Record<string, unknown>).response === 'object'
  ) {
    const response = (err as { response: { data?: { error?: string } } }).response;
    if (response.data?.error) return response.data.error;
  }
  return 'Errore di connessione al server';
}
