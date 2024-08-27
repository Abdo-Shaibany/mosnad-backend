import { Request, Response, NextFunction } from 'express';
import { MyPrisma } from './prisma';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { AccountModel } from 'src/models/accounts.model';

const prisma = MyPrisma.getInstance();

export const getAccountBySupplierId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params;
    try {
        const data: AccountModel | null = await prisma.account.findFirst({
            where: { supplierId: Number(id) },
            include: {
                bank: true,
                bank_location: true,
                currency: true,
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        company: true,
                        company_address: true,
                    }
                }
            }
        });
        res.status(200).json(data);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};

export const getPlatformAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data: AccountModel | null = await prisma.account.findFirst({
            where: { supplierId: null },
            include: {
                bank: true,
                bank_location: true,
                currency: true,
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        company: true,
                        company_address: true,
                    }
                }
            }
        });
        res.status(200).json(data);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};