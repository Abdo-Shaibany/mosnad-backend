import { Option } from "./option.model";
import { SupplierGetPaged } from "./suppliers.model";

export interface AccountModel {
    id?: number;
    account_number: string;
    account_name: string;
    bank: Option;
    bankId: number;
    currency: Option;
    bank_currencyId: number;
    bank_location: Option;
    bank_locationId: number;
    supplier?: SupplierGetPaged | null;
    supplierId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    balance: number;
}