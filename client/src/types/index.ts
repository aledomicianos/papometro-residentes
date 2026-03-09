export interface Resident {
  id:        string;
  label:     string;
  name:      string;
  year:      1 | 2;
  position:  number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Surgery {
  id:         string;
  type:       string;
  patient:    string;
  date:       string;
  notes?:     string | null;
  residentId: string;
  resident?:  Resident;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id:         number;
  name:       string;
  age:        number;
  prontuario: string;
  residentId: string;
  resident?:  Resident;
  createdAt?: string;
  updatedAt?: string;
}

export interface RequiredTask {
  id:        string;
  name:      string;
  level:     1 | 2;  // 1 = R1, 2 = R2
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStatus {
  task:      string;
  taskId:    string;
  done:      boolean;
  surgeries: Surgery[]; // surgeries that completed this task
}

export type ResidentYear = 1 | 2;
export type NavTab =
  | 'dashboard'
  | 'surgeries'
  | 'patients'
  | 'residents'
  | 'tasks'
  | 'reports'
  | 'obligations';

export interface ApiResponse<T> {
  data:     T;
  message?: string;
}
