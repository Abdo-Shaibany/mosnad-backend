import { Request, Response, NextFunction } from 'express';
import { MyPrisma } from 'src/controllers/prisma';

const prisma = MyPrisma.getInstance();

export const activitylog = (action: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      await prisma.activityLog.create({
        data: {
          action,
          userId
        }
      });

      return next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
};