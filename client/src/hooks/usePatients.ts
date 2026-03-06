import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '../services/api';
import type { Patient } from '../types';

export const PATIENTS_KEY = ['patients'] as const;

export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_KEY,
    queryFn:  patientsApi.list,
  });
}

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Patient, 'id'>> }) =>
      patientsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}

export function useDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patientsApi.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: PATIENTS_KEY }),
  });
}
