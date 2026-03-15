import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri'),
  name: z.string().min(1, 'Il nome è obbligatorio'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'La password è obbligatoria'),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token obbligatorio'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshInput = z.infer<typeof RefreshSchema>;
