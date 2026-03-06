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
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, patient, date, residentId } = req.body as {
        type: string; patient: string; date: string; residentId: string;
      };
      const surgery = await prisma.surgery.create({
        data: { type, patient, date: new Date(date), residentId },
        include: { resident: true },
      });
      res.status(201).json(surgery);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.surgery.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
