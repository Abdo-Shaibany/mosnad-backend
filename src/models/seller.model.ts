import { Account } from "./transcation.model";
import { User } from "./user.model";

export interface SellerCreate {
    name: string;
    address: string;
    phone: string;
    user: {
        email: string;
        username: string;
    }
}

export interface SellerGetOne {
    name: string;
    address: string;
    status: boolean;
    phone: string;
}

export interface SellerUpdate {
    id: number;
    name: string;
    address: string;
    phone: string;
}

// toggle status is a route for admins only :)