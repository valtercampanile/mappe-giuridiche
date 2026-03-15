import { useQuery } from '@tanstack/react-query';
import { getEntityById, getEntityGraph } from '../services/entities.api';

export function useEntity(id: string | undefined) {
  return useQuery({
    queryKey: ['entity', id],
    queryFn: () => getEntityById(id!),
    enabled: !!id,
  });
}

export function useEntityGraph(id: string | undefined, depth = 1) {
  return useQuery({
    queryKey: ['graph', id, depth],
    queryFn: () => getEntityGraph(id!, depth),
    enabled: !!id,
  });
}
