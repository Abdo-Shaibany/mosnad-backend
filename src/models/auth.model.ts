import { Role } from "./role.model";

export interface Signup {
    email: string;
    password: string;
    username: string;
}

export interface User {
    id?: number;
    email: string;
    password: string;
    username: string;
    roleId: number;
    role?: Role;
}

export interface Login {
    email: string;
    password: string;
}

export interface ResetPassword {
    email: string;
}