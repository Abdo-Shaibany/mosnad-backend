export interface Signup {
    email: string;
    password: string;
    username: string;
}

export interface User {
    email: string;
    password: string;
    username: string;
    roleId: number;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
}

export interface Login {
    email: string;
    password: string;
}

export interface PremissionModel {
    id: number;
    name: string;
}