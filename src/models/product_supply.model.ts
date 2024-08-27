import { Image } from './image.model';
import { ProductGetPaged } from './product.model';

export interface ProductSupply {
  id: number;
  inventorySupplyId?: number | null;
  variantName: string;
  variantSKU: string;
  amount: number;
  actualAmount: number;
  imageId?: number | null;
}

export interface ProductSupplyGetOne {
  id: number;
  product: ProductGetPaged;
  variantName: string;
  variantSKU: string;
  amount: number;
  actualAmount: number;
  variantId?: number | null;
  image?: Image;
}

export interface CreateProductSupply {
  productId: number;
  variantName: string;
  variantSKU: string;
  amount: number;
  actualAmount?: number;
  variantId?: number;
  imageId?: number;
}
