import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { Role, RoleCreate } from 'src/models/role.model';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import { searchFieldsCreator } from 'src/services/util.service';

const prisma = MyPrisma.getInstance();

export const getPagedRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { search, pagination } = matchedData(
        req
    ) as PagedRequest;

    try {
        const roles: Role[] = await prisma.role.findMany({
            where: {
                OR: searchFieldsCreator(['name'], search ?? ''),
            },
            skip: pagination.pageSize * pagination.currentPage,
            take: pagination.pageSize,
            include: {
                premissions: true
            }
        });


        let totalItems = await prisma.role.count({
            where: {
                OR: searchFieldsCreator(['name'], search ?? ''),
            },
        });

        res.status(200).json({
            items: roles,
            pagination: {
                totalItems,
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
            },
        } as Pagination<Role>);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};

export const getRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params['id'])
    try {
        res.status(200).json(await prisma.role.findUnique({
            where: {
                id
            }
        }))
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};

export const createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, premissions } = matchedData(req) as RoleCreate;
    try {
        const role: Role | null = await prisma.role.create({
            data: {
                name,
                premissions: {
                    connect: premissions
                }
            },
            include: {
                premissions: true
            }
        });

        res.status(200).json(role);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};

export const updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, name, premissions } = matchedData(req) as RoleCreate;
    try {

        const role: Role | null = await prisma.role.update({
            where: {
                id
            },
            data: {
                name,
                premissions: {
                    set: premissions
                }
            },
            include: {
                premissions: true
            }
        });
        res.status(200).json(role)
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};

export const deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params['id'])
    try {
        await prisma.role.delete({
            where: {
                id
            }
        })
        res.status(200).json()
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};