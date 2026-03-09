import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database…');

  await prisma.surgery.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.resident.deleteMany();
  await prisma.requiredTask.deleteMany();

  // Required Tasks
  await Promise.all([
    // R1
    prisma.requiredTask.create({ data: { name: 'Sutura simples',       level: 1 } }),
    prisma.requiredTask.create({ data: { name: 'Drenagem de abscesso', level: 1 } }),
    prisma.requiredTask.create({ data: { name: 'Biópsia',              level: 1 } }),
    prisma.requiredTask.create({ data: { name: 'Exodontia complexa',   level: 1 } }),
    // R2
    prisma.requiredTask.create({ data: { name: 'Redução de fratura de mandíbula', level: 2 } }),
    prisma.requiredTask.create({ data: { name: 'Cirurgia ortognática',            level: 2 } }),
    prisma.requiredTask.create({ data: { name: 'Enxerto ósseo',                  level: 2 } }),
    prisma.requiredTask.create({ data: { name: 'Implante dentário',              level: 2 } }),
  ]);

  // Residents
  const [r1a, r1b, r2a, r2b] = await Promise.all([
    prisma.resident.create({ data: { label: 'R1-1', name: 'Dra. Ana Souza',      year: 1, position: 1 } }),
    prisma.resident.create({ data: { label: 'R1-2', name: 'Dr. Carlos Lima',     year: 1, position: 2 } }),
    prisma.resident.create({ data: { label: 'R2-1', name: 'Dr. João Mendes',     year: 2, position: 1 } }),
    prisma.resident.create({ data: { label: 'R2-2', name: 'Dra. Maria Ferreira', year: 2, position: 2 } }),
  ]);

  // Patients
  await Promise.all([
    prisma.patient.create({ data: { name: 'Paciente A', age: 34, prontuario: 'P-001', residentId: r1a.id } }),
    prisma.patient.create({ data: { name: 'Paciente B', age: 52, prontuario: 'P-002', residentId: r2a.id } }),
    prisma.patient.create({ data: { name: 'Paciente C', age: 28, prontuario: 'P-003', residentId: r1b.id } }),
    prisma.patient.create({ data: { name: 'Paciente D', age: 45, prontuario: 'P-004', residentId: r2b.id } }),
    prisma.patient.create({ data: { name: 'Paciente E', age: 39, prontuario: 'P-005', residentId: r2a.id } }),
    prisma.patient.create({ data: { name: 'Paciente F', age: 61, prontuario: 'P-006', residentId: r1a.id } }),
  ]);

  // Surgeries
  await Promise.all([
    prisma.surgery.create({ data: { type: 'Sutura simples',                   patient: 'Paciente A', date: new Date('2025-03-01'), residentId: r1a.id } }),
    prisma.surgery.create({ data: { type: 'Redução de fratura de mandíbula', patient: 'Paciente B', date: new Date('2025-03-03'), residentId: r2a.id } }),
    prisma.surgery.create({ data: { type: 'Biópsia',                          patient: 'Paciente C', date: new Date('2025-03-05'), residentId: r1b.id } }),
    prisma.surgery.create({ data: { type: 'Redução de fratura de mandíbula', patient: 'Paciente D', date: new Date('2025-03-07'), residentId: r2b.id } }),
    prisma.surgery.create({ data: { type: 'Cirurgia ortognática',             patient: 'Paciente E', date: new Date('2025-03-10'), residentId: r2a.id } }),
    prisma.surgery.create({ data: { type: 'Drenagem de abscesso',             patient: 'Paciente F', date: new Date('2025-03-12'), residentId: r1a.id } }),
  ]);

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
