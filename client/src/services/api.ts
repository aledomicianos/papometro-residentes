import axios from 'axios';
import type { Patient, Resident, Surgery } from '../types';

const api = axios.create({
  baseURL:        import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
  timeout:        10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Interceptors ───────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'Erro desconhecido';
    return Promise.reject(new Error(message));
  },
);

// ─── Residents ──────────────────────────────────────────────────────────────

export const residentsApi = {
  list:   () => api.get<Resident[]>('/residents').then((r) => r.data),
  create: (data: Omit<Resident, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Resident>('/residents', data).then((r) => r.data),
  update: (id: string, data: Partial<Omit<Resident, 'id'>>) =>
    api.put<Resident>(`/residents/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/residents/${id}`).then((r) => r.data),
};

// ─── Surgeries ──────────────────────────────────────────────────────────────

export const surgeriesApi = {
  list:   () => api.get<Surgery[]>('/surgeries').then((r) => r.data),
  create: (data: Omit<Surgery, 'id' | 'resident' | 'createdAt'>) =>
    api.post<Surgery>('/surgeries', data).then((r) => r.data),
  remove: (id: string) =>
    api.delete(`/surgeries/${id}`).then((r) => r.data),
};

// ─── Patients ───────────────────────────────────────────────────────────────

export const patientsApi = {
  list:   () => api.get<Patient[]>('/patients').then((r) => r.data),
  create: (data: Omit<Patient, 'id' | 'resident' | 'createdAt' | 'updatedAt'>) =>
    api.post<Patient>('/patients', data).then((r) => r.data),
  update: (id: number, data: Partial<Omit<Patient, 'id'>>) =>
    api.put<Patient>(`/patients/${id}`, data).then((r) => r.data),
  remove: (id: number) =>
    api.delete(`/patients/${id}`).then((r) => r.data),
};

export default api;
