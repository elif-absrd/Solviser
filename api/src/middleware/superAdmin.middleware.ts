import { Request, Response, NextFunction } from 'express';

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // This middleware runs AFTER authenticateToken, so req.user is guaranteed to exist.
    // It checks the flag set in the JWT during login.
    if (user && user.isSuperAdmin) {
        next(); // User is a super admin, proceed.
    } else {
        res.status(403).json({ error: 'Forbidden: Administrator access required.' });
    }
};
