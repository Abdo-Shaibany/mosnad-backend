import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
import { MyPrisma } from './prisma';
import {
  filterFieldsCreator,
  orderByCreator,
  searchFieldsCreator,
} from 'src/services/util.service';
import { PagedRequest, Pagination } from 'src/models/pagination.model';
import {
  CreateProduct,
  ProductGetOne,
  ProductGetPaged,
} from 'src/models/product.model';
import { Prisma } from '@prisma/client';
import { handleError } from 'src/services/prisma_errors.service';
const prisma = MyPrisma.getInstance();

export const getPagedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search, filters, pagination, sorts } = matchedData(
    req
  ) as PagedRequest;

  try {
    let data: any = await prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['name', 'brand'], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], ['cagetoryId', 'supplierId']),
      },
      skip: pagination.pageSize * pagination.currentPage,
      take: pagination.pageSize,
      orderBy: orderByCreator(sorts ?? []),
      include: {
        image: {
          select: {
            id: true,
            url: true,
            thumbnail_url: true,
          },
        },
        category: {
          select: {
            id: true,
            text: true,
          },
        },
        Variant: {
          select: {
            id: true,
            value: true,
            SKU: true,
            image: {
              select: {
                id: true,
                url: true,
                thumbnail_url: true,
              },
            },
          },
        },
        VariantBasic: {
          select: {
            id: true,
            type: true,
            value: true,
          },
        },
        ProductSupply: {
          select: {
            actualAmount: true,
          },
        },
        ProductForSale: {
          select: {
            status: true,
          },
        },
      },
    });

    data = data.map((product: any) => {
      const totalSupply = product.ProductSupply.reduce(
        (sum: number, supply: any) => sum + supply.actualAmount,
        0
      );
      return {
        ...product,
        supply: totalSupply,
      } as ProductGetPaged;
    });

    let totalItems = await prisma.product.count({
      where: {
        deletedAt: null,
        OR: searchFieldsCreator(['name', 'brand'], search ?? ''),
        AND: filterFieldsCreator(filters ?? [], ['categoryId']),
      },
    });

    res.status(200).json({
      items: data,
      pagination: {
        totalItems,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
      },
    } as Pagination<ProductGetPaged>);
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const data = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        image: true,
        category: true,
        Variant: {
          include: {
            image: {
              select: {
                id: true,
                url: true,
                thumbnail_url: true,
              },
            },
          },
        },
        VariantBasic: true,
        supplier: true,
        ProductSupply: true,
        ProductForSale: true,
      },
    });

    res.status(200).json(data as ProductGetOne);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    name,
    categoryId,
    length,
    width,
    height,
    brand,
    expiredAt,
    variantsBasic,
    variants,
    supplierId,
    imageId,
  } = matchedData(req) as CreateProduct;

  try {
    const data: ProductGetOne | null = await prisma.$transaction(
      async (prisma) => {
        let sku = '';
        let value = undefined;
        do {
          sku = generateRandomSKU();
          value = await prisma.product.findFirst({ where: { SKU: sku } });
        } while (value != undefined);

        const data = await prisma.product.create({
          data: {
            name,
            categoryId,
            length: parseInt(length.toString()),
            width: parseInt(width.toString()),
            height: parseInt(height.toString()),
            brand,
            expiredAt,
            supplierId: parseInt(supplierId.toString()),
            imageId: parseInt(imageId.toString()),
            SKU: sku,
          },
          include: {
            Variant: true,
          },
        });

        const productForSale = await prisma.productForSale.create({
          data: {
            productId: data.id,
            supplierId: data.supplierId,
          },
        });

        // create default variant if not exist
        if (!variants || variants.length === 0) {
          variants = [
            {
              imageId: parseInt(imageId.toString()),
              value: name,
            },
          ];
        }

        for (const variant of variants) {
          const { imageId, value } = variant;

          let sku = '';
          let _value = undefined;
          do {
            sku = generateRandomSKU();
            _value = await prisma.product.findFirst({ where: { SKU: sku } });
          } while (_value != undefined);

          await prisma.variant.create({
            data: {
              imageId: parseInt(imageId!.toString()),
              value,
              productId: data.id,
              SKU: sku,
            },
          });

          await prisma.variantForSale.create({
            data: {
              productForSaleId: productForSale.id,
              value: variant.value,
              SKU: sku,
              imageId: parseInt(variant.imageId!.toString()),
            },
          });
        }

        for (let basic of variantsBasic ?? []) {
          const res = await prisma.variantBasic.create({
            data: {
              type: basic.type,
              value: basic.value,
              productId: data.id,
            },
          });
        }

        return await prisma.product.findUnique({
          where: {
            id: data.id,
          },
          include: {
            image: {
              select: {
                id: true,
                url: true,
                thumbnail_url: true,
              },
            },
            category: true,
            Variant: {
              include: {
                image: {
                  select: {
                    id: true,
                    url: true,
                    thumbnail_url: true,
                  },
                },
              },
            },
            VariantBasic: true,
            supplier: true,
            ProductSupply: true,
            ProductForSale: true,
          },
        });
      }
    );

    return res.status(200).json(data);
  } catch (err) {
    console.log(err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let {
    name,
    categoryId,
    length,
    width,
    height,
    brand,
    expiredAt,
    variantsBasic,
    variants,
    imageId,
    id,
  } = matchedData(req) as CreateProduct;

  try {
    const data: ProductGetOne | null = await prisma.$transaction(
      async (prisma) => {
        const data = await prisma.product.update({
          where: {
            id: parseInt(id.toString()),
          },
          data: {
            name,
            categoryId,
            length: parseInt(length.toString()),
            width: parseInt(width.toString()),
            height: parseInt(height.toString()),
            brand,
            expiredAt,
            imageId: parseInt(imageId.toString()),
          },
        });

        if (!variants || variants.length === 0) {
          variants = [
            {
              imageId: parseInt(imageId.toString()),
              value: name,
            },
          ];
        }

        await prisma.variant.deleteMany({
          where: {
            productId: parseInt(id.toString()),
          },
        });

        for (const variant of variants) {
          const { value, imageId: imgId } = variant;

          let sku = '';
          let _value = undefined;
          do {
            sku = generateRandomSKU();
            _value = await prisma.product.findFirst({ where: { SKU: sku } });
          } while (_value != undefined);

          await prisma.variant.create({
            data: {
              value,
              imageId: imgId ? parseInt(imgId.toString()) : undefined,
              productId: parseInt(data.id.toString()),
              SKU: sku,
            },
          });
        }

        await prisma.variantBasic.deleteMany({
          where: {
            productId: parseInt(id.toString()),
          },
        });

        for (let basic of variantsBasic ?? []) {
          await prisma.variantBasic.create({
            data: {
              type: basic.type,
              value: basic.value,
              productId: data.id,
            },
          });
        }

        return await prisma.product.findUnique({
          where: {
            id: data.id,
          },
          include: {
            image: {
              select: {
                id: true,
                url: true,
                thumbnail_url: true,
              },
            },
            category: true,
            Variant: {
              include: {
                image: {
                  select: {
                    id: true,
                    url: true,
                    thumbnail_url: true,
                  },
                },
              },
            },
            VariantBasic: true,
            supplier: true,
            ProductSupply: true,
            ProductForSale: true,
          },
        });
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

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prisma.product.delete({
      where: {
        id: parseInt(req.params['id']),
      },
    });

    res.status(200).json({ data: 'DONE' });
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      next(handleError(err));
    }
    const e: any = Error('Server error should log here :)');
    next(e);
  }
};

function generateRandomSKU(): string {
  let sku = '';
  for (let i = 0; i < 8; i++) {
    sku += Math.floor(Math.random() * 10);
  }
  return sku;
}
