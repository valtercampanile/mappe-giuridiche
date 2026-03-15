import { z } from 'zod';

const entityTypeValues = [
  'VALORE',
  'PRINCIPIO',
  'NORMA',
  'ISTITUTO',
  'QUESTIONE',
  'FUNZIONE',
  'LOGICA_INTERPRETATIVA',
  'GIURISPRUDENZA',
  'TENSIONE',
] as const;

export const EntityFiltersSchema = z.object({
  type: z.enum(entityTypeValues).optional(),
  materiaId: z.string().optional(),
  lezioneId: z.string().optional(),
  zonaGrigia: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  q: z.string().optional(),
  page: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive())
    .optional(),
  limit: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive().max(100))
    .optional(),
});

export const CreateEntitySchema = z.object({
  id: z.string().min(1, 'ID obbligatorio'),
  type: z.enum(entityTypeValues),
  label: z.string().min(1, 'Label obbligatoria'),
  short: z.string().max(200).optional(),
  fonte: z.enum(['DOCENTE', 'AI']).optional(),
  zonaGrigia: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  materiaId: z.string().min(1, 'Materia obbligatoria'),
  data: z.record(z.unknown()).default({}),
});

export const UpdateEntitySchema = z.object({
  label: z.string().min(1).optional(),
  short: z.string().max(200).nullable().optional(),
  zonaGrigia: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  data: z.record(z.unknown()).optional(),
});

export type EntityFiltersInput = z.infer<typeof EntityFiltersSchema>;
export type CreateEntityInput = z.infer<typeof CreateEntitySchema>;
export type UpdateEntityInput = z.infer<typeof UpdateEntitySchema>;
