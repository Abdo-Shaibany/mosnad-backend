import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { filterFieldsCreator, orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { CurrencyModel } from 'src/models/currency.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import {
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';
import { SellerCreate, SellerGetOne, SellerUpdate } from 'src/models/seller.model';
import bcrypt from "bcrypt";

const prisma = MyPrisma.getInstance();

export const createSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, user } = matchedData(req) as SellerCreate;
  try {
    // TODO: create user without password and only a url to add it send it to email
    const sellerRole = await prisma.role.findFirst({
      where: {
        name: "seller",
      }
    });

    if (!sellerRole) {
      const e: any = Error('Server error should log here :)');
      return next(handleError(e));
    }

    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        password: bcrypt.hashSync("password", 10),
        username: user.username,
        roles: {
          connect: [sellerRole]
        }
      }
    });

    const data = await prisma.seller.create({
      data: {
        name,
        address,
        status: true,
        userId: newUser.id,
        phone,
      },
    });
    res.status(200).json(data as SellerGetOne);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name, address, phone } = matchedData(req) as SellerUpdate;

  try {
    const updateItem: SellerGetOne = await prisma.seller.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        name,
        address,
        phone
      },
    });
    res.status(200).json(updateItem);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const toggleSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const findSeller = await prisma.seller.findUnique({
      where: {
        id: parseInt(id.toString())
      }
    });

    const updateItem: SellerGetOne = await prisma.seller.update({
      where: {
        id: parseInt(id.toString()),
      },
      data: {
        status: !findSeller?.status
      },
    });
    res.status(200).json(updateItem);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getSellerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data: SellerGetOne | null = await prisma.seller.findUnique({
      where: { id: Number(id) },
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

export const getPagedSellers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const items: SellerGetOne[] = await prisma.seller.findMany({
      where: {
        OR: searchFieldsCreator(['text'], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], ['status'])
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
    });

    const totalItems = await prisma.seller.count({
      where: {
        OR: searchFieldsCreator(['text'], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], ['status'])
      },
    });

    res.status(200).json({
      items,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<SellerGetOne>);
  } catch (err) {
    console.log(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

// export const deleteBankCurrency = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await prisma.bank_currency.delete({
//       where: {
//         id: parseInt(req.params['id']),
//       },
//     });
//     res.status(200).json();
//   } catch (err) {
//     if (err instanceof Prisma.PrismaClientKnownRequestError) {
//       return next(handleError(err));
//     }
//     const e: any = Error('Server error should log here :)');
//     next(e);
//   }
// };
