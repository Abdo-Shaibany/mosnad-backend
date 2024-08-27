import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import { ActivityLog } from 'src/models/activity.model';

const prisma = MyPrisma.getInstance();

export const getPagedActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { pagination } = matchedData(
        req
    ) as PagedRequest;

    try {
        const activities: ActivityLog[] = await prisma.activityLog.findMany({
            skip: pagination.pageSize * pagination.currentPage,
            take: pagination.pageSize,
            include: {
                user: true
            }
        });


        let totalItems = await prisma.role.count();

        res.status(200).json({
            items: activities,
            pagination: {
                totalItems,
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
            },
        } as Pagination<ActivityLog>);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};