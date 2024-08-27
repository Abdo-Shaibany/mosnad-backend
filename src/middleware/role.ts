import { Request, Response, NextFunction } from 'express';
import { Role } from 'src/models/role.model';

// Middleware to check user roles
export const authorizeRoles = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {        
        // Assuming user roles are stored in req.user.roles
        const userRoles: Role[] = req.user?.roles || []; // Get the user's roles, default to an empty array

        // Check if the user has at least one of the required roles
        const hasRole = userRoles.some(userRole => roles.includes(userRole.name));

        if (hasRole) {
            return next(); // User has the required role, proceed to the next middleware
        } else {
            return res.status(403).json({ message: 'Unauthorized: You do not have the required role.' }); // Forbidden
        }
    };
};