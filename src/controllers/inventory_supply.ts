import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import { orderByCreator, searchFieldsCreator } from 'src/services/util.service';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import {
  CreateInventorySupply,
  InventorySupplyGetPaged,
  UpdateInventorySupply,
} from 'src/models/inventory_supply.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
const prisma = MyPrisma.getInstance();

export const getInventorySupplies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    const data: InventorySupplyGetPaged[] =
      await prisma.inventorySupply.findMany({
        where: {
          deletedAt: null,
          AND: searchFieldsCreator(['PO'], search ?? ''),
        },
        skip: pagination.pageSize * pagination.currentPage,
        take: pagination.pageSize,
        orderBy: orderByCreator(sorts ?? []),
        include: {
          inventory: true,
          productsSupply: {
            include: {
              product: true,
              Image: true,
            },
          },
        },
      });
    let totalItems = await prisma.inventorySupply.count({
      where: {
        deletedAt: null,
        AND: searchFieldsCreator(['PO'], search ?? ''),
      },
    });

    res.status(200).json({
      items: data,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<InventorySupplyGetPaged>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getInventorySupplyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const data = await prisma.inventorySupply.findUnique({
      where: { id: Number(id) },
      include: {
        inventory: true,
        productsSupply: {
          include: {
            product: true,
            Image: true,
          },
        },
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

export const createInventorySupply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { inventoryId, PO, note, supplierId, refNumber, productsSupply } =
    matchedData(req) as CreateInventorySupply;

  try {
    const data: InventorySupplyGetPaged | null = await prisma.$transaction(
      async (prisma) => {
        const data = await prisma.inventorySupply.create({
          data: {
            inventoryId,
            PO,
            note,
            supplierId: parseInt(supplierId.toString()),
            refNumber,
          },
        });

        for (const product of productsSupply) {
          const {
            productId,
            variantId,
            amount,
            variantSKU,
            variantName,
            imageId,
          } = product;
          await prisma.productSupply.create({
            data: {
              inventorySupplyId: data.id,
              productId,
              variantId,
              amount: parseInt(amount.toString()),
              variantName,
              variantSKU,
              imageId: parseInt(imageId!.toString()),
            },
          });
        }

        return (await prisma.inventorySupply.findUnique({
          where: {
            id: data.id,
          },
          include: {
            inventory: true,
            productsSupply: {
              include: {
                product: true,
                Image: true,
              },
            },
          },
        })) as InventorySupplyGetPaged;
      }
    );

    res.status(200).json(data);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateInventorySupply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, status, productsSupply } = matchedData(
    req
  ) as UpdateInventorySupply;

  try {
    const data: InventorySupplyGetPaged = await prisma.$transaction(
      async (prisma) => {
        const data = await prisma.inventorySupply.findUnique({
          where: {
            id,
          },
        });

        if (status && data?.status === 'pending')
          await prisma.inventorySupply.update({
            where: {
              id,
            },
            data: {
              status,
            },
          });

        if (data?.status === 'pending')
          for (const product of productsSupply ?? []) {
            await prisma.productSupply.update({
              where: {
                id: product.id,
              },
              data: {
                actualAmount: parseInt(product.actualAmount.toString()),
              },
            });
          }

        return (await prisma.inventorySupply.findUnique({
          where: {
            id,
          },
          include: {
            inventory: true,
            productsSupply: {
              include: {
                product: true,
                Image: true,
              },
            },
          },
        })) as InventorySupplyGetPaged;
      }
    );

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const deleteInventorySupply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.inventorySupply.update({
      where: {
        id: parseInt(req.params['id']),
      },
      data: {
        deletedAt: new Date(),
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
