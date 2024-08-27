import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { CreateOption, Option } from 'src/models/option.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import { Category } from 'src/models/category.model';

const prisma = MyPrisma.getInstance();

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text } = matchedData(req) as CreateOption;
  try {
    const data: CreateOption = await prisma.cagetory.create({
      data: {
        text,
      },
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

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { text, id } = matchedData(req) as CreateOption;

  try {
    const data = await prisma.cagetory.update({
      where: {
        id: parseInt(id!.toString()),
      },
      data: {
        text,
      },
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

export const getPagedCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const banks = await prisma.cagetory.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['text'], search ?? ''),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      include: {
        Product: {
          select: {
            id: true,
          },
        },
      },
    });


    let totalItems = await prisma.cagetory.count({
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

export const getAllCategories = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let categories: Category[] = await prisma.cagetory.findMany({
      include: {
        Product: true
      }
    });

    categories = categories.map((el) => {
      let value = {
        ...el,
        productCount: el.Product.length
      };

      delete value.Product;
      return value;
    });

    res.status(200).json(categories);
  } catch (err) {
    console.log(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data: CreateOption | null = await prisma.cagetory.findUnique({
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

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.cagetory.delete({
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
