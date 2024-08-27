import { Request, Response, NextFunction } from 'express';
import { matchedData, validationResult } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import {
  CreateSupplier,
  SupplierGetOne,
  SupplierGetPaged,
} from 'src/models/suppliers.model';
import {
  FetchAllResponse,
  PagedRequest,
  Pagination,
} from 'src/models/pagination.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
const prisma = MyPrisma.getInstance();

export const getPagedSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const suppliers = await prisma.supplier.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(
          ['name', 'company', 'company_address'],
          search ?? ''
        ),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      select: {
        id: true,
        name: true,
        company: true,
        company_address: true,
      },
    });

    let totalItems = await prisma.supplier.count({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(
          ['name', 'company', 'company_address'],
          search ?? ''
        ),
      },
    });

    res.status(200).json({
      items: suppliers,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<SupplierGetPaged>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getAllSuppliers = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json(
      suppliers.map((el) => {
        return { id: el.id, text: el.name };
      }) as FetchAllResponse[]
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data: SupplierGetOne | null = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: {
        Account: true,
      },
    });
    if (data) res.status(200).json(data);
    else res.status(404);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, company, company_address, phone, account } = matchedData(
    req
  ) as CreateSupplier;
  try {
    const supplier = await prisma.$transaction(async (prisma) => {


      const supplier = await prisma.supplier.create({
        data: { name, company, company_address },
      });

      delete account.id;

      await prisma.account.create({
        data: {
          ...account,
          supplierId: supplier.id,
        },
      });

      return supplier;
    });

    const data: SupplierGetOne | null = await prisma.supplier.findUnique({
      where: { id: supplier.id },
      include: {
        Account: true,
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

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name, company, company_address, phone, account } = matchedData(
    req
  ) as CreateSupplier;

  try {
    await prisma.$transaction(async (prisma) => {

      const supplier = await prisma.supplier.update({
        where: { id: parseInt(id!.toString()) },
        data: { name, company, company_address },
      });

      const account_id = parseInt(account.id!.toString());
      delete account.id;

      await prisma.account.update({
        where: {
          id: account_id,
        },
        data: account,
      });
    });

    const data: SupplierGetOne | null = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: {
        Account: true,
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

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.$transaction(async (prisma) => {
      const supplier = await prisma.supplier.update({
        where: {
          id: parseInt(req.params['id']),
        },
        data: {
          deletedAt: new Date(),
        },
      });

      const supplier_account = await prisma.account.updateMany({
        where: {
          supplierId: supplier.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
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
