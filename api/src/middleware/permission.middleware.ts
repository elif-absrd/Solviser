// File: apps/api/src/middleware/permission.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const can = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !user.permissions || !Array.isArray(user.permissions)) {
            return res.status(403).json({ error: 'Forbidden: No permissions found.' });
        }
        

        // A Super Admin can do anything, regardless of their organization or roles.
        if (user.isSuperAdmin) {
            return next();
        }

        if (user.permissions.includes(requiredPermission)) {
            next(); // User has the specific permission required, so they can proceed.
        } else {
            return res.status(403).json({ error: 'Forbidden: You do not have the required permission.' });
        }
    };
};