import {
  CreateSupplierAccount,
  SupplierAccountGetOne,
} from './supplier_account.model';
import { User } from './user.model';

export interface CreateSupplier {
  id?: number;
  name: string;
  company: string;
  company_address: string;
  phone: string;
  account: CreateSupplierAccount;
}

export interface SupplierGetOne {
  id: number;
  name: string;
  company: string;
  phone: string;
  company_address: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  account?: SupplierAccountGetOne[] | null;
}

export interface SupplierGetPaged {
  id: number;
  name: string;
  company: string;
  company_address: string;
  user?: User | null;
}

export interface SupplierSearchable {
  name: string;
  company: string;
  company_address: string;
  phone: string;
}
