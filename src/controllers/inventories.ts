import { Request, Response, NextFunction } from 'express';
import { query, validationResult, matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { CreateOption, Option } from 'src/models/option.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { PagedRequest, Pagination } from 'src/models/pagination.model';

const prisma = MyPrisma.getInstance();

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = matchedData(req) as CreateOption;
  try {
    const data = await prisma.inventory.create({
      data: {
        text,
      },
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

export const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data: CreateOption | null = await prisma.inventory.findUnique({
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

export const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, id } = matchedData(req) as CreateOption;

  try {
    const data: CreateOption | null = await prisma.inventory.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        text,
      },
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

export const getAllInventories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prisma.inventory.findMany();
    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getPagedInventories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const banks = await prisma.inventory.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
    });

    let totalItems = await prisma.inventory.count({
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

export const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.inventory.delete({
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
