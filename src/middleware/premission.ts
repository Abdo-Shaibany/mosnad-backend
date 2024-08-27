import { Request, Response, NextFunction } from 'express';
import { MyPrisma } from 'src/controllers/prisma';

const prisma = MyPrisma.getInstance();

export const authorizePremissions = (permissions: string[]) => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    role: {
                        include: {
                            premissions: true,
                        },
                    },
                },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userPermissions = user.role?.premissions.map(permission => permission.name) || [];
            const hasPermission = permissions.some(permission => userPermissions.includes(permission));

            if (!hasPermission) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }

            return next();
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};