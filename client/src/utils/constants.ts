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

export const REQUIRED_TASKS: Record<'R1' | 'R2', string[]> = {
  R1: ['Sutura simples', 'Drenagem de abscesso', 'Biópsia', 'Exodontia complexa'],
  R2: [
    'Redução de fratura de mandíbula',
    'Cirurgia ortognática',
    'Enxerto ósseo',
    'Implante dentário',
  ],
};

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Painel' },
  { key: 'surgeries', label: 'Cirurgias' },
  { key: 'patients', label: 'Pacientes' },
  { key: 'residents', label: 'Residentes' },
  { key: 'tasks', label: 'Tarefas' },
  { key: 'reports', label: 'Relatórios' },
] as const;
