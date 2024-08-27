import { Category } from "./category.model";
import { Image } from "./image.model";
import { ProductGetPaged } from "./product.model";

export interface ProductForSaleX {
  id: number;
  status: 'active' | 'pending' | string;
  description: string | null;
  supplierId: number;
}

export interface ProductForSaleGetOne {
  id: number;
  productId: number;
  product: ProductGetPaged;
  status: string;
  description: string | null;
  supplierId: number;
  images: Image[];
  VariantForSale: VariantForSale[];
}

export interface VariantForSale {
  id: number;
  value: string;
  cost: number | null;
  price: number | null;
  productForSaleId: number;
  imageId: number | null;
  SKU: string;
  cost_currencyId: number | null;
  price_currencyId: number | null;
  status: boolean;
  image?: Image | null;
}

export interface ProductForSalePut {
  id: number;
  status?: 'active' | 'pending';
  title: string;
  description: string;
  images: number[];
  variants?: {
    id: string;
    cost: string;
    costCurrency: string;
    priceCurrency: string;
    price: string;
  }[];
}