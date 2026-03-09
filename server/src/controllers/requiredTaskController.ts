import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const requiredTaskController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await prisma.requiredTask.findMany({
        orderBy: [{ level: 'asc' }, { name: 'asc' }],
      });
      res.json(tasks);
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, level } = req.body as { name: string; level: number };
      const task = await prisma.requiredTask.create({ data: { name, level } });
      res.status(201).json(task);
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, level } = req.body as { name?: string; level?: number };
      const task = await prisma.requiredTask.update({
        where: { id },
        data: {
          ...(name  !== undefined && { name }),
          ...(level !== undefined && { level }),
        },
      });
      res.json(task);
    } catch (err) { next(err); }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.requiredTask.delete({ where: { id } });
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
