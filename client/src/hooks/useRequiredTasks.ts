import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requiredTasksApi } from '../services/api';
import type { RequiredTask } from '../types';

export const REQUIRED_TASKS_KEY = ['required-tasks'] as const;

export function useRequiredTasks() {
  return useQuery({ queryKey: REQUIRED_TASKS_KEY, queryFn: requiredTasksApi.list });
}

export function useCreateRequiredTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requiredTasksApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: REQUIRED_TASKS_KEY }),
  });
}

export function useUpdateRequiredTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<RequiredTask, 'id'>> }) =>
      requiredTasksApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: REQUIRED_TASKS_KEY }),
  });
}

export function useDeleteRequiredTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requiredTasksApi.remove,
    onSuccess:  () => qc.invalidateQueries({ queryKey: REQUIRED_TASKS_KEY }),
  });
}
