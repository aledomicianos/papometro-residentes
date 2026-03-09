export const SURGERY_TYPES = [
  'Sutura simples',
  'Drenagem de abscesso',
  'Biópsia',
  'Redução de fratura de mandíbula',
  'Exodontia complexa',
  'Cirurgia ortognática',
  'Enxerto ósseo',
  'Implante dentário',
] as const;

export type SurgeryType = (typeof SURGERY_TYPES)[number];

export const LEVEL_LABELS: Record<1 | 2, string> = {
  1: 'R1 — Primeiro Ano',
  2: 'R2 — Segundo Ano',
};
