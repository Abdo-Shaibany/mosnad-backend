import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { filterFieldsCreator, orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import {
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';
import { Prisma, Transactions } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';

const prisma = MyPrisma.getInstance();

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fromId, toId, description, amount, bank_currencyId } = matchedData(req) as Transactions;

  try {
    const bank = await prisma.transactions.create({
      data: {
        fromId,
        toId,
        description,
        amount,
        bank_currencyId
      },
      include: {
        from: true,
        to: true,
        currency: true,
      }
    });

    await updateBalance(amount, fromId, -1);
    await updateBalance(amount, toId, 1);

    res.status(200).json(bank as Transactions);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

// export const getAllBanks = async (
//   _: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     res.status(200).json((await prisma.bank.findMany()) as FetchAllResponse[]);
//   } catch (err) {
//     if (err instanceof Prisma.PrismaClientKnownRequestError) {
//       return next(handleError(err));
//     }
//     const e: any = Error('Server error should log here :)');
//     next(e);
//   }
// };

export const getPagedTransactionsByAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const data: Transactions[] | null = await prisma.transactions.findMany({
      where: {
        AND: searchFieldsCreator(['description'], search ?? ''),
        OR:
          filterFieldsCreator(filters ?? [], ["fromId", "toId"]),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      include: {
        to: true,
        from: true,
        currency: true
      }
    });

    let totalItems = await prisma.transactions.count({
      where: {
        AND: searchFieldsCreator(['description'], search ?? ''),
        OR:
          filterFieldsCreator(filters ?? [], ["fromId", "toId"]),
      },
    });

    res.status(200).json({
      items: data,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<Transactions>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

// export const getBankById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;
//   try {
//     const data = await prisma.bank.findUnique({
//       where: { id: Number(id) },
//     });
//     res.status(200).json(data as CreateOption);
//   } catch (err) {
//     if (err instanceof Prisma.PrismaClientKnownRequestError) {
//       return next(handleError(err));
//     }
//     const e: any = Error('Server error should log here :)');
//     next(e);
//   }
// };

const updateBalance = async (amount: number, accountId: number, multiplyaer: 1 | -1) => {
  const fromAccount = await prisma.account.findUnique({
    where: {
      id: accountId
    }
  });

  const newBalance = fromAccount?.balance ?? 0 + amount * multiplyaer;

  await prisma.account.update({
    where: {
      id: accountId
    },
    data: {
      balance: newBalance
    }
  });
}