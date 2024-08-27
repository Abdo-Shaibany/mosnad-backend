import { Category } from './category.model';
import { Image } from './image.model';
import { ProductForSaleX } from './product_for_sale.model';
import { ProductSupply } from './product_supply.model';
import { SupplierGetOne } from './suppliers.model';
import { Variant } from './variant.model';
import { VariantBasic } from './variant_basic.model';

export interface ProductGetPaged {
  id: number;
  category?: Category;
  name: string;
  length: number;
  width: number;
  height: number;
  brand: string;
  SKU: string;
  Variant?: Variant[];
  image?: Image | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  expiredAt?: Date | null;
  deletedAt?: Date | null;
  supplierId: number;
  VariantBasic?: VariantBasic[];
  supply?: number;
  ProductForSale?: {
    status: 'pending' | 'active';
  };
}

export interface ProductGetOne {
  id: number;
  categoryId: number;
  name: string;
  length: number;
  width: number;
  height: number;
  brand: string;
  SKU: string;
  createdAt: Date; // ISO 8601 format
  updatedAt: Date; // ISO 8601 format
  expiredAt: Date | null; // ISO 8601 format or null
  deletedAt: Date | null; // ISO 8601 format or null
  supplierId: number | null;
  imageId?: number | null;
  image: Image | null;
  category: Category;
  Variant: Variant[];
  VariantBasic: VariantBasic[];
  ProductSupply: ProductSupply[];
  ProductForSale: ProductForSaleX[];
  supplier: SupplierGetOne;
}

export interface CreateProduct {
  id: number;
  name: string;
  categoryId: number;
  length: number;
  width: number;
  height: number;
  brand: string;
  expiredAt?: string;
  variantsBasic?: VariantBasic[];
  variants?: Variant[];
  supplierId: number;
  imageId: number;
}
