import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { CurrencyModel } from 'src/models/currency.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import {
  FetchAllResponse,
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';

const prisma = MyPrisma.getInstance();

export const createBankCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, short } = matchedData(req) as CurrencyModel;
  try {
    const data = await prisma.bank_currency.create({
      data: {
        text,
        short,
      },
      select: {
        id: true,
        text: true,
        short: true,
      },
    });
    res.status(200).json(data as CurrencyModel);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateBankCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, id, short } = matchedData(req) as CurrencyModel;

  try {
    const updateItem = await prisma.bank_currency.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        text,
        short,
      },
      select: {
        id: true,
        text: true,
        short: true,
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

export const getBankCurrencyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data = await prisma.bank_currency.findUnique({
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

export const getAllCurrencies = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json((await prisma.bank_currency.findMany()) as FetchAllResponse[]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getBankCurrencies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const items: CurrencyModel[] = await prisma.bank_currency.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      select: {
        id: true,
        text: true,
        short: true,
      },
    });

    const totalItems = await prisma.bank_currency.count({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
    });

    res.status(200).json({
      items,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<CurrencyModel>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const deleteBankCurrency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.bank_currency.delete({
      where: {
        id: parseInt(req.params['id']),
      },
    });
    res.status(200).json();
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};
