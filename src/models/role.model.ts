export interface Role {
    id: number;
    name: string;
    premissions?: Premission[];
}


export interface Premission {
    id: number;
    name: string;
}

export interface RoleCreate {
    id?: number;
    name: string;
    premissions: {
        id: number
    }[];
}