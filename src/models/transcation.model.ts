export interface Transactions {
    id?: number;
    fromId: number;
    from?: Account;
    to?: Account
    toId: number;
    description: string;
    amount: number;
    bank_currencyId: number;
    currency?: {
        id: string,
        text: string,
        short: string
    }
}

export interface Account {
    id: number;
    account_number: string;
    account_name: string;
    bankId: number;
    bank_currencyId: number;
    bank_locationId: number;
    supplierId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}