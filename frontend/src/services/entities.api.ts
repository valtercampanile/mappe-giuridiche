import api from './api';
import type { Entity, Relation, EntityFilters } from '../types/entity.types';
import type { ApiResponse, PaginatedResponse } from '../types/api.types';

export async function getEntities(filters?: EntityFilters): Promise<PaginatedResponse<Entity>> {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.materiaId) params.set('materiaId', filters.materiaId);
  if (filters?.lezioneId) params.set('lezioneId', filters.lezioneId);
  if (filters?.zonaGrigia !== undefined) params.set('zonaGrigia', String(filters.zonaGrigia));
  if (filters?.q) params.set('q', filters.q);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));

  const res = await api.get<PaginatedResponse<Entity>>(`/entities?${params.toString()}`);
  return res.data;
}

export async function getEntityById(id: string): Promise<Entity> {
  const res = await api.get<ApiResponse<Entity>>(`/entities/${id}`);
  return res.data.data;
}

export async function getEntityGraph(
  id: string,
  depth = 1,
): Promise<{ nodes: Entity[]; edges: Relation[] }> {
  const res = await api.get<ApiResponse<{ nodes: Entity[]; edges: Relation[] }>>(
    `/entities/${id}/graph?depth=${String(depth)}`,
  );
  return res.data.data;
}

export async function getTensioni(materiaId?: string): Promise<Relation[]> {
  const params = materiaId ? `?materiaId=${materiaId}` : '';
  const res = await api.get<ApiResponse<Relation[]>>(`/relations/tensioni${params}`);
  return res.data.data;
}
