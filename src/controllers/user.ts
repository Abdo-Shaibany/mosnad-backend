import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import bcrypt from "bcrypt";
import { User } from 'src/models/auth.model';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import { searchFieldsCreator } from 'src/services/util.service';

const prisma = MyPrisma.getInstance();

export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, email, password, username, roleId } = matchedData(req) as User;
    try {
        const user: User | null = await prisma.user.update({
            where: {
                id
            },
            data: {
                email,
                password: bcrypt.hashSync(password, 10),
                username,
                roleId
            },
            include: {
                role: true
            }
        });

        let result: any = { ...user };

        delete result.password;
        res.status(200).json()
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};


export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params['id'])
    try {
        await prisma.user.delete({
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

export const getPagedUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { search, pagination } = matchedData(
        req
    ) as PagedRequest;

    try {
        const users: User[] = await prisma.user.findMany({
            where: {
                OR: searchFieldsCreator(['username', 'email'], search ?? ''),
            },
            skip: pagination.pageSize * pagination.currentPage,
            take: pagination.pageSize,
            include: {
                role: true
            }
        });


        let totalItems = await prisma.user.count({
            where: {
                OR: searchFieldsCreator(['username', 'email'], search ?? ''),
            },
        });

        res.status(200).json({
            items: users,
            pagination: {
                totalItems,
                currentPage: pagination.currentPage,
                pageSize: pagination.pageSize,
            },
        } as Pagination<User>);
    } catch (err) {
        console.log(err)
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            return next(handleError(err));
        }
        const e: any = Error('Server error should log here :)');
        next(e);
    }
};