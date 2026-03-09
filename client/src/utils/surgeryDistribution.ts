import type { RequiredTask, Resident, Surgery, TaskStatus } from '../types';

/** Next resident for round-robin distribution within same year */
export function getNextResident(
  surgeryType: string,
  surgeries:   Surgery[],
  residents:   Resident[],
): Resident | null {
  if (!residents.length) return null;
  const relevant = surgeries.filter((s) => s.type === surgeryType);
  if (!relevant.length) return residents[0];
  const last         = relevant[relevant.length - 1];
  const lastResident = residents.find((r) => r.id === last.residentId);
  if (!lastResident) return residents[0];
  const sameYear = residents.filter((r) => r.year === lastResident.year);
  const lastIdx  = sameYear.findIndex((r) => r.id === lastResident.id);
  return sameYear[(lastIdx + 1) % sameYear.length];
}

/** Last resident who performed a surgery type */
export function getLastResident(
  surgeryType: string,
  surgeries:   Surgery[],
  residents:   Resident[],
): Resident | null {
  const relevant = surgeries.filter((s) => s.type === surgeryType);
  if (!relevant.length) return null;
  const last = relevant[relevant.length - 1];
  return residents.find((r) => r.id === last.residentId) ?? null;
}

/**
 * Returns task completion status for a resident.
 * Uses dynamic required tasks from the database.
 * Each TaskStatus includes the surgeries that satisfied that task.
 */
export function getTaskStatus(
  residentId:    string,
  residents:     Resident[],
  surgeries:     Surgery[],
  requiredTasks: RequiredTask[],
): TaskStatus[] {
  const resident = residents.find((r) => r.id === residentId);
  if (!resident) return [];

  const level    = resident.year; // 1 or 2
  const required = requiredTasks.filter((t) => t.level === level);

  const performed = surgeries.filter((s) => s.residentId === residentId);

  return required.map((rt) => {
    const matchingSurgeries = performed.filter((s) => s.type === rt.name);
    return {
      task:      rt.name,
      taskId:    rt.id,
      done:      matchingSurgeries.length > 0,
      surgeries: matchingSurgeries,
    };
  });
}
