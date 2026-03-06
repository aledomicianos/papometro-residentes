import type { Resident, Surgery } from '../types';

/**
 * Returns the next resident to perform a given surgery type,
 * based on round-robin rotation within the same residency year.
 */
export function getNextResident(
  surgeryType: string,
  surgeries: Surgery[],
  residents: Resident[],
): Resident | null {
  if (!residents.length) return null;

  const relevant = surgeries.filter((s) => s.type === surgeryType);

  if (!relevant.length) return residents[0];

  const last = relevant[relevant.length - 1];
  const lastResident = residents.find((r) => r.id === last.residentId);

  if (!lastResident) return residents[0];

  const sameYear = residents.filter((r) => r.year === lastResident.year);
  const lastIdx  = sameYear.findIndex((r) => r.id === lastResident.id);

  return sameYear[(lastIdx + 1) % sameYear.length];
}

/**
 * Returns the last resident who performed a given surgery type.
 */
export function getLastResident(
  surgeryType: string,
  surgeries: Surgery[],
  residents: Resident[],
): Resident | null {
  const relevant = surgeries.filter((s) => s.type === surgeryType);
  if (!relevant.length) return null;

  const last = relevant[relevant.length - 1];
  return residents.find((r) => r.id === last.residentId) ?? null;
}

/**
 * Returns task completion status for a given resident.
 */
export function getTaskStatus(
  residentId: string,
  residents: Resident[],
  surgeries: Surgery[],
  requiredTasks: Record<'R1' | 'R2', string[]>,
): Array<{ task: string; done: boolean }> {
  const resident = residents.find((r) => r.id === residentId);
  if (!resident) return [];

  const level    = resident.year === 1 ? 'R1' : 'R2';
  const required = requiredTasks[level] ?? [];
  const performed = new Set(
    surgeries.filter((s) => s.residentId === residentId).map((s) => s.type),
  );

  return required.map((task) => ({ task, done: performed.has(task) }));
}
