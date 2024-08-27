import { User } from "./auth.model";

export interface ActivityLog {
    id: number;
    user: User;
    userId: number;
    action: string;
    timestamp: Date;
}
