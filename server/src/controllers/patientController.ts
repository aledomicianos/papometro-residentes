import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const patientController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const patients = await prisma.patient.findMany({
        orderBy: { createdAt: 'asc' },
        include: { resident: true },
      });
      res.json(patients);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, age, prontuario, residentId } = req.body as {
        name: string; age: number; prontuario: string; residentId: string;
      };
      const patient = await prisma.patient.create({
        data: { name, age, prontuario, residentId },
        include: { resident: true },
      });
      res.status(201).json(patient);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id   = Number(req.params.id);
      const data = req.body as Partial<{ name: string; age: number; prontuario: string; residentId: string }>;
      const patient = await prisma.patient.update({ where: { id }, data, include: { resident: true } });
      res.json(patient);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await prisma.patient.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
