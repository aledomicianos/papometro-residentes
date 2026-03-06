export interface Resident {
  id: string;
  label: string;
  name: string;
  year: 1 | 2;
  position: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Surgery {
  id: string;
  type: string;
  patient: string;
  date: string;
  residentId: string;
  resident?: Resident;
  createdAt?: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  prontuario: string;
  residentId: string;
  resident?: Resident;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStatus {
  task: string;
  done: boolean;
}

export type ResidentYear = 1 | 2;
export type NavTab = 'dashboard' | 'surgeries' | 'patients' | 'residents' | 'tasks' | 'reports';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface DistributionSuggestion {
  nextResident: Resident;
  lastResident: Resident | null;
  surgeryType: string;
}
