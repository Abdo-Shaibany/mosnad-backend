import { Request, Response, NextFunction } from 'express';
import { query, validationResult, matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { CreateOption, Option } from 'src/models/option.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import {
  FetchAllResponse,
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';

const prisma = MyPrisma.getInstance();

export const createBankLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = matchedData(req) as CreateOption;
  try {
    const bank = await prisma.bank_location.create({
      data: {
        text,
      },
    });
    res.status(200).json(bank);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateBankLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, id } = matchedData(req) as CreateOption;

  try {
    const updateBank = await prisma.bank_location.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        text,
      },
    });
    res.status(200).json(updateBank);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getBankLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data: CreateOption | null = await prisma.bank_location.findUnique({
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

export const getAllBanksLocations = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json((await prisma.bank_location.findMany()) as FetchAllResponse[]);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getPagedBanksLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const items: Option[] | null = await prisma.bank_location.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
    });

    let totalItems = await prisma.bank_location.count({
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
    } as Pagination<Option>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const deleteBankLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.bank_location.delete({
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
