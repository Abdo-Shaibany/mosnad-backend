import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import {
  FetchAllResponse,
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';
import { CreateOption, Option } from 'src/models/option.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';

const prisma = MyPrisma.getInstance();

export const createBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = matchedData(req) as CreateOption;
  try {
    const bank = await prisma.bank.create({
      data: {
        text,
      },
    });
    res.status(200).json(bank as CreateOption);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, id } = matchedData(req) as CreateOption;

  try {
    const updateBank = await prisma.bank.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        text,
      },
    });
    res.status(200).json(updateBank as CreateOption);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getAllBanks = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json((await prisma.bank.findMany()) as FetchAllResponse[]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getPagedBanks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const banks: Option[] | null = await prisma.bank.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
    });

    let totalItems = await prisma.bank.count({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
    });

    res.status(200).json({
      items: banks,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<Option>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getBankById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data = await prisma.bank.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(data as CreateOption);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const deleteBank = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.bank.delete({
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
