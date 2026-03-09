import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { surgeriesApi } from '../services/api';
import type { Surgery } from '../types';

export const SURGERIES_KEY = ['surgeries'] as const;

export function useSurgeries() {
  return useQuery({ queryKey: SURGERIES_KEY, queryFn: surgeriesApi.list });
}

export function useCreateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: surgeriesApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: SURGERIES_KEY }),
  });
}

export function useUpdateSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Surgery, 'id' | 'resident' | 'createdAt'>> }) =>
      surgeriesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SURGERIES_KEY }),
  });
}

export function useDeleteSurgery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: surgeriesApi.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: SURGERIES_KEY }),
  });
}
