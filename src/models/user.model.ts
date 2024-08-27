import { Role } from "./role.model";

export interface User {
    id: number;
    email?: string | null;
    password?: string | null;
    username: string;
    phone?: string | null;
    roles: Role[]
}
