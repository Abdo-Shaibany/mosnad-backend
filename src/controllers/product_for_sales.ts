import { Request, Response, NextFunction } from "express";
import {
  matchedData,
} from "express-validator";
import { MyPrisma } from "./prisma";
import {
  filterFieldsCreator,
  orderByCreator,
  searchFieldsCreator,
} from "src/services/util.service";
import { PagedRequest, Pagination } from "src/models/pagination.model";
import { ProductForSaleGetOne, ProductForSalePut } from "src/models/product_for_sale.model";
import { Prisma } from "@prisma/client";
import { handleError } from "src/services/prisma_errors.service";
const prisma = MyPrisma.getInstance();

export const getProductsForSales = async (req: Request, res: Response, next: NextFunction) => {
  const { search, filters, pagination, sorts } = matchedData(req) as PagedRequest;

  try {
    const data: ProductForSaleGetOne[] = await prisma.productForSale.findMany({
      where: {
        OR: searchFieldsCreator([""], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], []),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      include: {
        product: {
          include: {
            image: true,
            category: true
          }
        },
        images: true,
        VariantForSale: true,
      },
    });

    let totalItems = await prisma.productForSale.count({
      where: {
        OR: searchFieldsCreator([""], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], []),
      },
    });

    res.status(200).json({
      items: data,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<ProductForSaleGetOne>);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getProductForSaleById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const data: ProductForSaleGetOne | null = await prisma.productForSale.findUnique({
      where: { id: Number(id) },
      include: {
        product: {
          include: {
            image: true,
            category: true,
          }
        },
        images: true,
        VariantForSale: {
          include: {
            image: true
          }
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

export const updateProductForSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, status, title, description, images, variants } =
    matchedData(req) as ProductForSalePut;

  try {
    const data: ProductForSaleGetOne = await prisma.$transaction(async (prisma) => {
      const data: ProductForSaleGetOne = await prisma.productForSale.update({
        where: {
          id: parseInt(id.toString())
        },
        data: {
          status,
          description,
          images: {
            connect: images?.map((id: number) => ({ id })) ?? [],
          },
          VariantForSale: {
            update: variants?.map((variant: any) => ({
              where: {
                id: parseInt(variant.id)
              },
              data: {
                cost: parseFloat(variant.cost),
                price: parseFloat(variant.price),
                cost_currencyId: parseInt(variant.costCurrency),
                price_currencyId: parseInt(variant.priceCurrency),
                status: variant.status
              }
            }))
          }
        },
        include: {
          images: true,
          product: {
            include: {
              image: true,
            }
          },
          VariantForSale: true
        }
      });

      if (title) {
        await prisma.product.update({
          where: {
            id: parseInt(data.product.id.toString())
          },
          data: {
            name: title
          }
        })
      }

      return data
    });

    res.status(200).json(
      data,
    );
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};


