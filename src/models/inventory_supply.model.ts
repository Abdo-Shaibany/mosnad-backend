import { CreateOption, Option } from './option.model';
import {
  CreateProductSupply,
  ProductSupplyGetOne as ProductSupplyGetPaged,
} from './product_supply.model';

export interface InventorySupplyGetPaged {
  id: number;
  inventory: Option;
  productsSupply?: ProductSupplyGetPaged[];
  PO?: string | null;
  note?: string | null;
  refNumber?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date | null;
  deletedAt?: Date | null;
  receivedAt?: Date | null;
  supplierId: number;
}

export interface CreateInventorySupply {
  inventoryId: number;
  productsSupply: CreateProductSupply[];
  PO?: string;
  note?: string;
  refNumber?: string;
  status?: string;
  supplierId: number;
}

export interface UpdateInventorySupply {
  id: number;
  status?: 'pending' | 'cancelled' | 'done';
  productsSupply?: UpdateProductSupply[];
}
export interface UpdateProductSupply {
  id: number;
  actualAmount: number;
}
