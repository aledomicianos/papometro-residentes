import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { residentsApi } from '../services/api';
import type { Resident } from '../types';

export const RESIDENTS_KEY = ['residents'] as const;

export function useResidents() {
  return useQuery({
    queryKey: RESIDENTS_KEY,
    queryFn:  residentsApi.list,
  });
}

export function useCreateResident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: residentsApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: RESIDENTS_KEY }),
  });
}

export function useUpdateResident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Resident, 'id'>> }) =>
      residentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: RESIDENTS_KEY }),
  });
}

export function useDeleteResident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: residentsApi.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: RESIDENTS_KEY }),
  });
}
