import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const surgeryController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const surgeries = await prisma.surgery.findMany({
        orderBy: { date: 'asc' },
        include: { resident: true },
      });
      res.json(surgeries);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, patient, date, residentId, notes } = req.body as {
        type: string; patient: string; date: string; residentId: string; notes?: string;
      };
      const surgery = await prisma.surgery.create({
        data: { type, patient, date: new Date(date), residentId, notes },
        include: { resident: true },
      });
      res.status(201).json(surgery);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, patient, date, residentId, notes } = req.body as {
        type?: string; patient?: string; date?: string; residentId?: string; notes?: string;
      };
      const surgery = await prisma.surgery.update({
        where: { id },
        data: {
          ...(type       && { type }),
          ...(patient    && { patient }),
          ...(date       && { date: new Date(date) }),
          ...(residentId && { residentId }),
          notes: notes ?? null,
        },
        include: { resident: true },
      });
      res.json(surgery);
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.surgery.delete({ where: { id } });
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
