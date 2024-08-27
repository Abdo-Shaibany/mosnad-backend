export interface CreateSupplierAccount {
  id?: number;
  account_number: string;
  account_name: string;
  bankId: number;
  bank_currencyId: number;
  supplier_id?: number;
  bank_locationId: number;
}

export interface SupplierAccountGetOne {
  id: number;
  account_number: string;
  account_name: string;
  bankId: number;
  bank_currencyId: number;
  bank_locationId: number;
  supplierId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
