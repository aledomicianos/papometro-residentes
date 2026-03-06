import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const residentController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const residents = await prisma.resident.findMany({
        orderBy: [{ year: 'asc' }, { position: 'asc' }],
      });
      res.json(residents);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { label, name, year, position } = req.body as {
        label: string; name: string; year: number; position: number;
      };
      const resident = await prisma.resident.create({
        data: { label, name, year, position },
      });
      res.status(201).json(resident);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data   = req.body as Partial<{ label: string; name: string; year: number; position: number }>;
      const resident = await prisma.resident.update({ where: { id }, data });
      res.json(resident);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.resident.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
